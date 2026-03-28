import bcrypt from "bcryptjs";
import { PrismaClient, DiscountType } from "@prisma/client";

const prisma = new PrismaClient();

function unicode(value: string) {
  return value.replace(/\\u([0-9a-fA-F]{4})/g, (_match, code) =>
    String.fromCharCode(parseInt(code, 16))
  );
}

function hoursData() {
  return [
    { day: "Saturday", hours: "9:00 AM - 7:00 PM" },
    { day: "Sunday", hours: "9:00 AM - 7:00 PM" },
    { day: "Monday", hours: "9:00 AM - 7:00 PM" },
    { day: "Tuesday", hours: "9:00 AM - 7:00 PM" },
    { day: "Wednesday", hours: "9:00 AM - 7:00 PM" },
    { day: "Thursday", hours: "9:00 AM - 5:00 PM" },
    { day: "Friday", hours: "Closed" }
  ];
}

async function main() {
  const passwordHash = await bcrypt.hash("Admin123!", 10);

  await prisma.inquiry.deleteMany();
  await prisma.discount.deleteMany();
  await prisma.carImage.deleteMany();
  await prisma.car.deleteMany();
  await prisma.service.deleteMany();
  await prisma.siteContent.deleteMany();

  await prisma.adminUser.upsert({
    where: { email: "admin@autovault.local" },
    update: { passwordHash, role: "admin" },
    create: {
      email: "admin@autovault.local",
      passwordHash,
      role: "admin"
    }
  });

  await prisma.service.createMany({
    data: [
      {
        title: "Exterior Car Wash",
        slug: "exterior-car-wash",
        description:
          "A careful exterior wash that lifts daily dirt, road film, and residue while restoring a clean gloss finish.",
        order: 1
      },
      {
        title: "Interior Cleaning",
        slug: "interior-cleaning",
        description:
          "Deep vacuuming and detailed interior cleaning for seats, carpets, trims, and touch surfaces.",
        order: 2
      },
      {
        title: "Full Car Reconditioning",
        slug: "full-car-reconditioning",
        description:
          "A complete inside-and-out refresh combining deep cleaning, surface restoration, and visual improvement.",
        order: 3
      },
      {
        title: "Polishing & Waxing",
        slug: "polishing-waxing",
        description:
          "Enhance paint depth and shine with machine polishing support and durable wax protection.",
        order: 4
      },
      {
        title: "Paint Protection",
        slug: "paint-protection",
        description:
          "Protective treatment designed to defend painted surfaces from dust, weather exposure, and daily wear.",
        order: 5
      },
      {
        title: "Tires Change",
        slug: "tires-change",
        description:
          "Seasonal tire changes completed carefully and efficiently to keep your car safe, balanced, and ready for the road.",
        order: 6
      }
    ]
  });

  await prisma.siteContent.createMany({
    data: [
      {
        key: "homepage_sections",
        title: unicode("Bilv\\u00e5rd center i K\\u00e4vlinge"),
        content:
          unicode("Car sales and professional car care with a clean, modern, customer-first experience in K\\u00e4vlinge."),
        jsonData: JSON.stringify({
          heroPrimaryCta: "/cars",
          heroSecondaryCta: "/services",
          stats: [
            { label: "Vehicles ready to view", value: "" },
            { label: "Detailing packages", value: "" },
            { label: "Customer-first support", value: "" }
          ],
          whyChooseUs: [
            "Carefully presented vehicles with transparent pricing",
            "Skill, precision, and the right tools for every car care job",
            "Fast, mobile-friendly inquiry and booking flow"
          ]
        }),
        isActive: true
      },
      {
        key: "about_page",
        title: unicode("About Bilv\\u00e5rd center i K\\u00e4vlinge"),
        content:
          unicode(
            "At Car Care Center in K\\u00e4vlinge, our goal is simple: Deliver results that make customers come back. We combine skill, precision, and the right tools to ensure your car looks its best - every time. Working in this field since 1997."
          ),
        jsonData: JSON.stringify({
          missionTitle: "Our goal",
          missionBody:
            "Deliver results that make customers come back with skill, precision, and the right tools.",
          valuesTitle: "What customers can expect",
          values: ["Skilled workmanship", "Precision in every detail", "Results that last"],
          teamTitle: "Built around repeat customers",
          teamBody:
            "We focus on quality work and consistent finishes so every visit leaves your car looking its best."
        }),
        isActive: true
      },
      {
        key: "location_page",
        title: "Visit our showroom and detailing bay",
        content:
          unicode(
            "Easy-to-reach location in K\\u00e4vlinge with convenient hours and direct support for both car sales and service bookings."
          ),
        jsonData: JSON.stringify({
          address: unicode("H\\u00f6gsv\\u00e4gen 5, 244 41 K\\u00e4vlinge, Sweden"),
          mapEmbedUrl: "https://www.google.com/maps?q=H%C3%B6gsv%C3%A4gen+5,+244+41+K%C3%A4vlinge,+Sweden&output=embed",
          hours: [
            { day: "Sunday", hours: "Closed" },
            { day: "Monday", hours: "10:00 AM - 6:00 PM" },
            { day: "Tuesday", hours: "10:00 AM - 6:00 PM" },
            { day: "Wednesday", hours: "10:00 AM - 6:00 PM" },
            { day: "Thursday", hours: "10:00 AM - 6:00 PM" },
            { day: "Friday", hours: "10:00 AM - 6:00 PM" },
            { day: "Saturday", hours: "10:00 AM - 4:00 PM" }
          ],
          notes:
            "Call before arriving for premium inventory viewings or same-day detailing availability.",
          phone: "073-727 22 92"
        }),
        isActive: true
      },
      {
        key: "contact_page",
        title: "Talk to our sales and service team",
        content:
          "Reach out for vehicle inquiries, trade-in questions, detailing appointments, or location assistance.",
        jsonData: JSON.stringify({
          phone: "073-727 22 92",
          email: "",
          whatsapp: "",
          recipientEmail: "",
          address: unicode("H\\u00f6gsv\\u00e4gen 5, 244 41 K\\u00e4vlinge, Sweden"),
          socialLinks: [],
          hours: [
            { day: "Sunday", hours: "Closed" },
            { day: "Monday", hours: "10:00 AM - 6:00 PM" },
            { day: "Tuesday", hours: "10:00 AM - 6:00 PM" },
            { day: "Wednesday", hours: "10:00 AM - 6:00 PM" },
            { day: "Thursday", hours: "10:00 AM - 6:00 PM" },
            { day: "Friday", hours: "10:00 AM - 6:00 PM" },
            { day: "Saturday", hours: "10:00 AM - 4:00 PM" }
          ]
        }),
        isActive: true
      }
    ]
  });

  const cars = [
    {
      slug: "2023-mercedes-benz-c300-amg-line",
      title: "2023 Mercedes-Benz C300 AMG Line",
      brand: "Mercedes-Benz",
      model: "C300",
      year: 2023,
      price: 48900,
      description:
        "Luxury sport sedan with premium cabin materials, digital cockpit features, and smooth turbocharged performance.",
      mileage: 18500,
      fuelType: "Petrol",
      transmission: "Automatic",
      color: "Obsidian Black",
      condition: "Excellent",
      status: "AVAILABLE" as const,
      featured: true,
      imageUrl: "/uploads/demo/mercedes-c300.svg",
      discount: { type: DiscountType.PERCENTAGE, value: 8, isActive: true }
    },
    {
      slug: "2022-bmw-x5-xdrive40i",
      title: "2022 BMW X5 xDrive40i",
      brand: "BMW",
      model: "X5",
      year: 2022,
      price: 61250,
      description:
        "Spacious and refined SUV with strong performance, upscale comfort, and confident long-distance capability.",
      mileage: 26400,
      fuelType: "Petrol",
      transmission: "Automatic",
      color: "Mineral White",
      condition: "Excellent",
      status: "AVAILABLE" as const,
      featured: true,
      imageUrl: "/uploads/demo/bmw-x5.svg"
    },
    {
      slug: "2021-audi-a6-quattro",
      title: "2021 Audi A6 Quattro",
      brand: "Audi",
      model: "A6",
      year: 2021,
      price: 39800,
      description:
        "Executive sedan with quattro confidence, composed ride quality, and a beautifully finished interior.",
      mileage: 38120,
      fuelType: "Petrol",
      transmission: "Automatic",
      color: "Daytona Gray",
      condition: "Very Good",
      status: "AVAILABLE" as const,
      featured: false,
      imageUrl: "/uploads/demo/audi-a6.svg",
      discount: { type: DiscountType.FIXED, value: 1800, isActive: true }
    },
    {
      slug: "2020-toyota-land-cruiser-vxr",
      title: "2020 Toyota Land Cruiser VXR",
      brand: "Toyota",
      model: "Land Cruiser",
      year: 2020,
      price: 55900,
      description:
        "Well-kept full-size SUV known for durability, commanding presence, and all-conditions capability.",
      mileage: 52200,
      fuelType: "Petrol",
      transmission: "Automatic",
      color: "Pearl White",
      condition: "Very Good",
      status: "AVAILABLE" as const,
      featured: true,
      imageUrl: "/uploads/demo/toyota-land-cruiser.svg"
    },
    {
      slug: "2024-kia-sportage-gt-line",
      title: "2024 Kia Sportage GT-Line",
      brand: "Kia",
      model: "Sportage",
      year: 2024,
      price: 33400,
      description:
        "Modern compact SUV with bold styling, advanced driver tech, and an efficient day-to-day ownership profile.",
      mileage: 9800,
      fuelType: "Hybrid",
      transmission: "Automatic",
      color: "Matte Gray",
      condition: "Like New",
      status: "AVAILABLE" as const,
      featured: false,
      imageUrl: "/uploads/demo/kia-sportage.svg"
    },
    {
      slug: "2019-ford-mustang-gt-premium",
      title: "2019 Ford Mustang GT Premium",
      brand: "Ford",
      model: "Mustang GT",
      year: 2019,
      price: 36200,
      description:
        "V8 coupe with iconic styling, engaging performance, and premium trim details for weekend thrills.",
      mileage: 44450,
      fuelType: "Petrol",
      transmission: "Automatic",
      color: "Race Red",
      condition: "Good",
      status: "SOLD" as const,
      featured: false,
      imageUrl: "/uploads/demo/ford-mustang.svg"
    }
  ];

  for (const [index, car] of cars.entries()) {
    await prisma.car.create({
      data: {
        slug: car.slug,
        title: car.title,
        brand: car.brand,
        model: car.model,
        year: car.year,
        price: car.price,
        description: car.description,
        mileage: car.mileage,
        fuelType: car.fuelType,
        transmission: car.transmission,
        color: car.color,
        condition: car.condition,
        status: car.status,
        featured: car.featured,
        images: {
          create: {
            imageUrl: car.imageUrl,
            imageName: `${car.slug}.svg`,
            altText: car.title,
            sortOrder: 0,
            isCover: true
          }
        },
        ...(car.discount
          ? {
              discount: {
                create: {
                  ...car.discount,
                  startDate: new Date(Date.now() - 1000 * 60 * 60 * 24),
                  endDate:
                    index % 2 === 0 ? new Date(Date.now() + 1000 * 60 * 60 * 24 * 14) : null
                }
              }
            }
          : {})
      }
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
