import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useLanguage } from "../lib/i18n";

export function PublicLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const navItems = [
    { label: t("nav.home"), to: "/" },
    { label: t("nav.cars"), to: "/cars" },
    { label: t("nav.services"), to: "/services" },
    { label: t("nav.about"), to: "/about" },
    { label: t("nav.location"), to: "/location" },
    { label: t("nav.contact"), to: "/contact" }
  ];

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-white/50 bg-shell/90 backdrop-blur">
        <div className="container-shell flex items-center justify-between py-4">
          <Link to="/" className="flex items-center gap-3" onClick={() => setMenuOpen(false)}>
            <img src="/logo.png" alt={"Bilv\u00e5rd center i K\u00e4vlinge logo"} className="h-12 w-12 rounded-2xl object-cover" />
            <div>
              <p className="font-display text-base font-semibold sm:text-lg">{"Bilv\u00e5rd center i K\u00e4vlinge"}</p>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Sales & Car Care</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 lg:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-medium transition ${isActive ? "bg-ink text-white" : "text-slate-600 hover:text-ink"}`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <div className="flex items-center rounded-full border border-line bg-white p-1">
              <button
                type="button"
                className={`rounded-full px-3 py-2 text-xs font-semibold ${language === "en" ? "bg-ink text-white" : "text-slate-600"}`}
                onClick={() => setLanguage("en")}
              >
                {t("lang.en")}
              </button>
              <button
                type="button"
                className={`rounded-full px-3 py-2 text-xs font-semibold ${language === "sv" ? "bg-ink text-white" : "text-slate-600"}`}
                onClick={() => setLanguage("sv")}
              >
                {t("lang.sv")}
              </button>
            </div>
          </nav>

          <button
            type="button"
            className="rounded-2xl border border-line p-3 lg:hidden"
            onClick={() => setMenuOpen((value) => !value)}
            aria-label="Toggle navigation"
          >
            <div className="flex w-5 flex-col gap-1">
              <span className="h-0.5 bg-ink" />
              <span className="h-0.5 bg-ink" />
              <span className="h-0.5 bg-ink" />
            </div>
          </button>
        </div>

        {menuOpen ? (
          <div className="container-shell grid gap-2 border-t border-line py-4 lg:hidden">
            <div className="mb-2 flex items-center gap-2">
              <button
                type="button"
                className={`rounded-full px-3 py-2 text-xs font-semibold ${language === "en" ? "bg-ink text-white" : "border border-line bg-white text-slate-600"}`}
                onClick={() => setLanguage("en")}
              >
                {t("lang.en")}
              </button>
              <button
                type="button"
                className={`rounded-full px-3 py-2 text-xs font-semibold ${language === "sv" ? "bg-ink text-white" : "border border-line bg-white text-slate-600"}`}
                onClick={() => setLanguage("sv")}
              >
                {t("lang.sv")}
              </button>
            </div>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `rounded-2xl px-4 py-3 text-sm font-medium transition ${isActive ? "bg-ink text-white" : "bg-white text-slate-700"}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        ) : null}
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="border-t border-line bg-white/70 py-10">
        <div className="container-shell flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt={"Bilv\u00e5rd center i K\u00e4vlinge logo"} className="h-12 w-12 rounded-2xl object-cover" />
              <p className="font-display text-2xl">{"Bilv\u00e5rd center i K\u00e4vlinge"}</p>
            </div>
            <p className="max-w-xl text-sm text-slate-600">
              Premium vehicles, expert detailing, and a mobile-first showroom experience built for modern buyers.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-slate-500">
            {navItems.map((item) => (
              <Link key={item.to} to={item.to} className="hover:text-ink">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
