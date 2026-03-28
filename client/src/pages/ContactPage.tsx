import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getContent, submitInquiry } from "../lib/api";
import type { SiteContent } from "../types";
import { localizeContent, normalizeExternalUrl, translateDay, translateHours, useLanguage } from "../lib/i18n";

type ContactJson = {
  phone?: string;
  email?: string;
  whatsapp?: string;
  recipientEmail?: string;
  address?: string;
  hours?: Array<{ day: string; hours: string }>;
  socialLinks?: Array<{ label: string; url: string }>;
};

export function ContactPage() {
  const [content, setContent] = useState<SiteContent<ContactJson> | null>(null);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState("");
  const { language, t } = useLanguage();

  useEffect(() => {
    getContent<ContactJson>("contact_page")
      .then((payload) => setContent(payload.content))
      .catch((err: Error) => setError(err.message));
  }, []);

  async function handleSubmit(formData: FormData) {
    setSending(true);
    setSuccess("");
    setError("");

    try {
      await submitInquiry({
        kind: "CONTACT",
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        message: formData.get("message")
      });
      setSuccess(t("contact.success"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit the form.");
    } finally {
      setSending(false);
    }
  }

  const localized = localizeContent("contact_page", content, language) as SiteContent<ContactJson> | null;

  return (
    <div className="container-shell space-y-8 py-10">
      <div className="panel p-6 sm:p-8">
        <span className="eyebrow">{t("contact.eyebrow")}</span>
        <h1 className="section-title mt-4">{localized?.title}</h1>
        <p className="muted-copy mt-4 max-w-3xl">{localized?.content}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          <div className="panel p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{t("contact.call")}</p>
            <a href={`tel:${localized?.jsonData?.phone || ""}`} className="mt-3 block font-display text-2xl text-ember">
              {localized?.jsonData?.phone}
            </a>
          </div>

          <div className="panel p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{t("contact.email")}</p>
            {localized?.jsonData?.email ? (
              <a
                href={`mailto:${localized?.jsonData?.email || ""}`}
                className="mt-3 block font-display text-2xl text-ink"
              >
                {localized?.jsonData?.email}
              </a>
            ) : (
              <p className="mt-3 text-sm text-slate-500">{t("contact.emailLater")}</p>
            )}
            <p className="mt-3 text-sm text-slate-500">{localized?.jsonData?.address}</p>
          </div>

          <div className="panel p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{t("contact.quickLinks")}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link to="/cars" className="secondary-button">
                {t("contact.browseCars")}
              </Link>
              <Link to="/services" className="secondary-button">
                {t("contact.viewServices")}
              </Link>
              {localized?.jsonData?.whatsapp ? (
                <a
                  href={normalizeExternalUrl(localized.jsonData.whatsapp)}
                  target="_blank"
                  rel="noreferrer"
                  className="primary-button"
                >
                  {t("contact.whatsapp")}
                </a>
              ) : null}
              {(localized?.jsonData?.socialLinks || []).filter((link) => link.label && link.url).map((link) => (
                <a
                  key={`${link.label}-${link.url}`}
                  href={normalizeExternalUrl(link.url)}
                  target="_blank"
                  rel="noreferrer"
                  className="secondary-button"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div className="panel p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{t("contact.businessHours")}</p>
            <div className="mt-4 grid gap-3">
              {(localized?.jsonData?.hours || []).map((row: { day: string; hours: string }) => (
                <div key={row.day} className="flex items-center justify-between rounded-[18px] bg-sand px-4 py-3 text-sm text-slate-700">
                  <span>{translateDay(row.day, language)}</span>
                  <span className="font-semibold">{translateHours(row.hours, language)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="panel p-6 sm:p-8">
          <h2 className="font-display text-3xl">{t("contact.sendMessage")}</h2>
          <form
            className="mt-6 grid gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              handleSubmit(new FormData(event.currentTarget));
            }}
          >
            <input name="name" className="field" placeholder={t("contact.name")} required />
            <input name="email" type="email" className="field" placeholder={t("contact.emailPlaceholder")} required />
            <input name="phone" className="field" placeholder={t("contact.phonePlaceholder")} />
            <textarea name="message" className="field min-h-40" placeholder={t("contact.messagePlaceholder")} required />
            <button type="submit" className="primary-button" disabled={sending}>
              {sending ? t("contact.submitting") : t("contact.submit")}
            </button>
            {success ? <p className="text-sm text-pine">{success}</p> : null}
            {error ? <p className="text-sm text-ember">{error}</p> : null}
          </form>
        </div>
      </div>
    </div>
  );
}
