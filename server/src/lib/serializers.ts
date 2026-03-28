import type { Prisma, SiteContent } from "@prisma/client";
import { getDiscountedPrice, isDiscountActive } from "./discount.js";

export type CarWithRelations = Prisma.CarGetPayload<{
  include: { images: true; discount: true };
}>;

export function parseMaybeJson<T>(value: string | null): T | null {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export function serializeContent(content: SiteContent) {
  return {
    ...content,
    jsonData: parseMaybeJson(content.jsonData)
  };
}

export function serializeCar(car: CarWithRelations) {
  const orderedImages = [...car.images].sort((a, b) => a.sortOrder - b.sortOrder);
  const coverImage = orderedImages.find((image) => image.isCover) ?? orderedImages[0] ?? null;
  const finalPrice = getDiscountedPrice(car.price, car.discount);

  return {
    ...car,
    images: orderedImages,
    coverImage,
    pricing: {
      originalPrice: car.price,
      finalPrice,
      discountActive: isDiscountActive(car.discount),
      savings: Number((car.price - finalPrice).toFixed(2))
    }
  };
}

