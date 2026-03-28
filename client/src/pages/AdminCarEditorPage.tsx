import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getAdminCar, saveAdminCar } from "../lib/api";
import { buildAdminPath } from "../lib/admin";
import { resolveAssetUrl } from "../lib/assets";
import type { Car, CarStatus, DiscountType } from "../types";
import { translateCarStatus, useLanguage } from "../lib/i18n";

type ExistingImageState = {
  id: string;
  imageUrl: string;
  imageName: string;
  altText: string;
  sortOrder: number;
  isCover: boolean;
};

type CarFormState = {
  title: string;
  brand: string;
  model: string;
  slug: string;
  year: string;
  price: string;
  description: string;
  mileage: string;
  fuelType: string;
  transmission: string;
  color: string;
  condition: string;
  status: CarStatus;
  featured: boolean;
  discountEnabled: boolean;
  discountType: DiscountType;
  discountValue: string;
  discountActive: boolean;
  discountStartDate: string;
  discountEndDate: string;
};

const initialState: CarFormState = {
  title: "",
  brand: "",
  model: "",
  slug: "",
  year: "",
  price: "",
  description: "",
  mileage: "",
  fuelType: "",
  transmission: "",
  color: "",
  condition: "",
  status: "AVAILABLE",
  featured: false,
  discountEnabled: false,
  discountType: "PERCENTAGE",
  discountValue: "",
  discountActive: true,
  discountStartDate: "",
  discountEndDate: ""
};

export function AdminCarEditorPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const [form, setForm] = useState<CarFormState>(initialState);
  const [existingImages, setExistingImages] = useState<ExistingImageState[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);
  const { language, t } = useLanguage();
  const ui =
    language === "sv"
      ? {
          saveError: "Kunde inte spara bilen.",
          detailsTitle: "Bilinformation",
          title: "Titel",
          brand: "Marke",
          model: "Modell",
          slug: "Egen slug (valfritt)",
          year: "Ar",
          price: "Pris",
          mileage: "Miltal",
          fuelType: "Bransletyp",
          transmission: "Vaxellada",
          color: "Farg",
          condition: "Skick",
          description: "Beskrivning",
          featured: "Visa bilen i utvalda sektioner",
          discountTitle: "Rabattinställningar",
          enableDiscount: "Aktivera rabatt",
          percentageDiscount: "Procentrabatt",
          fixedDiscount: "Fast rabattbelopp",
          discountValue: "Rabattvarde",
          discountActive: "Rabatten ar aktiv nu",
          noDiscount: "Ingen aktiv rabatt visas for den har annonsen.",
          imageManager: "Bildhantering",
          imageCopy: "Andra ordning pa befintliga bilder, valj omslagsbild, ta bort gamla och lagg till nya filer innan du sparar.",
          setCover: "Valj omslagsbild",
          moveUp: "Flytta upp",
          moveDown: "Flytta ner",
          remove: "Ta bort",
          coverImage: "Omslagsbild",
          altText: "Alt-text",
          noImages: "Inga sparade bilder annu. Om du laddar upp nya filer nu blir den forsta omslagsbild automatiskt.",
          saving: "Sparar...",
          updateCar: "Uppdatera bil",
          createCar: "Skapa bil"
        }
      : {
          saveError: "Could not save the car.",
          detailsTitle: "Vehicle details",
          title: "Title",
          brand: "Brand",
          model: "Model",
          slug: "Custom slug (optional)",
          year: "Year",
          price: "Price",
          mileage: "Mileage",
          fuelType: "Fuel type",
          transmission: "Transmission",
          color: "Color",
          condition: "Condition",
          description: "Description",
          featured: "Show this car in featured sections",
          discountTitle: "Discount controls",
          enableDiscount: "Enable discount",
          percentageDiscount: "Percentage discount",
          fixedDiscount: "Fixed amount discount",
          discountValue: "Discount value",
          discountActive: "Discount active now",
          noDiscount: "No active discount will be shown for this listing.",
          imageManager: "Image manager",
          imageCopy: "Reorder existing photos, choose the cover image, remove old ones, and append new uploads before saving.",
          setCover: "Set cover",
          moveUp: "Move up",
          moveDown: "Move down",
          remove: "Remove",
          coverImage: "Cover image",
          altText: "Alt text",
          noImages: "No saved images yet. If you upload new files now, the first one becomes the cover automatically.",
          saving: "Saving...",
          updateCar: "Update car",
          createCar: "Create car"
        };

  useEffect(() => {
    if (!id) {
      return;
    }

    getAdminCar(id)
      .then((payload) => hydrateForm(payload.car))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const newFilePreviews = useMemo(
    () => newFiles.map((file) => ({ file, preview: URL.createObjectURL(file) })),
    [newFiles]
  );

  useEffect(() => {
    return () => {
      newFilePreviews.forEach((item) => URL.revokeObjectURL(item.preview));
    };
  }, [newFilePreviews]);

  function hydrateForm(car: Car) {
    setForm({
      title: car.title,
      brand: car.brand,
      model: car.model,
      slug: car.slug,
      year: String(car.year),
      price: String(car.price),
      description: car.description,
      mileage: String(car.mileage),
      fuelType: car.fuelType,
      transmission: car.transmission,
      color: car.color,
      condition: car.condition,
      status: car.status,
      featured: car.featured,
      discountEnabled: Boolean(car.discount),
      discountType: car.discount?.type || "PERCENTAGE",
      discountValue: car.discount ? String(car.discount.value) : "",
      discountActive: car.discount?.isActive ?? true,
      discountStartDate: car.discount?.startDate?.slice(0, 10) || "",
      discountEndDate: car.discount?.endDate?.slice(0, 10) || ""
    });
    setExistingImages(
      car.images.map((image) => ({
        id: image.id,
        imageUrl: resolveAssetUrl(image.imageUrl),
        imageName: image.imageName,
        altText: image.altText || "",
        sortOrder: image.sortOrder,
        isCover: image.isCover
      }))
    );
  }

  function updateField<Key extends keyof CarFormState>(key: Key, value: CarFormState[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function removeExistingImage(imageId: string) {
    setDeletedImageIds((current) => Array.from(new Set([...current, imageId])));
    setExistingImages((current) => {
      const next = current.filter((image) => image.id !== imageId);
      if (next.length && !next.some((image) => image.isCover)) {
        next[0] = { ...next[0], isCover: true };
      }
      return next.map((image, index) => ({ ...image, sortOrder: index }));
    });
  }

  function moveExistingImage(imageId: string, direction: "up" | "down") {
    setExistingImages((current) => {
      const index = current.findIndex((image) => image.id === imageId);
      const targetIndex = direction === "up" ? index - 1 : index + 1;

      if (index < 0 || targetIndex < 0 || targetIndex >= current.length) {
        return current;
      }

      const next = [...current];
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next.map((image, itemIndex) => ({ ...image, sortOrder: itemIndex }));
    });
  }

  async function handleSubmit() {
    setSaving(true);
    setError("");

    try {
      const payload = {
        title: form.title,
        brand: form.brand,
        model: form.model,
        slug: form.slug || undefined,
        year: Number(form.year),
        price: Number(form.price),
        description: form.description,
        mileage: Number(form.mileage),
        fuelType: form.fuelType,
        transmission: form.transmission,
        color: form.color,
        condition: form.condition,
        status: form.status,
        featured: form.featured,
        existingImages,
        deletedImageIds,
        discount: form.discountEnabled
          ? {
              type: form.discountType,
              value: Number(form.discountValue || 0),
              isActive: form.discountActive,
              startDate: form.discountStartDate || null,
              endDate: form.discountEndDate || null
            }
          : null
      };

      const formData = new FormData();
      formData.append("data", JSON.stringify(payload));
      newFiles.forEach((file) => formData.append("images", file));

      await saveAdminCar(isEditing ? "PUT" : "POST", formData, id);
      navigate(buildAdminPath("/cars"));
    } catch (err) {
      setError(err instanceof Error ? err.message : ui.saveError);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="panel p-6 text-slate-500">{t("admin.editor.loading")}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="panel flex flex-col gap-4 p-6 sm:flex-row sm:items-end sm:justify-between sm:p-8">
        <div>
          <span className="eyebrow">{isEditing ? t("admin.editor.editEyebrow") : t("admin.editor.newEyebrow")}</span>
          <h1 className="section-title mt-4">{isEditing ? t("admin.editor.editTitle") : t("admin.editor.newTitle")}</h1>
          <p className="muted-copy mt-4">{t("admin.editor.copy")}</p>
        </div>
        <Link to={buildAdminPath("/cars")} className="secondary-button">
          {t("admin.editor.back")}
        </Link>
      </div>

      {error ? <div className="panel p-5 text-ember">{error}</div> : null}

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <section className="panel p-6">
            <h2 className="font-display text-2xl">{ui.detailsTitle}</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <input className="field" placeholder={ui.title} value={form.title} onChange={(e) => updateField("title", e.target.value)} />
              <input className="field" placeholder={ui.brand} value={form.brand} onChange={(e) => updateField("brand", e.target.value)} />
              <input className="field" placeholder={ui.model} value={form.model} onChange={(e) => updateField("model", e.target.value)} />
              <input className="field" placeholder={ui.slug} value={form.slug} onChange={(e) => updateField("slug", e.target.value)} />
              <input className="field" type="number" placeholder={ui.year} value={form.year} onChange={(e) => updateField("year", e.target.value)} />
              <input className="field" type="number" placeholder={ui.price} value={form.price} onChange={(e) => updateField("price", e.target.value)} />
              <input className="field" type="number" placeholder={ui.mileage} value={form.mileage} onChange={(e) => updateField("mileage", e.target.value)} />
              <input className="field" placeholder={ui.fuelType} value={form.fuelType} onChange={(e) => updateField("fuelType", e.target.value)} />
              <input className="field" placeholder={ui.transmission} value={form.transmission} onChange={(e) => updateField("transmission", e.target.value)} />
              <input className="field" placeholder={ui.color} value={form.color} onChange={(e) => updateField("color", e.target.value)} />
              <input className="field" placeholder={ui.condition} value={form.condition} onChange={(e) => updateField("condition", e.target.value)} />
              <select className="field" value={form.status} onChange={(e) => updateField("status", e.target.value as CarStatus)}>
                <option value="AVAILABLE">{translateCarStatus("AVAILABLE", language)}</option>
                <option value="SOLD">{translateCarStatus("SOLD", language)}</option>
                <option value="HIDDEN">{translateCarStatus("HIDDEN", language)}</option>
              </select>
            </div>
            <textarea
              className="field mt-4 min-h-40"
              placeholder={ui.description}
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
            />
            <label className="mt-4 flex items-center gap-3 text-sm text-slate-700">
              <input type="checkbox" checked={form.featured} onChange={(e) => updateField("featured", e.target.checked)} />
              {ui.featured}
            </label>
          </section>

          <section className="panel p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl">{ui.discountTitle}</h2>
              <label className="flex items-center gap-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={form.discountEnabled}
                  onChange={(e) => updateField("discountEnabled", e.target.checked)}
                />
                {ui.enableDiscount}
              </label>
            </div>

            {form.discountEnabled ? (
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <select className="field" value={form.discountType} onChange={(e) => updateField("discountType", e.target.value as DiscountType)}>
                  <option value="PERCENTAGE">{ui.percentageDiscount}</option>
                  <option value="FIXED">{ui.fixedDiscount}</option>
                </select>
                <input
                  className="field"
                  type="number"
                  placeholder={ui.discountValue}
                  value={form.discountValue}
                  onChange={(e) => updateField("discountValue", e.target.value)}
                />
                <input
                  className="field"
                  type="date"
                  value={form.discountStartDate}
                  onChange={(e) => updateField("discountStartDate", e.target.value)}
                />
                <input
                  className="field"
                  type="date"
                  value={form.discountEndDate}
                  onChange={(e) => updateField("discountEndDate", e.target.value)}
                />
                <label className="flex items-center gap-3 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.discountActive}
                    onChange={(e) => updateField("discountActive", e.target.checked)}
                  />
                  {ui.discountActive}
                </label>
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-500">{ui.noDiscount}</p>
            )}
          </section>
        </div>

        <div className="space-y-6">
          <section className="panel p-6">
            <h2 className="font-display text-2xl">{ui.imageManager}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              {ui.imageCopy}
            </p>
            <input
              className="field mt-5"
              type="file"
              multiple
              accept="image/*"
              onChange={(event) => setNewFiles(Array.from(event.target.files || []))}
            />

            <div className="mt-6 grid gap-4">
              {existingImages.map((image, index) => (
                <div key={image.id} className="rounded-[24px] border border-line bg-shell p-4">
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <img src={image.imageUrl} alt={image.altText || form.title} className="h-28 w-full rounded-[20px] object-cover sm:w-40" />
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {image.isCover ? (
                          <span className="rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white">{ui.coverImage}</span>
                        ) : null}
                        <button type="button" className="secondary-button" onClick={() => setExistingImages((current) => current.map((item) => ({ ...item, isCover: item.id === image.id })))}>
                          {ui.setCover}
                        </button>
                        <button type="button" className="secondary-button" onClick={() => moveExistingImage(image.id, "up")} disabled={index === 0}>
                          {ui.moveUp}
                        </button>
                        <button type="button" className="secondary-button" onClick={() => moveExistingImage(image.id, "down")} disabled={index === existingImages.length - 1}>
                          {ui.moveDown}
                        </button>
                        <button type="button" className="secondary-button text-ember" onClick={() => removeExistingImage(image.id)}>
                          {ui.remove}
                        </button>
                      </div>
                      <input
                        className="field"
                        placeholder={ui.altText}
                        value={image.altText}
                        onChange={(event) =>
                          setExistingImages((current) =>
                            current.map((item) =>
                              item.id === image.id ? { ...item, altText: event.target.value } : item
                            )
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}

              {!existingImages.length ? (
                <div className="rounded-[24px] bg-sand p-5 text-sm text-slate-500">
                  {ui.noImages}
                </div>
              ) : null}
            </div>

            {newFilePreviews.length ? (
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {newFilePreviews.map((item, index) => (
                  <div key={`${item.file.name}-${index}`} className="overflow-hidden rounded-[24px] border border-line">
                    <img src={item.preview} alt={item.file.name} className="aspect-[4/3] w-full object-cover" />
                    <div className="flex items-center justify-between p-3 text-sm text-slate-600">
                      <span className="truncate">{item.file.name}</span>
                      <button
                        type="button"
                        className="text-ember"
                        onClick={() => setNewFiles((current) => current.filter((_, fileIndex) => fileIndex !== index))}
                      >
                        {ui.remove}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </section>

          <button type="button" className="primary-button w-full" onClick={handleSubmit} disabled={saving}>
            {saving ? ui.saving : isEditing ? ui.updateCar : ui.createCar}
          </button>
        </div>
      </div>
    </div>
  );
}
