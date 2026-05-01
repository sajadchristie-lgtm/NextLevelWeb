import { useEffect, useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { getContent } from "../lib/api";
import type { SiteContent } from "../types";
import { useLanguage } from "../lib/i18n";
import { BrandLogo } from "./BrandLogo";

type FooterContactJson = {
  phone?: string;
  email?: string;
  address?: string;
};

export function PublicLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const [contact, setContact] = useState<SiteContent<FooterContactJson> | null>(null);

  useEffect(() => {
    getContent<FooterContactJson>("contact_page")
      .then((payload) => setContact(payload.content))
      .catch(() => setContact(null));
  }, []);

  const phone = contact?.jsonData?.phone;
  const email = contact?.jsonData?.email;
  const address = contact?.jsonData?.address;

  const navItems = [
    { label: t("nav.home"), to: "/" },
    { label: t("nav.services"), to: "/services" },
    { label: t("nav.about"), to: "/about" },
    { label: t("nav.location"), to: "/location" },
    { label: t("nav.contact"), to: "/contact" }
  ];

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-line bg-paper/85 backdrop-blur">
        <div className="container-shell flex items-center justify-between py-4">
          <Link
            to="/"
            className="flex items-center gap-2.5"
            onClick={() => setMenuOpen(false)}
          >
            <BrandLogo size={36} className="rounded-edge" />
            <span className="font-display text-base font-semibold tracking-tight">
              Bilvård center
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-medium transition ${
                    isActive ? "text-ink" : "text-slate hover:text-ink"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <div className="ml-3 flex items-center gap-1">
              <button
                type="button"
                className={`px-2.5 py-1 text-xs font-medium uppercase transition ${
                  language === "sv" ? "text-ink" : "text-muted hover:text-ink"
                }`}
                onClick={() => setLanguage("sv")}
              >
                {t("lang.sv")}
              </button>
              <span className="text-muted">/</span>
              <button
                type="button"
                className={`px-2.5 py-1 text-xs font-medium uppercase transition ${
                  language === "en" ? "text-ink" : "text-muted hover:text-ink"
                }`}
                onClick={() => setLanguage("en")}
              >
                {t("lang.en")}
              </button>
            </div>
            <Link to="/contact" className="btn-primary ml-3">
              {t("nav.bookCTA")}
            </Link>
          </nav>

          <button
            type="button"
            className="rounded-edge border border-line p-2 lg:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle navigation"
          >
            <div className="flex w-5 flex-col gap-1">
              <span className="h-px bg-ink" />
              <span className="h-px bg-ink" />
              <span className="h-px bg-ink" />
            </div>
          </button>
        </div>

        {menuOpen ? (
          <div className="container-shell grid gap-1 border-t border-line py-4 lg:hidden">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `rounded-edge px-3 py-3 text-sm font-medium transition ${
                    isActive ? "bg-ink text-paper" : "text-slate"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <div className="mt-2 flex items-center gap-1 px-3">
              <button
                type="button"
                className={`px-2.5 py-1 text-xs font-medium uppercase ${
                  language === "sv" ? "text-ink" : "text-muted"
                }`}
                onClick={() => setLanguage("sv")}
              >
                {t("lang.sv")}
              </button>
              <span className="text-muted">/</span>
              <button
                type="button"
                className={`px-2.5 py-1 text-xs font-medium uppercase ${
                  language === "en" ? "text-ink" : "text-muted"
                }`}
                onClick={() => setLanguage("en")}
              >
                {t("lang.en")}
              </button>
            </div>
            <Link
              to="/contact"
              onClick={() => setMenuOpen(false)}
              className="btn-primary mt-3 justify-center"
            >
              {t("nav.bookCTA")}
            </Link>
          </div>
        ) : null}
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="border-t border-line bg-paper py-12">
        <div className="container-shell">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <BrandLogo size={36} className="rounded-edge" />
                <span className="font-display text-base font-semibold">
                  Bilvård center
                </span>
              </div>
              <p className="max-w-xs text-sm leading-relaxed text-slate">
                {t("footer.tagline")}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-editorial text-slate">
                {t("footer.explore")}
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate">
                {navItems.map((item) => (
                  <li key={item.to}>
                    <Link to={item.to} className="transition hover:text-ink">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-editorial text-slate">
                {t("footer.reach")}
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate">
                {phone ? (
                  <li>
                    <a href={`tel:${phone}`} className="text-ink transition hover:text-accent">
                      {phone}
                    </a>
                  </li>
                ) : null}
                {email ? (
                  <li>
                    <a href={`mailto:${email}`} className="transition hover:text-ink">
                      {email}
                    </a>
                  </li>
                ) : null}
                {address ? <li>{address}</li> : null}
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-editorial text-slate">
                {t("footer.visit")}
              </p>
              <Link to="/contact" className="btn-primary mt-4">
                {t("nav.bookCTA")}
              </Link>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-2 border-t border-line pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} Bilvård center i Kävlinge. {t("footer.rights")}
            </p>
            <p>Since 1997</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
