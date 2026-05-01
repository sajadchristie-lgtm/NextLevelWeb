import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getContent } from "../lib/api";
import type { SiteContent } from "../types";
import { useLanguage } from "../lib/i18n";
import { SERVICE_PACKAGES, formatPrice } from "../lib/services-data";
import { getPackagePrice, usePricing } from "../lib/pricing";

type ContactJson = {
  phone?: string;
};

export function HomePage() {
  const { language, t } = useLanguage();
  const pricing = usePricing();
  const [contact, setContact] = useState<SiteContent<ContactJson> | null>(null);

  useEffect(() => {
    getContent<ContactJson>("contact_page")
      .then((payload) => setContact(payload.content))
      .catch(() => setContact(null));
  }, []);

  const phone = contact?.jsonData?.phone;

  const steps = [
    { title: t("home.process.s1.title"), copy: t("home.process.s1.copy") },
    { title: t("home.process.s2.title"), copy: t("home.process.s2.copy") },
    { title: t("home.process.s3.title"), copy: t("home.process.s3.copy") },
    { title: t("home.process.s4.title"), copy: t("home.process.s4.copy") }
  ];

  return (
    <div className="space-y-24 pb-24 pt-16 sm:space-y-32 sm:pt-24">
      {/* HERO */}
      <section className="container-shell">
        <div className="max-w-3xl space-y-6">
          <p className="text-sm font-medium text-slate">{t("home.eyebrow")}</p>
          <h1 className="h-display">{t("home.title")}</h1>
          <p className="lead">{t("home.copy")}</p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link to="/contact" className="btn-primary">
              {t("home.primaryCta")}
            </Link>
            <Link to="/services" className="btn-secondary">
              {t("home.secondaryCta")}
            </Link>
            {phone ? (
              <a href={`tel:${phone}`} className="ml-2 text-sm font-medium text-slate hover:text-ink">
                {phone}
              </a>
            ) : null}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="container-shell">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl space-y-3">
            <h2 className="h-section">{t("home.services.title")}</h2>
            <p className="body-copy">{t("home.services.copy")}</p>
          </div>
          <Link to="/services" className="btn-link">
            {t("home.services.viewAll")} <span aria-hidden>→</span>
          </Link>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {SERVICE_PACKAGES.map((pkg) => (
            <Link key={pkg.slug} to="/services" className="card-hover group flex flex-col">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="h-card group-hover:text-accent">{pkg.title[language]}</h3>
                <p className="meta">
                  {t("services.fromLabel")}{" "}
                  <span className="font-semibold text-ink">
                    {formatPrice(getPackagePrice(pricing, pkg.slug, "small"), language)}
                  </span>
                </p>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate">{pkg.tagline[language]}</p>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink">
                {t("services.book")} <span aria-hidden>→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* PROCESS */}
      <section className="container-shell">
        <div className="max-w-xl space-y-3">
          <h2 className="h-section">{t("home.process.title")}</h2>
          <p className="body-copy">{t("home.process.copy")}</p>
        </div>
        <ol className="mt-10 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <li key={step.title} className="space-y-2">
              <p className="text-sm font-medium text-accent">0{i + 1}</p>
              <h3 className="font-display text-base font-semibold">{step.title}</h3>
              <p className="text-sm leading-relaxed text-slate">{step.copy}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* CLOSING */}
      <section className="container-shell">
        <div className="rounded-card bg-ink p-10 text-paper sm:p-14">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7 space-y-4">
              <h2 className="h-section text-paper">{t("closing.title")}</h2>
              <p className="text-base leading-relaxed text-paper/70">{t("closing.copy")}</p>
            </div>
            <div className="lg:col-span-5 flex flex-wrap gap-3 lg:justify-end">
              <Link to="/contact" className="btn-light-on-dark">
                {t("closing.primary")}
              </Link>
              {phone ? (
                <a href={`tel:${phone}`} className="btn-outline-on-dark">
                  {phone}
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
