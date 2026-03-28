import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getHomeData } from "../lib/api";
import type { HomeData } from "../types";
import { CarCard } from "../components/CarCard";
import { localizeContent, localizeService, useLanguage } from "../lib/i18n";

export function HomePage() {
  const [data, setData] = useState<HomeData | null>(null);
  const [error, setError] = useState("");
  const { language, t } = useLanguage();

  useEffect(() => {
    getHomeData()
      .then(setData)
      .catch((err: Error) => setError(err.message));
  }, []);

  if (error) {
    return <div className="container-shell py-20 text-center text-ember">{error}</div>;
  }

  if (!data) {
    return <div className="container-shell py-20 text-center text-slate-500">{t("home.loading")}</div>;
  }

  const homepageContent = localizeContent("homepage_sections", data.homepageContent, language) as HomeData["homepageContent"];
  const aboutContent = localizeContent("about_page", data.aboutContent, language) as HomeData["aboutContent"];
  const locationContent = localizeContent("location_page", data.locationContent, language) as HomeData["locationContent"];
  const contactContent = localizeContent("contact_page", data.contactContent, language) as HomeData["contactContent"];
  const services = data.services.map((service) => localizeService(service, language));

  return (
    <div className="space-y-16 pb-16 pt-8 sm:space-y-20">
      <section className="container-shell">
        <div className="panel overflow-hidden bg-hero-glow p-6 sm:p-8 lg:p-12">
          <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-6">
              <span className="eyebrow">{t("home.eyebrow")}</span>
              <div className="space-y-4">
                <h1 className="font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl lg:text-6xl">
                  {homepageContent?.title || t("home.fallbackTitle")}
                </h1>
                <p className="max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                  {homepageContent?.content}
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link to="/cars" className="primary-button">
                  {t("home.exploreCars")}
                </Link>
                <Link to="/services" className="secondary-button">
                  {t("home.viewServices")}
                </Link>
              </div>
              <div className="grid gap-4 pt-4 sm:grid-cols-3">
                {(homepageContent?.jsonData?.stats || []).map((stat: { label: string; value: string }) => (
                  <div key={stat.label} className="rounded-[24px] border border-white/60 bg-white/75 p-4">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-600">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-[32px] bg-ink p-6 text-white">
                <p className="text-sm uppercase tracking-[0.2em] text-white/60">{t("home.whyChooseUs")}</p>
                <div className="mt-5 space-y-4">
                  {(homepageContent?.jsonData?.whyChooseUs || []).map((item: string) => (
                    <div key={item} className="rounded-[24px] border border-white/10 bg-white/5 p-4 text-sm leading-7 text-white/80">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-[32px] bg-white p-6">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">{t("home.locationPreview")}</p>
                <h2 className="mt-3 font-display text-2xl">{locationContent?.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{locationContent?.content}</p>
                <p className="mt-4 text-sm font-semibold text-ember">
                  {locationContent?.jsonData?.address || t("home.visitUsFallback")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="panel p-6 sm:p-8">
            <span className="eyebrow">{t("home.aboutEyebrow")}</span>
            <h2 className="section-title mt-4">{aboutContent?.title}</h2>
            <p className="muted-copy mt-4">{aboutContent?.content}</p>
            <div className="mt-6 grid gap-4">
              <div className="rounded-[24px] bg-sand p-5">
                <p className="font-semibold text-ink">
                  {aboutContent?.jsonData?.missionTitle || "Our mission"}
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  {aboutContent?.jsonData?.missionBody}
                </p>
              </div>
              <Link to="/about" className="secondary-button w-fit">
                {t("home.learnMore")}
              </Link>
            </div>
          </div>

          <div className="panel p-6 sm:p-8">
            <span className="eyebrow">{t("home.servicesEyebrow")}</span>
            <h2 className="section-title mt-4">{t("home.servicesTitle")}</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {services.map((service) => (
                <article key={service.id} className="rounded-[24px] border border-line bg-shell p-5">
                  <h3 className="font-display text-xl">{service.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{service.description}</p>
                </article>
              ))}
            </div>
            <Link to="/services" className="secondary-button mt-6 w-fit">
              {t("home.viewAllServices")}
            </Link>
          </div>
        </div>
      </section>

      <section className="container-shell space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="eyebrow">{t("home.featuredEyebrow")}</span>
            <h2 className="section-title mt-4">{t("home.featuredTitle")}</h2>
          </div>
          <Link to="/cars" className="secondary-button">
            {t("home.seeAllVehicles")}
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {data.featuredCars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </section>

      <section className="container-shell">
        <div className="panel bg-ink p-6 text-white sm:p-8 lg:p-10">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <span className="eyebrow border-white/10 bg-white/10 text-white">{t("home.contactEyebrow")}</span>
              <h2 className="mt-4 font-display text-3xl sm:text-4xl">{t("home.contactTitle")}</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
                {t("home.contactCopy")}
              </p>
            </div>

            <div className="grid gap-3 rounded-[28px] bg-white/5 p-5">
              <div className="rounded-[20px] border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/50">{t("contact.call")}</p>
                <p className="mt-2 text-lg font-semibold">{contactContent?.jsonData?.phone}</p>
              </div>
              {contactContent?.jsonData?.email ? (
                <div className="rounded-[20px] border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/50">{t("contact.email")}</p>
                  <p className="mt-2 text-lg font-semibold">{contactContent?.jsonData?.email}</p>
                </div>
              ) : null}
              <Link to="/contact" className="primary-button mt-2">
                {t("home.contactTeam")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
