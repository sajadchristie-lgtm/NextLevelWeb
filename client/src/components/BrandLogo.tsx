import { useEffect, useState } from "react";
import { getContent } from "../lib/api";
import { resolveAssetUrl } from "../lib/assets";

type BrandingJson = {
  logoUrl?: string;
};

type BrandLogoProps = {
  size?: number;
  className?: string;
  alt?: string;
};

let cachedLogoUrl: string | null | undefined;
const subscribers = new Set<(value: string | null) => void>();

export function notifyBrandingChanged(logoUrl: string | null) {
  cachedLogoUrl = logoUrl ?? null;
  subscribers.forEach((subscriber) => subscriber(cachedLogoUrl ?? null));
}

export function BrandLogo({ size = 40, className = "", alt = "Bilvård center i Kävlinge" }: BrandLogoProps) {
  const [logoUrl, setLogoUrl] = useState<string | null>(cachedLogoUrl ?? null);

  useEffect(() => {
    if (cachedLogoUrl !== undefined) {
      setLogoUrl(cachedLogoUrl);
    } else {
      getContent<BrandingJson>("site_branding")
        .then((payload) => {
          const next = payload?.content?.jsonData?.logoUrl?.trim() || null;
          cachedLogoUrl = next;
          setLogoUrl(next);
          subscribers.forEach((subscriber) => subscriber(next));
        })
        .catch(() => {
          cachedLogoUrl = null;
          setLogoUrl(null);
        });
    }

    const subscriber = (value: string | null) => setLogoUrl(value);
    subscribers.add(subscriber);
    return () => {
      subscribers.delete(subscriber);
    };
  }, []);

  if (logoUrl) {
    return (
      <img
        src={resolveAssetUrl(logoUrl)}
        alt={alt}
        width={size}
        height={size}
        className={`rounded-edge object-cover ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return <DefaultMark size={size} className={className} ariaLabel={alt} />;
}

export function DefaultMark({
  size = 40,
  className = "",
  ariaLabel
}: {
  size?: number;
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <svg
      viewBox="0 0 40 40"
      width={size}
      height={size}
      role={ariaLabel ? "img" : undefined}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="40" height="40" rx="10" fill="#0A0A0B" />
      <text
        x="20"
        y="21.5"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily='Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif'
        fontWeight={700}
        fontSize={22}
        letterSpacing={-1}
        fill="#FAFAFA"
      >
        B
      </text>
      <circle cx="30.5" cy="9.5" r="2.5" fill="#C77B45" />
    </svg>
  );
}
