import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteAdminInquiry, getAdminDashboard } from "../lib/api";
import { buildAdminPath } from "../lib/admin";
import { formatDate } from "../lib/format";
import type { DashboardData, Inquiry } from "../types";
import { useLanguage } from "../lib/i18n";

export function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { language, t } = useLanguage();

  const ui =
    language === "sv"
      ? {
          delete: "Ta bort",
          deleting: "Tar bort...",
          confirmDelete: "Ta bort denna förfrågan?",
          deleteError: "Kunde inte ta bort förfrågan.",
          phoneLabel: "Telefon"
        }
      : {
          delete: "Delete",
          deleting: "Deleting...",
          confirmDelete: "Delete this inquiry?",
          deleteError: "Could not delete the inquiry.",
          phoneLabel: "Phone"
        };

  function load() {
    getAdminDashboard()
      .then(setData)
      .catch((err: Error) => setError(err.message));
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(inquiry: Inquiry) {
    if (!window.confirm(ui.confirmDelete)) return;
    setDeletingId(inquiry.id);
    setError("");
    try {
      await deleteAdminInquiry(inquiry.id);
      setData((current) => {
        if (!current) return current;
        return {
          ...current,
          stats: { ...current.stats, totalInquiries: Math.max(0, current.stats.totalInquiries - 1) },
          recentInquiries: current.recentInquiries.filter((item) => item.id !== inquiry.id)
        };
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : ui.deleteError);
    } finally {
      setDeletingId(null);
    }
  }

  if (error && !data) {
    return <div className="panel p-6 text-bronze">{error}</div>;
  }

  if (!data) {
    return <div className="panel p-6 text-slate">{t("loading")}</div>;
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
            <p className="text-xs font-semibold uppercase tracking-editorial text-slate">{card.label}</p>
            <p className="mt-3 font-display text-4xl font-semibold">{card.value}</p>
          </div>
        ))}
      </div>

      {error ? <div className="panel p-4 text-sm text-bronze">{error}</div> : null}

      <div className="panel p-6 sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-display text-2xl">{t("admin.dashboard.recentInquiries")}</h2>
          <Link to={buildAdminPath("/content")} className="btn-secondary">
            {t("admin.dashboard.manageContent")}
          </Link>
        </div>
        <div className="mt-6 grid gap-4">
          {data.recentInquiries.length ? (
            data.recentInquiries.map((inquiry) => (
              <article key={inquiry.id} className="rounded-card border border-line bg-mist p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-lg font-semibold text-onyx">{inquiry.name}</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-editorial text-slate">
                      {inquiry.kind === "CAR" ? t("admin.dashboard.kindCar") : t("admin.dashboard.kindContact")}
                      {" · "}
                      {formatDate(inquiry.createdAt)}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="rounded-edge border border-line px-3 py-1.5 text-xs font-medium text-slate transition hover:border-bronze hover:text-bronze disabled:opacity-50"
                    onClick={() => handleDelete(inquiry)}
                    disabled={deletingId === inquiry.id}
                  >
                    {deletingId === inquiry.id ? ui.deleting : ui.delete}
                  </button>
                </div>

                <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                  <a href={`mailto:${inquiry.email}`} className="text-slate transition hover:text-onyx">
                    {inquiry.email}
                  </a>
                  {inquiry.phone ? (
                    <a href={`tel:${inquiry.phone}`} className="text-slate transition hover:text-onyx">
                      {ui.phoneLabel}: <span className="font-medium text-onyx">{inquiry.phone}</span>
                    </a>
                  ) : null}
                </div>

                <p className="mt-4 text-sm leading-relaxed text-slate">{inquiry.message}</p>
              </article>
            ))
          ) : (
            <div className="rounded-card bg-linen p-5 text-sm text-slate">
              {t("admin.dashboard.noInquiries")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
