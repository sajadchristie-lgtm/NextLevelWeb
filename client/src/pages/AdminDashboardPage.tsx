import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAdminDashboard } from "../lib/api";
import { buildAdminPath } from "../lib/admin";
import { resolveAssetUrl } from "../lib/assets";
import { formatCurrency, formatDate } from "../lib/format";
import type { DashboardData } from "../types";
import { translateCarStatus, useLanguage } from "../lib/i18n";

export function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");
  const { language, t } = useLanguage();
  const ui =
    language === "sv"
      ? {
          loading: "Laddar adminpanelen...",
          totalCars: "Totalt antal bilar",
          available: "Tillgangliga",
          sold: "Salda",
          featured: "Utvalda",
          activeServices: "Aktiva tjanster",
          inquiries: "Forfragningar",
          recentCars: "Senaste bilar",
          manageCars: "Hantera bilar",
          recentInquiries: "Senaste forfragningar",
          carLabel: "Bil",
          noInquiries: "Inga forfragningar annu.",
          kindCar: "bil",
          kindContact: "kontakt"
        }
      : {
          loading: "Loading dashboard...",
          totalCars: "Total Cars",
          available: "Available",
          sold: "Sold",
          featured: "Featured",
          activeServices: "Active Services",
          inquiries: "Inquiries",
          recentCars: "Recent cars",
          manageCars: "Manage cars",
          recentInquiries: "Recent inquiries",
          carLabel: "Car",
          noInquiries: "No inquiries yet.",
          kindCar: "car",
          kindContact: "contact"
        };

  useEffect(() => {
    getAdminDashboard()
      .then(setData)
      .catch((err: Error) => setError(err.message));
  }, []);

  if (error) {
    return <div className="panel p-6 text-ember">{error}</div>;
  }

  if (!data) {
    return <div className="panel p-6 text-slate-500">{ui.loading}</div>;
  }

  const statCards = [
    { label: ui.totalCars, value: data.stats.totalCars },
    { label: ui.available, value: data.stats.availableCars },
    { label: ui.sold, value: data.stats.soldCars },
    { label: ui.featured, value: data.stats.featuredCars },
    { label: ui.activeServices, value: data.stats.totalServices },
    { label: ui.inquiries, value: data.stats.totalInquiries }
  ];

  return (
    <div className="space-y-6">
      <div className="panel p-6 sm:p-8">
        <span className="eyebrow">{t("admin.dashboard.eyebrow")}</span>
        <h1 className="section-title mt-4">{t("admin.dashboard.title")}</h1>
        <p className="muted-copy mt-4">{t("admin.dashboard.copy")}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {statCards.map((card) => (
          <div key={card.label} className="panel p-5">
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className="mt-3 font-display text-4xl">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
        <div className="panel p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl">{ui.recentCars}</h2>
            <Link to={buildAdminPath("/cars")} className="secondary-button">
              {ui.manageCars}
            </Link>
          </div>
          <div className="mt-6 grid gap-4">
            {data.recentCars.map((car) => (
              <div key={car.id} className="flex flex-col gap-4 rounded-[24px] border border-line bg-shell p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={resolveAssetUrl(car.coverImage?.imageUrl) || "https://placehold.co/160x120?text=Car"}
                    alt={car.title}
                    className="h-20 w-28 rounded-[18px] object-cover"
                  />
                  <div>
                    <p className="font-semibold text-ink">{car.title}</p>
                    <p className="text-sm text-slate-500">{translateCarStatus(car.status, language)}</p>
                  </div>
                </div>
                <p className="font-semibold text-ember">{formatCurrency(car.pricing.finalPrice)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="panel p-6">
          <h2 className="font-display text-2xl">{ui.recentInquiries}</h2>
          <div className="mt-6 grid gap-4">
            {data.recentInquiries.length ? (
              data.recentInquiries.map((inquiry) => (
                <div key={inquiry.id} className="rounded-[24px] border border-line bg-white p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold">{inquiry.name}</p>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                      {inquiry.kind === "CAR" ? ui.kindCar : ui.kindContact}
                    </p>
                  </div>
                  {inquiry.car?.title ? (
                    <p className="mt-2 text-sm font-medium text-ink">{ui.carLabel}: {inquiry.car.title}</p>
                  ) : null}
                  <p className="mt-2 text-sm text-slate-500">{inquiry.email}</p>
                  <p className="mt-3 text-sm leading-7 text-slate-700">{inquiry.message}</p>
                  <p className="mt-3 text-xs text-slate-400">{formatDate(inquiry.createdAt)}</p>
                </div>
              ))
            ) : (
              <div className="rounded-[24px] bg-sand p-5 text-sm text-slate-500">{ui.noInquiries}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
