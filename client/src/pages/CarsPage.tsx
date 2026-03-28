import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getCars } from "../lib/api";
import type { Car } from "../types";
import { CarCard } from "../components/CarCard";
import { useLanguage } from "../lib/i18n";

export function CarsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [cars, setCars] = useState<Car[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { t } = useLanguage();

  useEffect(() => {
    setLoading(true);
    getCars(searchParams)
      .then((payload) => {
        setCars(payload.cars);
        setBrands(payload.brands);
        setError("");
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [searchParams]);

  const maxPrice = searchParams.get("maxPrice") || "";
  const filteredCars = useMemo(() => {
    if (!maxPrice) {
      return cars;
    }

    return cars.filter((car) => car.pricing.finalPrice <= Number(maxPrice));
  }, [cars, maxPrice]);

  function updateParam(key: string, value: string) {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    setSearchParams(next);
  }

  return (
    <div className="container-shell space-y-8 py-10">
      <div className="panel p-6 sm:p-8">
        <span className="eyebrow">{t("cars.eyebrow")}</span>
        <h1 className="section-title mt-4">{t("cars.title")}</h1>
        <p className="muted-copy mt-4 max-w-2xl">
          {t("cars.copy")}
        </p>
      </div>

      <div className="panel p-4 sm:p-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <input
            className="field"
            placeholder={t("cars.search")}
            value={searchParams.get("search") || ""}
            onChange={(event) => updateParam("search", event.target.value)}
          />

          <select
            className="field"
            value={searchParams.get("brand") || ""}
            onChange={(event) => updateParam("brand", event.target.value)}
          >
            <option value="">{t("cars.allBrands")}</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>

          <input
            className="field"
            type="number"
            min="2000"
            max="2100"
            placeholder={t("cars.year")}
            value={searchParams.get("year") || ""}
            onChange={(event) => updateParam("year", event.target.value)}
          />

          <input
            className="field"
            type="number"
            min="0"
            step="1000"
            placeholder={t("cars.maxPrice")}
            value={maxPrice}
            onChange={(event) => updateParam("maxPrice", event.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <select
              className="field"
              value={searchParams.get("status") || ""}
              onChange={(event) => updateParam("status", event.target.value)}
            >
              <option value="">{t("cars.allVisible")}</option>
              <option value="AVAILABLE">{t("cars.available")}</option>
              <option value="SOLD">{t("cars.sold")}</option>
            </select>

            <select
              className="field"
              value={searchParams.get("sort") || "newest"}
              onChange={(event) => updateParam("sort", event.target.value)}
            >
              <option value="newest">{t("cars.newest")}</option>
              <option value="price-asc">{t("cars.priceAsc")}</option>
              <option value="price-desc">{t("cars.priceDesc")}</option>
              <option value="year-desc">{t("cars.yearDesc")}</option>
              <option value="year-asc">{t("cars.yearAsc")}</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? <div className="text-center text-slate-500">{t("cars.loading")}</div> : null}
      {error ? <div className="text-center text-ember">{error}</div> : null}

      {!loading && !error ? (
        filteredCars.length ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        ) : (
          <div className="panel p-10 text-center text-slate-500">{t("cars.empty")}</div>
        )
      ) : null}
    </div>
  );
}
