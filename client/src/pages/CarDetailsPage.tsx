import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCar, submitInquiry } from "../lib/api";
import { resolveAssetUrl } from "../lib/assets";
import { formatCurrency, formatNumber, getDiscountBadge } from "../lib/format";
import type { Car } from "../types";
import { translateCarStatus, useLanguage } from "../lib/i18n";

export function CarDetailsPage() {
  const { slug = "" } = useParams();
  const [car, setCar] = useState<Car | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [pageError, setPageError] = useState("");
  const [formError, setFormError] = useState("");
  const [sending, setSending] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const { language, t } = useLanguage();

  useEffect(() => {
    getCar(slug)
      .then((payload) => setCar(payload.car))
      .catch((err: Error) => setPageError(err.message));
  }, [slug]);

  if (pageError) {
    return <div className="container-shell py-20 text-center text-ember">{pageError}</div>;
  }

  if (!car) {
    return <div className="container-shell py-20 text-center text-slate-500">{t("car.loading")}</div>;
  }

  const images = car.images.length
    ? car.images
    : [
        {
          id: "fallback",
          imageUrl: "https://placehold.co/1200x900?text=Car",
          imageName: "fallback",
          altText: car.title,
          sortOrder: 0,
          isCover: true,
          createdAt: new Date().toISOString()
        }
      ];
  const badge = getDiscountBadge(car.discount);

  async function handleSubmit(formData: FormData) {
    if (!car) {
      return;
    }

    setSending(true);
    setSuccessMessage("");
    setFormError("");

    try {
      await submitInquiry({
        kind: "CAR",
        carId: car.id,
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        message: formData.get("message")
      });
      setSuccessMessage(t("car.success"));
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Could not send inquiry.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="container-shell space-y-8 py-10">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <div className="panel overflow-hidden">
            <img
              src={resolveAssetUrl(images[selectedImage]?.imageUrl)}
              alt={images[selectedImage]?.altText || car.title}
              className="aspect-[4/3] w-full object-cover"
            />
          </div>

          <div className="grid grid-cols-4 gap-3">
            {images.map((image, index) => (
              <button
                key={image.id}
                type="button"
                className={`overflow-hidden rounded-[20px] border ${selectedImage === index ? "border-bronze" : "border-line"}`}
                onClick={() => setSelectedImage(index)}
              >
                <img src={resolveAssetUrl(image.imageUrl)} alt={image.altText || car.title} className="aspect-[4/3] w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="panel p-6 sm:p-8">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white">{translateCarStatus(car.status, language)}</span>
            {badge ? <span className="rounded-full bg-ember px-3 py-1 text-xs font-semibold text-white">{badge}</span> : null}
          </div>

          <h1 className="mt-5 font-display text-4xl">{car.title}</h1>
          <p className="mt-2 text-slate-500">
            {car.brand} {car.model} • {car.year}
          </p>

          <div className="mt-6">
            {car.pricing.discountActive ? (
              <div className="space-y-2">
                <p className="text-sm text-slate-400 line-through">{formatCurrency(car.price)}</p>
                <p className="font-display text-4xl text-ember">{formatCurrency(car.pricing.finalPrice)}</p>
              </div>
            ) : (
              <p className="font-display text-4xl text-ink">{formatCurrency(car.price)}</p>
            )}
          </div>

          <p className="mt-6 text-sm leading-7 text-slate-600">{car.description}</p>

          <div className="mt-6 grid grid-cols-2 gap-3 text-sm text-slate-700">
            <Spec label={t("car.spec.mileage")} value={`${formatNumber(car.mileage)} mi`} />
            <Spec label={t("car.spec.fuel")} value={car.fuelType} />
            <Spec label={t("car.spec.transmission")} value={car.transmission} />
            <Spec label={t("car.spec.color")} value={car.color} />
            <Spec label={t("car.spec.condition")} value={car.condition} />
            <Spec label={t("car.spec.availability")} value={translateCarStatus(car.status, language)} />
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="panel p-6 sm:p-8">
          <span className="eyebrow">{t("car.quickInquiry")}</span>
          <h2 className="section-title mt-4">{t("car.askVehicle")}</h2>
          <form
            className="mt-6 grid gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              handleSubmit(new FormData(event.currentTarget));
            }}
          >
            <input name="name" className="field" placeholder={t("car.name")} required />
            <input name="email" type="email" className="field" placeholder={t("car.email")} required />
            <input name="phone" className="field" placeholder={t("car.phone")} />
            <textarea name="message" className="field min-h-32" placeholder={t("car.message")} required />
            <button type="submit" className="primary-button" disabled={sending}>
              {sending ? t("car.sending") : t("car.sendInquiry")}
            </button>
            {successMessage ? <p className="text-sm text-pine">{successMessage}</p> : null}
            {formError ? <p className="text-sm text-ember">{formError}</p> : null}
          </form>
        </div>

        <div className="panel p-6 sm:p-8">
          <span className="eyebrow">{t("car.whyBuy")}</span>
          <div className="mt-4 space-y-4">
            <InfoBlock title={t("car.transparentPricing")} copy={t("car.transparentPricingCopy")} />
            <InfoBlock title={t("car.mobileReady")} copy={t("car.mobileReadyCopy")} />
            <InfoBlock title={t("car.salesCare")} copy={t("car.salesCareCopy")} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] bg-sand p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-2 font-semibold text-ink">{value}</p>
    </div>
  );
}

function InfoBlock({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="rounded-[24px] border border-line bg-shell p-5">
      <h3 className="font-display text-xl">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-slate-600">{copy}</p>
    </div>
  );
}
