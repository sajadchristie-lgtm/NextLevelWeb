import { Link } from "react-router-dom";
import { useLanguage } from "../lib/i18n";
import {
  SERVICE_PACKAGES,
  STANDALONE_SERVICES,
  SIZE_LABELS,
  formatPrice,
  type ServicePackage,
  type SizeKey
} from "../lib/services-data";
import { getAddonPrice, getPackagePrice, getStandalonePrice, slugifyAddon, usePricing } from "../lib/pricing";

const SIZE_KEYS: SizeKey[] = ["small", "medium", "large"];

export function ServicesPage() {
  const { language, t } = useLanguage();
  const pricing = usePricing();

  return (
    <div className="space-y-20 pb-24 pt-16 sm:space-y-24 sm:pt-24">
      {/* HERO */}
      <section className="container-shell">
        <div className="max-w-3xl space-y-6">
          <p className="text-sm font-medium text-slate">{t("services.eyebrow")}</p>
          <h1 className="h-display">{t("services.title")}</h1>
          <p className="lead">{t("services.copy")}</p>
        </div>
      </section>

      {/* PACKAGES */}
      <section className="container-shell space-y-4">
        {SERVICE_PACKAGES.map((pkg) => (
          <PackageRow key={pkg.slug} pkg={pkg} pricing={pricing} />
        ))}
      </section>

      {/* STANDALONE */}
      <section className="container-shell">
        <div className="max-w-xl space-y-3">
          <h2 className="h-section">{t("services.standaloneTitle")}</h2>
          <p className="body-copy">{t("services.standaloneCopy")}</p>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {STANDALONE_SERVICES.map((svc) => (
            <div key={svc.slug} className="card">
              <p className="font-display text-2xl font-semibold">
                {formatPrice(getStandalonePrice(pricing, svc.slug), language)}
              </p>
              <p className="mt-3 text-sm font-medium text-ink">{svc.title[language]}</p>
              <p className="mt-2 text-sm leading-relaxed text-slate">{svc.description[language]}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CLOSING */}
      <section className="container-shell">
        <div className="rounded-card border border-line bg-soft p-10 sm:p-12">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7 space-y-3">
              <h2 className="h-section">{t("services.closing.title")}</h2>
              <p className="body-copy">{t("services.closing.copy")}</p>
            </div>
            <div className="lg:col-span-5 flex flex-wrap gap-3 lg:justify-end">
              <Link to="/contact" className="btn-primary">
                {t("services.closing.cta")}
              </Link>
              <Link to="/about" className="btn-secondary">
                {t("nav.about")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function PackageRow({ pkg, pricing }: { pkg: ServicePackage; pricing: ReturnType<typeof usePricing> }) {
  const { language, t } = useLanguage();

  return (
    <details className="group rounded-card border border-line bg-paper transition open:border-ink/20 open:shadow-card">
      <summary className="flex cursor-pointer list-none flex-col gap-4 p-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-3">
            <h2 className="h-card">{pkg.title[language]}</h2>
            {pkg.featured ? (
              <span className="rounded-edge bg-ink px-2 py-0.5 text-[10px] font-medium uppercase tracking-editorial text-paper">
                {t("services.featured")}
              </span>
            ) : null}
          </div>
          <p className="text-sm leading-relaxed text-slate">{pkg.tagline[language]}</p>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden gap-6 sm:flex">
            {SIZE_KEYS.map((size) => (
              <div key={size} className="flex flex-col items-end">
                <span className="text-[10px] font-medium uppercase tracking-editorial text-muted">
                  {SIZE_LABELS[size][language]}
                </span>
                <span className="font-display text-base font-semibold text-ink">
                  {formatPrice(getPackagePrice(pricing, pkg.slug, size), language)}
                </span>
              </div>
            ))}
          </div>
          <span
            aria-hidden
            className="inline-flex h-8 w-8 flex-none items-center justify-center rounded-full border border-line text-slate transition group-open:rotate-45 group-open:border-ink group-open:bg-ink group-open:text-paper"
          >
            <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M8 3v10M3 8h10" />
            </svg>
          </span>
        </div>
      </summary>

      {/* Mobile price row */}
      <div className="grid grid-cols-3 gap-2 px-6 pb-2 sm:hidden">
        {SIZE_KEYS.map((size) => (
          <div key={size} className="rounded-edge border border-line bg-soft px-3 py-2">
            <p className="text-[10px] font-medium uppercase tracking-editorial text-muted">
              {SIZE_LABELS[size][language]}
            </p>
            <p className="mt-1 font-display text-sm font-semibold">
              {formatPrice(getPackagePrice(pricing, pkg.slug, size), language)}
            </p>
          </div>
        ))}
      </div>

      <div className="border-t border-line px-6 py-6 sm:px-8 sm:py-8">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="text-xs font-semibold uppercase tracking-editorial text-slate">
              {t("services.includes")}
            </p>
            <ul className="mt-4 space-y-2.5">
              {pkg.inclusions[language].map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-slate">
                  <span className="mt-2.5 inline-block h-px w-4 flex-none bg-accent" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            {pkg.notes ? (
              <p className="mt-6 text-xs leading-relaxed text-muted">{pkg.notes[language]}</p>
            ) : null}
          </div>

          <div className="lg:col-span-5 space-y-4">
            <p className="text-sm leading-relaxed text-slate">{pkg.description[language]}</p>

            {pkg.addons && pkg.addons.length > 0 ? (
              <div className="space-y-2 rounded-edge bg-soft p-4">
                {pkg.addons.map((addon) => {
                  const addonSlug = slugifyAddon(addon.label.en);
                  const price = getAddonPrice(pricing, pkg.slug, addonSlug) ?? addon.price;
                  return (
                    <div key={addonSlug} className="flex items-baseline justify-between gap-4 text-sm">
                      <span className="text-slate">{addon.label[language]}</span>
                      <span className="font-medium">{formatPrice(price, language)}</span>
                    </div>
                  );
                })}
              </div>
            ) : null}

            <Link to="/contact" className="btn-primary w-full justify-center">
              {t("services.book")}
            </Link>
          </div>
        </div>
      </div>
    </details>
  );
}
