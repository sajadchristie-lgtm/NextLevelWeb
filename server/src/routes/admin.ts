import bcrypt from "bcryptjs";
import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { signAdminAccessToken, signAdminToken } from "../lib/auth.js";
import { serializeCar, serializeContent } from "../lib/serializers.js";
import type { CarWithRelations } from "../lib/serializers.js";
import { removeUploadedFile, toPublicUploadPath, upload } from "../lib/upload.js";
import { requireAdmin, requireAdminAccess, hasAdminAccess } from "../middleware/auth.js";
import { config } from "../config.js";

const router = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

const accessSchema = z.object({
  code: z.string().min(1)
});

const contentSchema = z.object({
  title: z.string().min(2),
  content: z.string().min(10),
  jsonData: z.any().optional().nullable(),
  isActive: z.boolean().default(true)
});

const serviceItemSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2),
  slug: z.string().optional(),
  description: z.string().min(10),
  order: z.number().int().min(0),
  isActive: z.boolean().default(true)
});

const servicesSchema = z.object({
  services: z.array(serviceItemSchema),
  removedIds: z.array(z.string()).default([])
});

const carPayloadSchema = z.object({
  title: z.string().min(2),
  brand: z.string().min(1),
  model: z.string().min(1),
  slug: z.string().optional(),
  year: z.number().int().min(1900).max(2100),
  price: z.number().positive(),
  description: z.string().min(20),
  mileage: z.number().int().nonnegative(),
  fuelType: z.string().min(1),
  transmission: z.string().min(1),
  color: z.string().min(1),
  condition: z.string().min(1),
  status: z.enum(["AVAILABLE", "SOLD", "HIDDEN"]),
  featured: z.boolean().default(false),
  existingImages: z
    .array(
      z.object({
        id: z.string(),
        imageUrl: z.string(),
        imageName: z.string(),
        altText: z.string().nullable().optional(),
        sortOrder: z.number().int().min(0),
        isCover: z.boolean()
      })
    )
    .default([]),
  deletedImageIds: z.array(z.string()).default([]),
  discount: z
    .object({
      type: z.enum(["PERCENTAGE", "FIXED"]),
      value: z.number().min(0),
      isActive: z.boolean().default(true),
      startDate: z.string().nullable().optional(),
      endDate: z.string().nullable().optional()
    })
    .nullable()
    .optional()
});

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getAdminAccessCookieOptions() {
  return {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: config.isProduction ? ("none" as const) : ("lax" as const),
    maxAge: 1000 * 60 * 60 * 24 * 7,
    path: "/api/admin"
  };
}

async function ensureUniqueCarSlug(base: string, excludeId?: string) {
  const normalizedBase = slugify(base) || "car";
  let slug = normalizedBase;
  let counter = 1;

  while (true) {
    const existing = await prisma.car.findFirst({
      where: {
        slug,
        ...(excludeId ? { NOT: { id: excludeId } } : {})
      }
    });

    if (!existing) {
      return slug;
    }

    counter += 1;
    slug = `${normalizedBase}-${counter}`;
  }
}

function parseCarPayload(rawData: unknown) {
  if (Array.isArray(rawData)) {
    rawData = rawData[0];
  }

  if (typeof rawData !== "string") {
    throw new Error("Missing form data.");
  }

  const parsed = JSON.parse(rawData) as Record<string, unknown>;

  return carPayloadSchema.parse({
    ...parsed,
    year: Number(parsed.year),
    price: Number(parsed.price),
    mileage: Number(parsed.mileage),
    featured: Boolean(parsed.featured),
    existingImages: Array.isArray(parsed.existingImages) ? parsed.existingImages : [],
    deletedImageIds: Array.isArray(parsed.deletedImageIds) ? parsed.deletedImageIds : [],
    discount:
      parsed.discount && typeof parsed.discount === "object"
        ? {
            ...(parsed.discount as Record<string, unknown>),
            value: Number((parsed.discount as Record<string, unknown>).value),
            isActive: Boolean((parsed.discount as Record<string, unknown>).isActive)
          }
        : null
  });
}

async function normalizeCoverImage(carId: string) {
  const images = await prisma.carImage.findMany({
    where: { carId },
    orderBy: [{ isCover: "desc" }, { sortOrder: "asc" }, { createdAt: "asc" }]
  });

  if (!images.length) {
    return;
  }

  const preferredId = images.find((image) => image.isCover)?.id ?? images[0].id;
  await prisma.$transaction(
    images.map((image) =>
      prisma.carImage.update({
        where: { id: image.id },
        data: { isCover: image.id === preferredId }
      })
    )
  );
}

router.post("/access/start", (request, response) => {
  const { code } = accessSchema.parse(request.body);

  if (code !== config.adminAccessCode) {
    response.status(401).json({ message: "Invalid private access code." });
    return;
  }

  response.cookie(config.adminAccessCookieName, signAdminAccessToken(), getAdminAccessCookieOptions());
  response.json({ unlocked: true });
});

router.get("/access/check", (request, response) => {
  response.json({ unlocked: hasAdminAccess(request) });
});

router.post("/access/logout", (_request, response) => {
  response.clearCookie(config.adminAccessCookieName, {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: config.isProduction ? ("none" as const) : ("lax" as const),
    path: "/api/admin"
  });
  response.json({ unlocked: false });
});

router.use(requireAdminAccess);

router.post("/auth/login", async (request, response) => {
  const { email, password } = loginSchema.parse(request.body);
  const user = await prisma.adminUser.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    response.status(401).json({ message: "Invalid email or password." });
    return;
  }

  const token = signAdminToken({
    sub: user.id,
    email: user.email,
    role: user.role
  });

  response.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role
    }
  });
});

router.use(requireAdmin);

router.get("/auth/me", async (_request, response) => {
  response.json({ user: response.locals.auth });
});

router.get("/dashboard", async (_request, response) => {
  const [totalCars, availableCars, soldCars, featuredCars, totalServices, totalInquiries, recentCars, recentInquiries] =
    await Promise.all([
      prisma.car.count(),
      prisma.car.count({ where: { status: "AVAILABLE" } }),
      prisma.car.count({ where: { status: "SOLD" } }),
      prisma.car.count({ where: { featured: true } }),
      prisma.service.count({ where: { isActive: true } }),
      prisma.inquiry.count(),
      prisma.car.findMany({
        include: { images: true, discount: true },
        orderBy: { createdAt: "desc" },
        take: 4
      }),
      prisma.inquiry.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { car: true }
      })
    ]);

  response.json({
    stats: {
      totalCars,
      availableCars,
      soldCars,
      featuredCars,
      totalServices,
      totalInquiries
    },
    recentCars: recentCars.map(serializeCar),
    recentInquiries
  });
});

router.get("/cars", async (_request, response) => {
  const cars = await prisma.car.findMany({
    include: { images: true, discount: true },
    orderBy: { updatedAt: "desc" }
  });

  response.json({ cars: cars.map(serializeCar) });
});

router.get("/cars/:id", async (request, response) => {
  const carId = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
  const car = await prisma.car.findUnique({
    where: { id: carId },
    include: { images: true, discount: true }
  });

  if (!car) {
    response.status(404).json({ message: "Car not found." });
    return;
  }

  response.json({ car: serializeCar(car) });
});

router.post("/cars", upload.array("images", 8), async (request, response) => {
  const files = (request.files as Express.Multer.File[] | undefined) ?? [];
  const payload = parseCarPayload(request.body.data);
  const slug = await ensureUniqueCarSlug(payload.slug || `${payload.year}-${payload.brand}-${payload.model}`);

  const car = await prisma.car.create({
    data: {
      slug,
      title: payload.title,
      brand: payload.brand,
      model: payload.model,
      year: payload.year,
      price: payload.price,
      description: payload.description,
      mileage: payload.mileage,
      fuelType: payload.fuelType,
      transmission: payload.transmission,
      color: payload.color,
      condition: payload.condition,
      status: payload.status,
      featured: payload.featured
    }
  });

  if (files.length) {
    await prisma.carImage.createMany({
      data: files.map((file, index) => ({
        carId: car.id,
        imageUrl: toPublicUploadPath(file.path),
        imageName: file.filename,
        altText: payload.title,
        sortOrder: index,
        isCover: index === 0
      }))
    });
  }

  if (payload.discount && payload.discount.value > 0) {
    await prisma.discount.create({
      data: {
        carId: car.id,
        type: payload.discount.type,
        value: payload.discount.value,
        isActive: payload.discount.isActive,
        startDate: payload.discount.startDate ? new Date(payload.discount.startDate) : null,
        endDate: payload.discount.endDate ? new Date(payload.discount.endDate) : null
      }
    });
  }

  const createdCar = await prisma.car.findUnique({
    where: { id: car.id },
    include: { images: true, discount: true }
  });

  response.status(201).json({ car: createdCar ? serializeCar(createdCar) : null });
});

router.put("/cars/:id", upload.array("images", 8), async (request, response) => {
  const carId = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
  const files = (request.files as Express.Multer.File[] | undefined) ?? [];
  const payload = parseCarPayload(request.body.data);
  const existingCar: CarWithRelations | null = await prisma.car.findUnique({
    where: { id: carId },
    include: { images: true, discount: true }
  });

  if (!existingCar) {
    response.status(404).json({ message: "Car not found." });
    return;
  }

  const slug = await ensureUniqueCarSlug(
    payload.slug || `${payload.year}-${payload.brand}-${payload.model}`,
    existingCar.id
  );
  const keptImageIds = new Set(payload.existingImages.map((image) => image.id));
  const imagesToDelete = existingCar.images.filter(
    (image) => payload.deletedImageIds.includes(image.id) || !keptImageIds.has(image.id)
  );

  await prisma.car.update({
    where: { id: existingCar.id },
    data: {
      slug,
      title: payload.title,
      brand: payload.brand,
      model: payload.model,
      year: payload.year,
      price: payload.price,
      description: payload.description,
      mileage: payload.mileage,
      fuelType: payload.fuelType,
      transmission: payload.transmission,
      color: payload.color,
      condition: payload.condition,
      status: payload.status,
      featured: payload.featured
    }
  });

  if (imagesToDelete.length) {
    await prisma.carImage.deleteMany({
      where: { id: { in: imagesToDelete.map((image) => image.id) } }
    });
    await Promise.all(imagesToDelete.map((image) => removeUploadedFile(image.imageUrl)));
  }

  if (payload.existingImages.length) {
    await prisma.$transaction(
      payload.existingImages.map((image) =>
        prisma.carImage.update({
          where: { id: image.id },
          data: {
            altText: image.altText ?? null,
            sortOrder: image.sortOrder,
            isCover: image.isCover
          }
        })
      )
    );
  }

  if (files.length) {
    const baseOrder =
      payload.existingImages.reduce((max, image) => Math.max(max, image.sortOrder), -1) + 1;

    await prisma.carImage.createMany({
      data: files.map((file, index) => ({
        carId: existingCar.id,
        imageUrl: toPublicUploadPath(file.path),
        imageName: file.filename,
        altText: payload.title,
        sortOrder: baseOrder + index,
        isCover: payload.existingImages.length === 0 && index === 0
      }))
    });
  }

  if (payload.discount && payload.discount.value > 0) {
    await prisma.discount.upsert({
      where: { carId: existingCar.id },
      update: {
        type: payload.discount.type,
        value: payload.discount.value,
        isActive: payload.discount.isActive,
        startDate: payload.discount.startDate ? new Date(payload.discount.startDate) : null,
        endDate: payload.discount.endDate ? new Date(payload.discount.endDate) : null
      },
      create: {
        carId: existingCar.id,
        type: payload.discount.type,
        value: payload.discount.value,
        isActive: payload.discount.isActive,
        startDate: payload.discount.startDate ? new Date(payload.discount.startDate) : null,
        endDate: payload.discount.endDate ? new Date(payload.discount.endDate) : null
      }
    });
  } else if (existingCar.discount) {
    await prisma.discount.delete({ where: { carId: existingCar.id } });
  }

  await normalizeCoverImage(existingCar.id);

  const updatedCar = await prisma.car.findUnique({
    where: { id: existingCar.id },
    include: { images: true, discount: true }
  });

  response.json({ car: updatedCar ? serializeCar(updatedCar) : null });
});

router.delete("/cars/:id", async (request, response) => {
  const carId = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
  const car = await prisma.car.findUnique({
    where: { id: carId },
    include: { images: true }
  });

  if (!car) {
    response.status(404).json({ message: "Car not found." });
    return;
  }

  await prisma.car.delete({ where: { id: car.id } });
  await Promise.all(car.images.map((image) => removeUploadedFile(image.imageUrl)));

  response.json({ message: "Car deleted." });
});

router.get("/services", async (_request, response) => {
  const services = await prisma.service.findMany({ orderBy: { order: "asc" } });
  response.json({ services });
});

router.put("/services", async (request, response) => {
  const payload = servicesSchema.parse(request.body);

  if (payload.removedIds.length) {
    await prisma.service.deleteMany({ where: { id: { in: payload.removedIds } } });
  }

  const savedServices = await Promise.all(
    payload.services.map(async (service) => {
      const slug = slugify(service.slug || service.title);

      if (service.id) {
        return prisma.service.update({
          where: { id: service.id },
          data: {
            title: service.title,
            slug,
            description: service.description,
            order: service.order,
            isActive: service.isActive
          }
        });
      }

      return prisma.service.create({
          data: {
            title: service.title,
            slug,
            description: service.description,
            order: service.order,
            isActive: service.isActive
          }
      });
    })
  );

  response.json({ services: savedServices });
});

router.get("/content", async (_request, response) => {
  const content = await prisma.siteContent.findMany({ orderBy: { key: "asc" } });
  response.json({ content: content.map(serializeContent) });
});

router.put("/content/:key", async (request, response) => {
  const payload = contentSchema.parse(request.body);
  const saved = await prisma.siteContent.upsert({
    where: { key: request.params.key },
    update: {
      title: payload.title,
      content: payload.content,
      jsonData: payload.jsonData ? JSON.stringify(payload.jsonData) : null,
      isActive: payload.isActive
    },
    create: {
      key: request.params.key,
      title: payload.title,
      content: payload.content,
      jsonData: payload.jsonData ? JSON.stringify(payload.jsonData) : null,
      isActive: payload.isActive
    }
  });

  response.json({ content: serializeContent(saved) });
});

router.get("/inquiries", async (_request, response) => {
  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
    take: 25,
    include: { car: true }
  });

  response.json({ inquiries });
});

router.use((error: unknown, _request: Request, response: Response, next: NextFunction) => {
  if (error instanceof SyntaxError) {
    response.status(400).json({ message: "Invalid JSON payload." });
    return;
  }

  if (error instanceof Error && error.message === "Missing form data.") {
    response.status(400).json({ message: error.message });
    return;
  }

  if (error instanceof Error && error.message.startsWith("Only image uploads")) {
    response.status(400).json({ message: error.message });
    return;
  }

  next(error);
});

export const adminRouter = router;
