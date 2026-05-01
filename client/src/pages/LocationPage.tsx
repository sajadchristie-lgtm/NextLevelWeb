import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getContent } from "../lib/api";
import type { SiteContent } from "../types";
import { translateDay, translateHours, useLanguage } from "../lib/i18n";

type LocationJson = {
  address?: string;
  mapEmbedUrl?: string;
  hours?: Array<{ day: string; hours: string }>;
  notes?: string;
  phone?: string;
};

export function LocationPage() {
  const [content, setContent] = useState<SiteContent<LocationJson> | null>(null);
  const { language, t } = useLanguage();

  useEffect(() => {
    getContent<LocationJson>("location_page")
      .then((payload) => setContent(payload.content))
      .catch(() => setContent(null));
  }, []);

  const phone = content?.jsonData?.phone;
  const address = content?.jsonData?.address;
  const hours = content?.jsonData?.hours || [];
  const mapEmbedUrl = content?.jsonData?.mapEmbedUrl;

  return (
    <div className="space-y-20 pb-24 pt-16 sm:space-y-24 sm:pt-24">
      {/* HERO */}
      <section className="container-shell">
        <div className="max-w-3xl space-y-6">
          <p className="text-sm font-medium text-slate">{t("location.eyebrow")}</p>
          <h1 className="h-display">{t("location.title")}</h1>
          <p className="lead">{t("location.copy")}</p>
        </div>
      </section>

      {/* MAP + DETAILS */}
      <section className="container-shell">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7 overflow-hidden rounded-card border border-line bg-mist">
            {mapEmbedUrl ? (
              <iframe
                title="Workshop location"
                src={mapEmbedUrl}
                className="min-h-[420px] w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="flex min-h-[420px] items-center justify-center bg-linen text-slate">
                {t("location.mapUnavailable")}
              </div>
            )}
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="card">
              <p className="text-xs font-semibold uppercase tracking-editorial text-slate">
                {t("location.address")}
              </p>
              <p className="mt-3 font-display text-lg font-semibold leading-snug">{address}</p>
              {content?.jsonData?.notes ? (
                <p className="mt-3 text-sm leading-relaxed text-slate">{content.jsonData.notes}</p>
              ) : null}
            </div>

            <div className="card">
              <p className="text-xs font-semibold uppercase tracking-editorial text-slate">
                {t("location.hours")}
              </p>
              <div className="mt-3 divide-y divide-line">
                {hours.map((row) => (
                  <div key={row.day} className="flex items-center justify-between py-2.5 text-sm">
                    <span className="text-slate">{translateDay(row.day, language)}</span>
                    <span className="font-medium">{translateHours(row.hours, language)}</span>
                  </div>
                ))}
              </div>
            </div>

            {phone ? (
              <a href={`tel:${phone}`} className="card-hover block">
                <p className="text-xs font-semibold uppercase tracking-editorial text-slate">
                  {t("location.phoneShortcut")}
                </p>
                <p className="mt-3 font-display text-xl font-semibold text-champagne">{phone}</p>
              </a>
            ) : null}
          </div>
        </div>
      </section>

      {/* CLOSING */}
      <section className="container-shell">
        <div className="flex flex-wrap items-center gap-4">
          <Link to="/contact" className="btn-primary">
            {t("nav.bookCTA")}
          </Link>
          <Link to="/services" className="btn-secondary">
            {t("nav.services")}
          </Link>
        </div>
      </section>
    </div>
  );
}
