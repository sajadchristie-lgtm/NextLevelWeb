import { Link } from "react-router-dom";
import { useLanguage } from "../lib/i18n";

export function AboutPage() {
  const { t } = useLanguage();

  const values = [
    t("about.values.item1"),
    t("about.values.item2"),
    t("about.values.item3"),
    t("about.values.item4")
  ];

  return (
    <div className="space-y-20 pb-24 pt-16 sm:space-y-24 sm:pt-24">
      {/* HERO */}
      <section className="container-shell">
        <div className="max-w-3xl space-y-6">
          <p className="text-sm font-medium text-slate">{t("about.eyebrow")}</p>
          <h1 className="h-display">{t("about.title")}</h1>
          <p className="lead">{t("about.lead")}</p>
        </div>
      </section>

      {/* STORY */}
      <section className="container-shell">
        <div className="grid gap-10 lg:grid-cols-12">
          <h2 className="h-section lg:col-span-5">{t("about.story.title")}</h2>
          <p className="text-lg leading-relaxed text-slate lg:col-span-7">
            {t("about.story.body")}
          </p>
        </div>
      </section>

      {/* VALUES */}
      <section className="container-shell">
        <div className="grid gap-10 lg:grid-cols-12">
          <h2 className="h-section lg:col-span-5">{t("about.values.title")}</h2>
          <ul className="lg:col-span-7 grid gap-4 sm:grid-cols-2">
            {values.map((value, i) => (
              <li key={value} className="flex gap-4">
                <span className="text-sm font-medium text-accent">0{i + 1}</span>
                <span className="text-base leading-relaxed">{value}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CLOSING */}
      <section className="container-shell">
        <div className="rounded-card border border-line bg-soft p-10 sm:p-12">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7 space-y-3">
              <h2 className="h-section">{t("closing.title")}</h2>
              <p className="body-copy">{t("closing.copy")}</p>
            </div>
            <div className="lg:col-span-5 flex flex-wrap gap-3 lg:justify-end">
              <Link to="/contact" className="btn-primary">
                {t("closing.primary")}
              </Link>
              <Link to="/services" className="btn-secondary">
                {t("nav.services")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
