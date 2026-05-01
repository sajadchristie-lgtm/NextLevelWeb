import { useEffect, useState } from "react";
import { getContent } from "./api";
import { SERVICE_PACKAGES, STANDALONE_SERVICES, type SizeKey } from "./services-data";

export type PackagePricing = {
  small: number;
  medium: number;
  large: number;
  addons: Array<{ slug: string; price: number }>;
};

export type PricingState = {
  packages: Record<string, PackagePricing>;
  standalone: Record<string, number>;
};

export const PRICING_KEY = "service_pricing";

export function buildDefaultPricing(): PricingState {
  const packages: Record<string, PackagePricing> = {};
  for (const pkg of SERVICE_PACKAGES) {
    packages[pkg.slug] = {
      small: pkg.sizes.small,
      medium: pkg.sizes.medium,
      large: pkg.sizes.large,
      addons: (pkg.addons || []).map((addon) => ({
        slug: slugifyAddon(addon.label.en),
        price: addon.price
      }))
    };
  }
  const standalone: Record<string, number> = {};
  for (const svc of STANDALONE_SERVICES) {
    standalone[svc.slug] = svc.price;
  }
  return { packages, standalone };
}

export function slugifyAddon(label: string) {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function mergePricing(defaults: PricingState, override: Partial<PricingState> | null | undefined): PricingState {
  if (!override) return defaults;
  return {
    packages: { ...defaults.packages, ...(override.packages || {}) },
    standalone: { ...defaults.standalone, ...(override.standalone || {}) }
  };
}

export function getPackagePrice(pricing: PricingState, slug: string, size: SizeKey): number {
  const fallback = SERVICE_PACKAGES.find((p) => p.slug === slug)?.sizes[size] ?? 0;
  return pricing.packages[slug]?.[size] ?? fallback;
}

export function getAddonPrice(pricing: PricingState, packageSlug: string, addonSlug: string): number | null {
  const adminAddon = pricing.packages[packageSlug]?.addons?.find((a) => a.slug === addonSlug);
  if (adminAddon) return adminAddon.price;
  const pkg = SERVICE_PACKAGES.find((p) => p.slug === packageSlug);
  const original = pkg?.addons?.find((a) => slugifyAddon(a.label.en) === addonSlug);
  return original?.price ?? null;
}

export function getStandalonePrice(pricing: PricingState, slug: string): number {
  return pricing.standalone[slug] ?? STANDALONE_SERVICES.find((s) => s.slug === slug)?.price ?? 0;
}

export function usePricing(): PricingState {
  const [pricing, setPricing] = useState<PricingState>(() => buildDefaultPricing());

  useEffect(() => {
    let cancelled = false;
    getContent<Partial<PricingState>>(PRICING_KEY)
      .then((payload) => {
        if (cancelled) return;
        if (payload?.content?.jsonData) {
          setPricing((current) => mergePricing(current, payload.content.jsonData));
        }
      })
      .catch(() => {
        // No admin override yet — defaults stay in place
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return pricing;
}
