import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteAdminCar, getAdminCars } from "../lib/api";
import { buildAdminPath } from "../lib/admin";
import { resolveAssetUrl } from "../lib/assets";
import { formatCurrency, formatDate } from "../lib/format";
import { translateCarStatus, useLanguage } from "../lib/i18n";
import type { Car } from "../types";

export function AdminCarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const { language, t } = useLanguage();
  const ui =
    language === "sv"
      ? {
          deleteError: "Kunde inte ta bort bilen.",
          featured: "utvald",
          updated: "Uppdaterad"
        }
      : {
          deleteError: "Could not delete car.",
          featured: "featured",
          updated: "Updated"
        };

  function loadCars() {
    setLoading(true);
    getAdminCars()
      .then((payload) => {
        setCars(payload.cars);
        setError("");
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadCars();
  }, []);

  async function handleDelete(id: string) {
    const confirmed = window.confirm(t("admin.cars.confirmDelete"));
    if (!confirmed) {
      return;
    }

    try {
      await deleteAdminCar(id);
      loadCars();
    } catch (err) {
      setError(err instanceof Error ? err.message : ui.deleteError);
    }
  }

  return (
    <div className="space-y-6">
      <div className="panel flex flex-col gap-4 p-6 sm:flex-row sm:items-end sm:justify-between sm:p-8">
        <div>
          <span className="eyebrow">{t("admin.cars.eyebrow")}</span>
          <h1 className="section-title mt-4">{t("admin.cars.title")}</h1>
          <p className="muted-copy mt-4">{t("admin.cars.copy")}</p>
        </div>
        <Link to={buildAdminPath("/cars/new")} className="primary-button">
          {t("admin.cars.add")}
        </Link>
      </div>

      {error ? <div className="panel p-5 text-ember">{error}</div> : null}
      {loading ? <div className="panel p-5 text-slate-500">{t("admin.cars.loading")}</div> : null}

      <div className="grid gap-4">
        {cars.map((car) => (
          <article key={car.id} className="panel p-4 sm:p-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <img
                  src={resolveAssetUrl(car.coverImage?.imageUrl) || "https://placehold.co/180x120?text=Car"}
                  alt={car.title}
                  className="h-24 w-full rounded-[22px] object-cover sm:w-40"
                />
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-sand px-3 py-1 text-xs font-semibold text-slate-700">
                      {translateCarStatus(car.status, language)}
                    </span>
                    {car.featured ? (
                      <span className="rounded-full bg-bronze/10 px-3 py-1 text-xs font-semibold text-ember">{ui.featured}</span>
                    ) : null}
                  </div>
                  <h2 className="font-display text-2xl">{car.title}</h2>
                  <p className="text-sm text-slate-500">
                    {ui.updated} {formatDate(car.updatedAt)} | {formatCurrency(car.pricing.finalPrice)}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link to={`/cars/${car.slug}`} className="secondary-button">
                  {t("admin.cars.view")}
                </Link>
                <Link to={buildAdminPath(`/cars/${car.id}/edit`)} className="secondary-button">
                  {t("admin.cars.edit")}
                </Link>
                <button type="button" className="secondary-button text-ember" onClick={() => handleDelete(car.id)}>
                  {t("admin.cars.delete")}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
