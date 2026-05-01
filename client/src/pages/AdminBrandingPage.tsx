import { useEffect, useRef, useState } from "react";
import { getContent, resetAdminLogo, uploadAdminLogo } from "../lib/api";
import { resolveAssetUrl } from "../lib/assets";
import { BrandLogo, DefaultMark, notifyBrandingChanged } from "../components/BrandLogo";
import { useLanguage } from "../lib/i18n";

type BrandingJson = {
  logoUrl?: string;
};

export function AdminBrandingPage() {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { language } = useLanguage();

  const ui =
    language === "sv"
      ? {
          title: "Logotyp",
          copy: "Ladda upp en egen logotyp eller återställ till standardmärket. PNG, JPG, WEBP eller SVG. Max 2 MB.",
          currentLogo: "Aktuell logotyp",
          defaultLogo: "Standardmärke",
          customLogo: "Egen logotyp",
          choose: "Välj fil",
          replace: "Ersätt fil",
          dropHint: "eller dra och släpp en bild här",
          preview: "Förhandsgranskning",
          save: "Spara logotyp",
          saving: "Sparar...",
          reset: "Återställ standard",
          resetting: "Återställer...",
          discard: "Avbryt",
          uploadSuccess: "Logotypen sparades.",
          resetSuccess: "Standardmärket är aktivt.",
          uploadError: "Kunde inte spara logotypen.",
          resetError: "Kunde inte återställa logotypen.",
          fileTooLarge: "Filen är för stor. Max 2 MB.",
          invalidType: "Endast PNG, JPG, WEBP eller SVG."
        }
      : {
          title: "Logo",
          copy: "Upload a custom logo or reset to the default mark. PNG, JPG, WEBP, or SVG. Max 2 MB.",
          currentLogo: "Current logo",
          defaultLogo: "Default mark",
          customLogo: "Custom logo",
          choose: "Choose file",
          replace: "Replace file",
          dropHint: "or drop an image here",
          preview: "Preview",
          save: "Save logo",
          saving: "Saving...",
          reset: "Reset to default",
          resetting: "Resetting...",
          discard: "Discard",
          uploadSuccess: "Logo saved.",
          resetSuccess: "Default mark restored.",
          uploadError: "Could not save the logo.",
          resetError: "Could not reset the logo.",
          fileTooLarge: "File is too large. Max 2 MB.",
          invalidType: "Only PNG, JPG, WEBP, or SVG."
        };

  useEffect(() => {
    let cancelled = false;
    getContent<BrandingJson>("site_branding")
      .then((payload) => {
        if (cancelled) return;
        setLogoUrl(payload?.content?.jsonData?.logoUrl?.trim() || null);
      })
      .catch(() => {
        if (!cancelled) setLogoUrl(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function handleFileSelected(file: File | null) {
    setError("");
    setSuccess("");
    if (!file) {
      return;
    }

    const allowed = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];
    if (!allowed.includes(file.type)) {
      setError(ui.invalidType);
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError(ui.fileTooLarge);
      return;
    }

    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setPendingFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  function discardPending() {
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setPendingFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSave() {
    if (!pendingFile) return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const result = await uploadAdminLogo(pendingFile);
      setLogoUrl(result.logoUrl);
      notifyBrandingChanged(result.logoUrl);
      discardPending();
      setSuccess(ui.uploadSuccess);
    } catch (err) {
      setError(err instanceof Error ? err.message : ui.uploadError);
    } finally {
      setSaving(false);
    }
  }

  async function handleReset() {
    setResetting(true);
    setError("");
    setSuccess("");
    try {
      await resetAdminLogo();
      setLogoUrl(null);
      notifyBrandingChanged(null);
      discardPending();
      setSuccess(ui.resetSuccess);
    } catch (err) {
      setError(err instanceof Error ? err.message : ui.resetError);
    } finally {
      setResetting(false);
    }
  }

  if (loading) {
    return <div className="text-sm text-slate">{ui.saving === "Saving..." ? "Loading..." : "Laddar..."}</div>;
  }

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <h1 className="h-section">{ui.title}</h1>
        <p className="lead">{ui.copy}</p>
      </header>

      <section className="grid gap-6 lg:grid-cols-2">
        {/* Current */}
        <div className="card space-y-4">
          <p className="text-xs font-semibold uppercase tracking-editorial text-slate">
            {ui.currentLogo}
          </p>
          <div className="flex items-center gap-5">
            <div className="rounded-edge border border-line bg-soft p-4">
              {logoUrl ? (
                <img
                  src={resolveAssetUrl(logoUrl)}
                  alt="Current logo"
                  className="h-16 w-16 rounded-edge object-cover"
                />
              ) : (
                <DefaultMark size={64} className="rounded-edge" />
              )}
            </div>
            <div>
              <p className="font-display text-base font-semibold">
                {logoUrl ? ui.customLogo : ui.defaultLogo}
              </p>
              <p className="mt-1 text-sm text-slate">
                {logoUrl ? logoUrl : "—"}
              </p>
              {logoUrl ? (
                <button
                  type="button"
                  className="btn-link mt-3"
                  onClick={handleReset}
                  disabled={resetting}
                >
                  {resetting ? ui.resetting : ui.reset} <span aria-hidden>→</span>
                </button>
              ) : null}
            </div>
          </div>
        </div>

        {/* Upload */}
        <div className="card space-y-4">
          <p className="text-xs font-semibold uppercase tracking-editorial text-slate">
            {ui.preview}
          </p>

          {previewUrl ? (
            <div className="flex items-center gap-5">
              <div className="rounded-edge border border-line bg-soft p-4">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="h-16 w-16 rounded-edge object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-ink">{pendingFile?.name}</p>
                <p className="mt-1 text-xs text-slate">
                  {pendingFile ? `${(pendingFile.size / 1024).toFixed(1)} KB` : null}
                </p>
                <div className="mt-3 flex flex-wrap gap-3">
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? ui.saving : ui.save}
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={discardPending}
                    disabled={saving}
                  >
                    {ui.discard}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <label
              className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-card border border-dashed border-line bg-soft px-6 py-12 text-center transition hover:border-ink/30 hover:bg-paper"
              onDragOver={(event) => {
                event.preventDefault();
              }}
              onDrop={(event) => {
                event.preventDefault();
                const file = event.dataTransfer.files?.[0] ?? null;
                handleFileSelected(file);
              }}
            >
              <span className="btn-secondary">
                {logoUrl ? ui.replace : ui.choose}
              </span>
              <span className="text-xs text-muted">{ui.dropHint}</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                className="hidden"
                onChange={(event) => handleFileSelected(event.target.files?.[0] ?? null)}
              />
            </label>
          )}
        </div>
      </section>

      {success ? <p className="text-sm text-pine">{success}</p> : null}
      {error ? <p className="text-sm text-accentDeep">{error}</p> : null}

      <section className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-editorial text-slate">
          Live preview
        </p>
        <div className="card flex items-center gap-3">
          <BrandLogo size={40} className="rounded-edge" />
          <span className="font-display text-base font-semibold">Bilvård center</span>
        </div>
      </section>
    </div>
  );
}
