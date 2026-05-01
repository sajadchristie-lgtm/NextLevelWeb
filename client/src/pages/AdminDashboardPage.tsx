import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAdminDashboard } from "../lib/api";
import { buildAdminPath } from "../lib/admin";
import { formatDate } from "../lib/format";
import type { DashboardData } from "../types";
import { useLanguage } from "../lib/i18n";

export function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");
  const { t } = useLanguage();

  useEffect(() => {
    getAdminDashboard()
      .then(setData)
      .catch((err: Error) => setError(err.message));
  }, []);

  if (error) {
    return <div className="panel p-6 text-ember">{error}</div>;
  }

  if (!data) {
    return <div className="panel p-6 text-slate-500">{t("home.loading")}</div>;
  }

  const statCards = [
    { label: t("admin.dashboard.activeServices"), value: data.stats.totalServices },
    { label: t("admin.dashboard.totalInquiries"), value: data.stats.totalInquiries }
  ];

  return (
    <div className="space-y-6">
      <div className="panel p-6 sm:p-8">
        <span className="eyebrow">{t("admin.dashboard.eyebrow")}</span>
        <h1 className="section-title mt-4">{t("admin.dashboard.title")}</h1>
        <p className="muted-copy mt-4">{t("admin.dashboard.copy")}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {statCards.map((card) => (
          <div key={card.label} className="panel p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{card.label}</p>
            <p className="mt-3 font-display text-4xl font-semibold">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="panel p-6 sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-display text-2xl">{t("admin.dashboard.recentInquiries")}</h2>
          <Link to={buildAdminPath("/content")} className="secondary-button">
            {t("admin.dashboard.manageContent")}
          </Link>
        </div>
        <div className="mt-6 grid gap-4">
          {data.recentInquiries.length ? (
            data.recentInquiries.map((inquiry) => (
              <div key={inquiry.id} className="rounded-[24px] border border-line bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-ink">{inquiry.name}</p>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {inquiry.kind === "CAR" ? t("admin.dashboard.kindCar") : t("admin.dashboard.kindContact")}
                  </p>
                </div>
                <p className="mt-2 text-sm text-slate-500">{inquiry.email}</p>
                <p className="mt-3 text-sm leading-7 text-slate-700">{inquiry.message}</p>
                <p className="mt-3 text-xs text-slate-400">{formatDate(inquiry.createdAt)}</p>
              </div>
            ))
          ) : (
            <div className="rounded-[24px] bg-sand p-5 text-sm text-slate-500">
              {t("admin.dashboard.noInquiries")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
