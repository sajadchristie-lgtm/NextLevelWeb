import { useEffect, useState } from "react";
import { getContent, saveAdminContent } from "../lib/api";
import { SERVICE_PACKAGES, STANDALONE_SERVICES, SIZE_LABELS, type SizeKey } from "../lib/services-data";
import { PRICING_KEY, buildDefaultPricing, slugifyAddon, type PricingState } from "../lib/pricing";
import { useLanguage } from "../lib/i18n";

const SIZE_KEYS: SizeKey[] = ["small", "medium", "large"];

export function AdminPricingPage() {
  const [state, setState] = useState<PricingState>(() => buildDefaultPricing());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { language, t } = useLanguage();

  const ui =
    language === "sv"
      ? {
          title: "Priser",
          copy: "Justera priser för paket, tillägg och enskilda tjänster. Ändringar visas direkt på den publika webbplatsen.",
          packagesTitle: "Paket",
          standaloneTitle: "Enskilda tjänster",
          addonsTitle: "Tillägg",
          save: "Spara priser",
          saving: "Sparar...",
          reset: "Återställ standardpriser",
          saved: "Priserna sparades.",
          saveError: "Kunde inte spara priserna.",
          currency: "kr"
        }
      : {
          title: "Pricing",
          copy: "Adjust prices for packages, add-ons, and standalone services. Changes appear on the public site immediately.",
          packagesTitle: "Packages",
          standaloneTitle: "Standalone services",
          addonsTitle: "Add-ons",
          save: "Save pricing",
          saving: "Saving...",
          reset: "Reset to defaults",
          saved: "Pricing saved.",
          saveError: "Could not save pricing.",
          currency: "kr"
        };

  useEffect(() => {
    let cancelled = false;
    getContent<Partial<PricingState>>(PRICING_KEY)
      .then((payload) => {
        if (cancelled) return;
        setState(mergeWithDefaults(payload?.content?.jsonData));
      })
      .catch(() => {
        // No record yet — defaults stand
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function updatePackagePrice(slug: string, size: SizeKey, value: number) {
    setState((current) => ({
      ...current,
      packages: {
        ...current.packages,
        [slug]: {
          ...current.packages[slug],
          [size]: Number.isFinite(value) ? value : 0
        }
      }
    }));
  }

  function updateAddonPrice(packageSlug: string, addonSlug: string, value: number) {
    setState((current) => {
      const pkg = current.packages[packageSlug];
      if (!pkg) return current;
      const existing = pkg.addons.find((addon) => addon.slug === addonSlug);
      const nextAddons = existing
        ? pkg.addons.map((addon) =>
            addon.slug === addonSlug ? { ...addon, price: Number.isFinite(value) ? value : 0 } : addon
          )
        : [...pkg.addons, { slug: addonSlug, price: Number.isFinite(value) ? value : 0 }];
      return {
        ...current,
        packages: {
          ...current.packages,
          [packageSlug]: { ...pkg, addons: nextAddons }
        }
      };
    });
  }

  function updateStandalonePrice(slug: string, value: number) {
    setState((current) => ({
      ...current,
      standalone: { ...current.standalone, [slug]: Number.isFinite(value) ? value : 0 }
    }));
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await saveAdminContent(PRICING_KEY, {
        title: "Service pricing",
        content: "Admin-controlled pricing for service packages and standalone services.",
        isActive: true,
        jsonData: state
      });
      setSuccess(ui.saved);
    } catch (err) {
      setError(err instanceof Error ? err.message : ui.saveError);
    } finally {
      setSaving(false);
    }
  }

  function handleReset() {
    setState(buildDefaultPricing());
  }

  if (loading) {
    return <div className="text-sm text-slate">{t("loading")}</div>;
  }

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <h1 className="h-section">{ui.title}</h1>
        <p className="lead">{ui.copy}</p>
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button type="button" className="btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? ui.saving : ui.save}
          </button>
          <button type="button" className="btn-secondary" onClick={handleReset}>
            {ui.reset}
          </button>
          {success ? <span className="text-sm text-pine">{success}</span> : null}
          {error ? <span className="text-sm text-accentDeep">{error}</span> : null}
        </div>
      </header>

      <section className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-editorial text-slate">
          {ui.packagesTitle}
        </p>
        <div className="space-y-3">
          {SERVICE_PACKAGES.map((pkg) => {
            const pricing = state.packages[pkg.slug] || { small: 0, medium: 0, large: 0, addons: [] };
            return (
              <div key={pkg.slug} className="card space-y-5">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="h-card">{pkg.title[language]}</h2>
                  {pkg.featured ? (
                    <span className="rounded-edge bg-ink px-2 py-0.5 text-[10px] font-medium uppercase tracking-editorial text-paper">
                      {t("services.featured")}
                    </span>
                  ) : null}
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {SIZE_KEYS.map((size) => (
                    <PriceField
                      key={size}
                      label={SIZE_LABELS[size][language]}
                      value={pricing[size] ?? 0}
                      onChange={(value) => updatePackagePrice(pkg.slug, size, value)}
                      currency={ui.currency}
                    />
                  ))}
                </div>

                {pkg.addons && pkg.addons.length > 0 ? (
                  <div className="space-y-3 border-t border-line pt-5">
                    <p className="text-xs font-semibold uppercase tracking-editorial text-slate">
                      {ui.addonsTitle}
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {pkg.addons.map((addon) => {
                        const addonSlug = slugifyAddon(addon.label.en);
                        const adminAddon = pricing.addons.find((a) => a.slug === addonSlug);
                        const value = adminAddon?.price ?? addon.price;
                        return (
                          <PriceField
                            key={addonSlug}
                            label={addon.label[language]}
                            value={value}
                            onChange={(next) => updateAddonPrice(pkg.slug, addonSlug, next)}
                            currency={ui.currency}
                          />
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>

      <section className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-editorial text-slate">
          {ui.standaloneTitle}
        </p>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {STANDALONE_SERVICES.map((svc) => (
            <PriceField
              key={svc.slug}
              label={svc.title[language]}
              value={state.standalone[svc.slug] ?? svc.price}
              onChange={(value) => updateStandalonePrice(svc.slug, value)}
              currency={ui.currency}
            />
          ))}
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3 border-t border-line pt-6">
        <button type="button" className="btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? ui.saving : ui.save}
        </button>
        <button type="button" className="btn-secondary" onClick={handleReset}>
          {ui.reset}
        </button>
        {success ? <span className="text-sm text-pine">{success}</span> : null}
        {error ? <span className="text-sm text-accentDeep">{error}</span> : null}
      </div>
    </div>
  );
}

function PriceField({
  label,
  value,
  onChange,
  currency
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  currency: string;
}) {
  return (
    <label className="flex flex-col gap-1.5 rounded-edge border border-line bg-paper px-4 py-3 transition focus-within:border-ink">
      <span className="text-[11px] font-medium uppercase tracking-editorial text-slate">{label}</span>
      <div className="flex items-baseline gap-2">
        <input
          type="number"
          min={0}
          step={50}
          inputMode="numeric"
          className="w-full bg-transparent font-display text-xl font-semibold text-ink outline-none"
          value={Number.isFinite(value) ? value : 0}
          onChange={(event) => onChange(Number(event.target.value))}
        />
        <span className="text-xs font-medium text-slate">{currency}</span>
      </div>
    </label>
  );
}

function mergeWithDefaults(override: Partial<PricingState> | null | undefined): PricingState {
  const defaults = buildDefaultPricing();
  if (!override) return defaults;
  return {
    packages: { ...defaults.packages, ...(override.packages || {}) },
    standalone: { ...defaults.standalone, ...(override.standalone || {}) }
  };
}
