import type { Prisma } from "@prisma/client";
import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { serializeCar, serializeContent } from "../lib/serializers.js";

const router = Router();

const inquirySchema = z.object({
  kind: z.enum(["CONTACT", "CAR"]).default("CONTACT"),
  carId: z.string().optional().nullable(),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional().nullable(),
  message: z.string().min(10)
});

router.get("/home", async (_request, response) => {
  const [featuredCars, services, homepageContent, aboutContent, locationContent, contactContent] =
    await Promise.all([
      prisma.car.findMany({
        where: { featured: true, status: "AVAILABLE" },
        include: { images: true, discount: true },
        orderBy: { createdAt: "desc" },
        take: 3
      }),
      prisma.service.findMany({ where: { isActive: true }, orderBy: { order: "asc" }, take: 3 }),
      prisma.siteContent.findUnique({ where: { key: "homepage_sections" } }),
      prisma.siteContent.findUnique({ where: { key: "about_page" } }),
      prisma.siteContent.findUnique({ where: { key: "location_page" } }),
      prisma.siteContent.findUnique({ where: { key: "contact_page" } })
    ]);

  response.json({
    featuredCars: featuredCars.map(serializeCar),
    services,
    homepageContent: homepageContent ? serializeContent(homepageContent) : null,
    aboutContent: aboutContent ? serializeContent(aboutContent) : null,
    locationContent: locationContent ? serializeContent(locationContent) : null,
    contactContent: contactContent ? serializeContent(contactContent) : null
  });
});

router.get("/cars", async (request, response) => {
  const querySchema = z.object({
    brand: z.string().optional(),
    year: z.string().optional(),
    status: z.enum(["AVAILABLE", "SOLD"]).optional(),
    search: z.string().optional(),
    sort: z
      .enum(["newest", "price-asc", "price-desc", "year-desc", "year-asc"])
      .optional()
      .default("newest")
  });

  const query = querySchema.parse(request.query);
  const where: Prisma.CarWhereInput = {
    status: query.status ?? undefined,
    brand: query.brand || undefined,
    year: query.year ? Number(query.year) : undefined,
    OR: query.search
      ? [
          { title: { contains: query.search } },
          { brand: { contains: query.search } },
          { model: { contains: query.search } }
        ]
      : undefined,
    NOT: [{ status: "HIDDEN" as const }]
  };

  const orderBy: Prisma.CarOrderByWithRelationInput[] =
    query.sort === "price-asc"
      ? [{ price: "asc" as const }]
      : query.sort === "price-desc"
        ? [{ price: "desc" as const }]
        : query.sort === "year-asc"
          ? [{ year: "asc" as const }]
          : query.sort === "year-desc"
            ? [{ year: "desc" as const }]
            : [{ createdAt: "desc" as const }];

  const [cars, brands] = await Promise.all([
    prisma.car.findMany({
      where,
      include: { images: true, discount: true },
      orderBy
    }),
    prisma.car.findMany({
      where: { NOT: [{ status: "HIDDEN" }] },
      select: { brand: true },
      distinct: ["brand"],
      orderBy: { brand: "asc" }
    })
  ]);

  response.json({
    cars: cars.map(serializeCar),
    brands: brands.map((entry) => entry.brand)
  });
});

router.get("/cars/:slug", async (request, response) => {
  const slug = request.params.slug;
  const car = await prisma.car.findFirst({
    where: {
      OR: [{ id: slug }, { slug }],
      NOT: [{ status: "HIDDEN" }]
    },
    include: { images: true, discount: true }
  });

  if (!car) {
    response.status(404).json({ message: "Car not found." });
    return;
  }

  response.json({ car: serializeCar(car) });
});

router.get("/services", async (_request, response) => {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" }
  });

  response.json({ services });
});

router.get("/content/:key", async (request, response) => {
  const content = await prisma.siteContent.findUnique({
    where: { key: request.params.key }
  });

  if (!content || !content.isActive) {
    response.status(404).json({ message: "Content not found." });
    return;
  }

  response.json({ content: serializeContent(content) });
});

router.post("/inquiries", async (request, response) => {
  const payload = inquirySchema.parse(request.body);

  const inquiry = await prisma.inquiry.create({
    data: {
      kind: payload.kind,
      carId: payload.carId ?? null,
      name: payload.name,
      email: payload.email,
      phone: payload.phone ?? null,
      message: payload.message
    }
  });

  response.status(201).json({
    message: "Inquiry received. The team will reach out soon.",
    inquiryId: inquiry.id
  });
});

export const publicRouter = router;
