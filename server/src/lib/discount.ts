import type { Discount } from "@prisma/client";

export function isDiscountActive(discount: Discount | null | undefined) {
  if (!discount || !discount.isActive) {
    return false;
  }

  const now = new Date();
  const startsOkay = !discount.startDate || discount.startDate <= now;
  const endsOkay = !discount.endDate || discount.endDate >= now;

  return startsOkay && endsOkay && discount.value > 0;
}

export function getDiscountedPrice(price: number, discount: Discount | null | undefined) {
  if (!isDiscountActive(discount)) {
    return price;
  }

  const reduction =
    discount?.type === "PERCENTAGE" ? price * ((discount.value ?? 0) / 100) : discount?.value ?? 0;

  return Math.max(0, Number((price - reduction).toFixed(2)));
}

