import { useEffect, useState } from "react";
import { getContent } from "../lib/api";
import type { SiteContent } from "../types";
import { localizeContent, translateDay, translateHours, useLanguage } from "../lib/i18n";

type LocationJson = {
  address?: string;
  mapEmbedUrl?: string;
  hours?: Array<{ day: string; hours: string }>;
  notes?: string;
  phone?: string;
};

export function LocationPage() {
  const [content, setContent] = useState<SiteContent<LocationJson> | null>(null);
  const [error, setError] = useState("");
  const { language, t } = useLanguage();

  useEffect(() => {
    getContent<LocationJson>("location_page")
      .then((payload) => setContent(payload.content))
      .catch((err: Error) => setError(err.message));
  }, []);

  const localized = localizeContent("location_page", content, language) as SiteContent<LocationJson> | null;

  return (
    <div className="container-shell space-y-8 py-10">
      <div className="panel p-6 sm:p-8">
        <span className="eyebrow">{t("location.eyebrow")}</span>
        <h1 className="section-title mt-4">{localized?.title}</h1>
        <p className="muted-copy mt-4 max-w-3xl">{localized?.content}</p>
      </div>

      {error ? <div className="text-center text-ember">{error}</div> : null}

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="panel overflow-hidden">
          {localized?.jsonData?.mapEmbedUrl ? (
            <iframe
              title="Business location map"
              src={localized.jsonData.mapEmbedUrl}
              className="min-h-[360px] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <div className="flex min-h-[360px] items-center justify-center bg-sand text-slate-500">{t("location.mapUnavailable")}</div>
          )}
        </div>

        <div className="space-y-6">
          <div className="panel p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{t("location.address")}</p>
            <p className="mt-3 font-display text-2xl">{localized?.jsonData?.address}</p>
            <p className="mt-4 text-sm leading-7 text-slate-600">{localized?.jsonData?.notes}</p>
          </div>

          <div className="panel p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{t("location.hours")}</p>
            <div className="mt-4 grid gap-3">
              {(localized?.jsonData?.hours || []).map((row: { day: string; hours: string }) => (
                <div key={row.day} className="flex items-center justify-between rounded-[18px] bg-sand px-4 py-3 text-sm text-slate-700">
                  <span>{translateDay(row.day, language)}</span>
                  <span className="font-semibold">{translateHours(row.hours, language)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="panel p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{t("location.phoneShortcut")}</p>
            <a href={`tel:${localized?.jsonData?.phone || ""}`} className="mt-3 block font-display text-2xl text-ember">
              {localized?.jsonData?.phone}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
