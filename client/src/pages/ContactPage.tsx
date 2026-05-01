import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getContent, submitInquiry } from "../lib/api";
import type { SiteContent } from "../types";
import { normalizeExternalUrl, translateDay, translateHours, useLanguage } from "../lib/i18n";

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
  const [formError, setFormError] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState("");
  const { language, t } = useLanguage();

  useEffect(() => {
    // A content-load failure should not block the page — fail silently and
    // let the form still work. The form's own submit error is tracked separately.
    getContent<ContactJson>("contact_page")
      .then((payload) => setContent(payload.content))
      .catch(() => setContent(null));
  }, []);

  async function handleSubmit(formData: FormData) {
    setSending(true);
    setSuccess("");
    setFormError("");

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
      setFormError(err instanceof Error ? err.message : "Could not submit the form.");
    } finally {
      setSending(false);
    }
  }

  const phone = content?.jsonData?.phone;
  const email = content?.jsonData?.email;
  const whatsapp = content?.jsonData?.whatsapp;
  const address = content?.jsonData?.address;
  const hours = content?.jsonData?.hours || [];

  return (
    <div className="space-y-20 pb-24 pt-16 sm:space-y-24 sm:pt-24">
      {/* HERO */}
      <section className="container-shell">
        <div className="max-w-3xl space-y-6">
          <p className="text-sm font-medium text-slate">{t("contact.eyebrow")}</p>
          <h1 className="h-display">{t("contact.title")}</h1>
          <p className="lead">{t("contact.copy")}</p>
        </div>
      </section>

      {/* FORM + DETAILS */}
      <section className="container-shell">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Form */}
          <div className="lg:col-span-7">
            <form
              className="grid gap-4"
              onSubmit={(event) => {
                event.preventDefault();
                handleSubmit(new FormData(event.currentTarget));
              }}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <input name="name" className="field" placeholder={t("contact.name")} required />
                <input
                  name="email"
                  type="email"
                  className="field"
                  placeholder={t("contact.emailPlaceholder")}
                  required
                />
              </div>
              <input name="phone" className="field" placeholder={t("contact.phonePlaceholder")} />
              <textarea
                name="message"
                className="field min-h-40 resize-none"
                placeholder={t("contact.messagePlaceholder")}
                required
              />
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button type="submit" className="btn-primary" disabled={sending}>
                  {sending ? t("contact.submitting") : t("contact.submit")}
                </button>
                <Link to="/services" className="btn-link">
                  {t("contact.viewServices")} <span aria-hidden>→</span>
                </Link>
              </div>
              {success ? <p className="text-sm text-forest">{success}</p> : null}
              {formError ? <p className="text-sm text-bronze">{formError}</p> : null}
            </form>
          </div>

          {/* Side details */}
          <aside className="lg:col-span-5 space-y-4">
            {phone ? (
              <a href={`tel:${phone}`} className="card-hover block">
                <p className="text-xs font-semibold uppercase tracking-editorial text-slate">
                  {t("contact.call")}
                </p>
                <p className="mt-2 font-display text-xl font-semibold">{phone}</p>
              </a>
            ) : null}
            {email ? (
              <a href={`mailto:${email}`} className="card-hover block">
                <p className="text-xs font-semibold uppercase tracking-editorial text-slate">
                  {t("contact.email")}
                </p>
                <p className="mt-2 font-display text-base font-medium">{email}</p>
              </a>
            ) : null}
            {whatsapp ? (
              <a
                href={normalizeExternalUrl(whatsapp)}
                target="_blank"
                rel="noreferrer"
                className="card-hover block"
              >
                <p className="text-xs font-semibold uppercase tracking-editorial text-slate">
                  {t("contact.whatsapp")}
                </p>
                <p className="mt-2 font-display text-base font-medium">{t("contact.whatsapp")}</p>
              </a>
            ) : null}
            {address ? (
              <div className="card">
                <p className="text-xs font-semibold uppercase tracking-editorial text-slate">
                  {t("contact.visitUs")}
                </p>
                <p className="mt-2 text-sm leading-relaxed">{address}</p>
              </div>
            ) : null}
            {hours.length > 0 ? (
              <div className="card">
                <p className="text-xs font-semibold uppercase tracking-editorial text-slate">
                  {t("contact.businessHours")}
                </p>
                <div className="mt-3 divide-y divide-line">
                  {hours.map((row) => (
                    <div key={row.day} className="flex items-center justify-between py-2 text-sm">
                      <span className="text-slate">{translateDay(row.day, language)}</span>
                      <span className="font-medium">{translateHours(row.hours, language)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </aside>
        </div>
      </section>
    </div>
  );
}
