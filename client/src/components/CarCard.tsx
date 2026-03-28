import { Link } from "react-router-dom";
import { resolveAssetUrl } from "../lib/assets";
import type { Car } from "../types";
import { formatCurrency, getCarSubtitle, getDiscountBadge } from "../lib/format";
import { translateCarStatus, useLanguage } from "../lib/i18n";

type CarCardProps = {
  car: Car;
};

export function CarCard({ car }: CarCardProps) {
  const badge = getDiscountBadge(car.discount);
  const { language, t } = useLanguage();

  return (
    <article className="panel overflow-hidden">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={resolveAssetUrl(car.coverImage?.imageUrl) || "https://placehold.co/900x675?text=Car"}
          alt={car.coverImage?.altText || car.title}
          className="h-full w-full object-cover transition duration-500 hover:scale-[1.04]"
        />
        <div className="absolute left-4 top-4 flex gap-2">
          {badge ? <span className="rounded-full bg-ember px-3 py-1 text-xs font-semibold text-white">{badge}</span> : null}
          {car.featured ? (
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink">{t("car.featured")}</span>
          ) : null}
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{car.brand}</p>
          <h3 className="font-display text-2xl text-ink">{car.title}</h3>
          <p className="text-sm text-slate-500">{getCarSubtitle(car)}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm text-slate-600">
          <div className="rounded-2xl bg-sand px-3 py-2">{car.mileage.toLocaleString()} mi</div>
          <div className="rounded-2xl bg-sand px-3 py-2">{translateCarStatus(car.status, language)}</div>
        </div>

        <div className="flex items-end justify-between gap-4">
          <div>
            {car.pricing.discountActive ? (
              <div className="space-y-1">
                <p className="text-sm text-slate-400 line-through">{formatCurrency(car.price)}</p>
                <p className="text-2xl font-semibold text-ember">{formatCurrency(car.pricing.finalPrice)}</p>
              </div>
            ) : (
              <p className="text-2xl font-semibold text-ink">{formatCurrency(car.price)}</p>
            )}
          </div>

          <Link to={`/cars/${car.slug}`} className="secondary-button">
            {t("car.viewDetails")}
          </Link>
        </div>
      </div>
    </article>
  );
}
