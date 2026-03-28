import type { Car, Discount } from "../types";

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: "SEK",
    maximumFractionDigits: 0
  }).format(value);
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

export function getDiscountBadge(discount: Discount | null) {
  if (!discount) {
    return null;
  }

  return discount.type === "PERCENTAGE" ? `${discount.value}% OFF` : `${formatCurrency(discount.value)} OFF`;
}

export function getCarSubtitle(car: Car) {
  return `${car.year} • ${car.transmission} • ${car.fuelType}`;
}
