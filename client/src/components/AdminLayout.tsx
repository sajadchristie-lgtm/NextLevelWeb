import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { clearAdminAccess } from "../lib/api";
import { buildAdminPath } from "../lib/admin";
import { clearAuthToken } from "../lib/auth";
import { useLanguage } from "../lib/i18n";

export function AdminLayout() {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const languageLabel = language === "sv" ? "Sprak" : "Language";
  const navItems = [
    { label: t("admin.nav.overview"), to: buildAdminPath("/") },
    { label: t("admin.nav.cars"), to: buildAdminPath("/cars") },
    { label: t("admin.nav.content"), to: buildAdminPath("/content") }
  ];

  return (
    <div className="min-h-screen bg-[#f3efe6]">
      <div className="container-shell py-6">
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="panel h-fit p-4">
            <div className="mb-6 rounded-[24px] bg-ink p-5 text-white">
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">{t("admin.layout.title")}</p>
              <div className="mt-3 flex items-center gap-3">
                <img src="/logo.png" alt={"Bilv\u00e5rd center i K\u00e4vlinge logo"} className="h-11 w-11 rounded-2xl object-cover" />
                <h1 className="font-display text-xl sm:text-2xl">{"Bilv\u00e5rd center i K\u00e4vlinge"}</h1>
              </div>
              <p className="mt-2 text-sm text-white/70">{t("admin.layout.copy")}</p>
            </div>

            <nav className="grid gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === buildAdminPath("/")}
                  className={({ isActive }) =>
                    `admin-nav-link ${isActive ? "admin-nav-link-active" : ""}`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="mt-6 rounded-[24px] border border-[#d8b36a] bg-[linear-gradient(135deg,#fff3cf_0%,#ffe3b2_52%,#fff8ec_100%)] p-3 shadow-[0_16px_36px_rgba(111,78,17,0.14)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/70">{languageLabel}</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  className={`rounded-[16px] border px-3 py-2 text-sm font-semibold transition ${
                    language === "en"
                      ? "border-ink bg-ink text-white shadow-[0_10px_24px_rgba(24,28,34,0.28)]"
                      : "border-white/80 bg-white/90 text-ink hover:bg-white"
                  }`}
                  onClick={() => setLanguage("en")}
                >
                  {t("lang.en")}
                </button>
                <button
                  type="button"
                  className={`rounded-[16px] border px-3 py-2 text-sm font-semibold transition ${
                    language === "sv"
                      ? "border-ink bg-ink text-white shadow-[0_10px_24px_rgba(24,28,34,0.28)]"
                      : "border-white/80 bg-white/90 text-ink hover:bg-white"
                  }`}
                  onClick={() => setLanguage("sv")}
                >
                  {t("lang.sv")}
                </button>
              </div>
            </div>

            <button
              type="button"
              className="secondary-button mt-6 w-full"
              onClick={async () => {
                clearAuthToken();
                await clearAdminAccess().catch(() => undefined);
                navigate(buildAdminPath("/access"));
              }}
            >
              {t("admin.layout.logout")}
            </button>
          </aside>

          <section className="space-y-6">
            <Outlet />
          </section>
        </div>
      </div>
    </div>
  );
}
