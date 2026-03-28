import { useEffect, useState } from "react";
import { getServices } from "../lib/api";
import type { Service } from "../types";
import { localizeService, useLanguage } from "../lib/i18n";

export function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [error, setError] = useState("");
  const { language, t } = useLanguage();

  useEffect(() => {
    getServices()
      .then((payload) => setServices(payload.services))
      .catch((err: Error) => setError(err.message));
  }, []);

  return (
    <div className="container-shell space-y-8 py-10">
      <div className="panel p-6 sm:p-8">
        <span className="eyebrow">{t("services.eyebrow")}</span>
        <h1 className="section-title mt-4">{t("services.title")}</h1>
        <p className="muted-copy mt-4 max-w-3xl">
          {t("services.copy")}
        </p>
      </div>

      {error ? <div className="text-center text-ember">{error}</div> : null}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {services.map((service) => {
          const localized = localizeService(service, language);

          return (
          <article key={service.id} className="panel p-6">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-bronze/10 text-sm font-bold text-ember">
              {String(service.order).padStart(2, "0")}
            </div>
            <h2 className="mt-5 font-display text-2xl">{localized.title}</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">{localized.description}</p>
          </article>
          );
        })}
      </div>
    </div>
  );
}
