import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { getAdminContent, getAdminServices, saveAdminContent, saveAdminServices } from "../lib/api";
import type { Service, SiteContent } from "../types";
import { normalizeExternalUrl, useLanguage } from "../lib/i18n";

type ContentMap = Record<string, SiteContent<any>>;

function toHoursLines(hours?: Array<{ day: string; hours: string }>) {
  return (hours || []).map((row) => `${row.day}: ${row.hours}`).join("\n");
}

function parseHoursLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [day, ...hoursParts] = line.split(":");
      return {
        day: day.trim(),
        hours: hoursParts.join(":").trim()
      };
    });
}

function toStatsLines(stats?: Array<{ label: string; value: string }>) {
  return (stats || []).map((row) => `${row.label}|${row.value}`).join("\n");
}

function parseStatsLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, value] = line.split("|");
      return { label: label?.trim() || "", value: value?.trim() || "" };
    })
    .filter((row) => row.label);
}

function toSocialLinkLines(socialLinks?: Array<{ label: string; url: string }>) {
  return (socialLinks || []).map((row) => `${row.label}|${row.url}`).join("\n");
}

function looksLikeUrl(value: string) {
  return /^(https?:\/\/|www\.|[a-z0-9-]+\.[a-z]{2,})/i.test(value.trim());
}

function inferSocialLabel(url: string) {
  try {
    const hostname = new URL(normalizeExternalUrl(url)).hostname.replace(/^www\./i, "");
    const domain = hostname.split(".")[0]?.toLowerCase() || "link";
    const knownLabels: Record<string, string> = {
      facebook: "Facebook",
      instagram: "Instagram",
      tiktok: "TikTok",
      youtube: "YouTube",
      linkedin: "LinkedIn",
      x: "X",
      twitter: "X"
    };

    return knownLabels[domain] || domain.charAt(0).toUpperCase() + domain.slice(1);
  } catch {
    return "Link";
  }
}

function parseSocialLinkLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      if (line.includes("|")) {
        const separatorIndex = line.indexOf("|");
        const label = line.slice(0, separatorIndex).trim();
        const url = line.slice(separatorIndex + 1).trim();
        return {
          label: label || inferSocialLabel(url),
          url
        };
      }

      if (looksLikeUrl(line)) {
        return {
          label: inferSocialLabel(line),
          url: line
        };
      }

      return { label: line, url: "" };
    })
    .filter((row) => row.label || row.url);
}

export function AdminContentPage() {
  const [services, setServices] = useState<Partial<Service>[]>([]);
  const [removedIds, setRemovedIds] = useState<string[]>([]);
  const [contentMap, setContentMap] = useState<ContentMap>({});
  const [error, setError] = useState("");
  const [savingKey, setSavingKey] = useState("");
  const [socialLinksDraft, setSocialLinksDraft] = useState("");
  const { language, t } = useLanguage();
  const ui =
    language === "sv"
      ? {
          saveError: "Kunde inte spara innehall.",
          saveServicesError: "Kunde inte spara tjanster.",
          servicesTitle: "Tjanster",
          servicesCopy: "Redigera titlar, beskrivningar, ordning och synlighet.",
          addService: "Lagg till tjanst",
          saveServices: "Spara tjanster",
          saving: "Sparar...",
          serviceTitle: "Tjanstetitel",
          serviceSlug: "Slug (valfritt)",
          order: "Ordning",
          visible: "Visa pa sidan",
          serviceDescription: "Tjanstebeskrivning",
          removeService: "Ta bort tjanst",
          homepageTitle: "Startsida",
          homepageCopy: "Hantera hero-text, kort och punkter for varfor kunder ska valja er.",
          homepageTitleField: "Startsidans titel",
          homepageTextField: "Stodtext for startsidan",
          statsField: "Kortrader, en per rad\nBilar redo att visas|",
          whyChooseUsField: "Varfor valja oss, en punkt per rad",
          aboutTitle: "Om oss-sida",
          aboutCopy: "Redigera introduktion, mal och varderingar.",
          aboutHeading: "Rubrik for om oss",
          aboutIntro: "Introtext",
          missionTitle: "Mal-rubrik",
          missionBody: "Mal-text",
          valuesTitle: "Varderingar-rubrik",
          valuesField: "Varderingar, en per rad",
          teamTitle: "Rubrik for teamsektion",
          teamBody: "Text for teamsektion",
          locationTitle: "Hitta hit-sida",
          locationCopy: "Uppdatera adress, anteckningar, kartlank, oppettider och telefon.",
          locationHeading: "Rubrik for hitta hit",
          locationDescription: "Beskrivning av platsen",
          address: "Adress",
          phone: "Telefonnummer",
          mapUrl: "Kartans URL",
          notes: "Hjalpfulla anteckningar",
          hoursField: "Oppettider, en per rad\nSaturday: 9:00 AM - 7:00 PM",
          contactTitle: "Kontaktsida",
          contactCopy: "Hantera telefon, e-post, WhatsApp, sociala lankar, mottagare och visade oppettider.",
          contactHeading: "Rubrik for kontakt",
          contactDescription: "Beskrivning for kontakt",
          publicEmail: "Publik e-post",
          recipientEmail: "E-post for formularet",
          whatsapp: "WhatsApp-lank",
          socials: "Sociala lankar, en per rad\nFacebook|https://facebook.com/yourpage\neller bara https://instagram.com/yourpage",
          saveSection: "Spara sektion"
        }
      : {
          saveError: "Could not save content.",
          saveServicesError: "Could not save services.",
          servicesTitle: "Services",
          servicesCopy: "Edit titles, descriptions, order, and visibility.",
          addService: "Add service",
          saveServices: "Save services",
          saving: "Saving...",
          serviceTitle: "Service title",
          serviceSlug: "Slug (optional)",
          order: "Order",
          visible: "Visible on site",
          serviceDescription: "Service description",
          removeService: "Remove service",
          homepageTitle: "Homepage",
          homepageCopy: "Manage hero copy, cards, and why-choose-us bullets.",
          homepageTitleField: "Homepage title",
          homepageTextField: "Homepage supporting text",
          statsField: "Card lines, one per row\nVehicles ready to view|",
          whyChooseUsField: "Why choose us points, one per line",
          aboutTitle: "About Page",
          aboutCopy: "Edit intro copy, mission statement, and values.",
          aboutHeading: "About heading",
          aboutIntro: "About intro",
          missionTitle: "Mission title",
          missionBody: "Mission body",
          valuesTitle: "Values title",
          valuesField: "Values, one per line",
          teamTitle: "Team section title",
          teamBody: "Team section body",
          locationTitle: "Location Page",
          locationCopy: "Update address, notes, map link, hours, and quick call details.",
          locationHeading: "Location heading",
          locationDescription: "Location description",
          address: "Address",
          phone: "Phone number",
          mapUrl: "Map embed URL",
          notes: "Helpful notes",
          hoursField: "Hours, one per line\nSaturday: 9:00 AM - 7:00 PM",
          contactTitle: "Contact Page",
          contactCopy: "Manage public phone, email, WhatsApp link, social links, recipient email, and displayed hours.",
          contactHeading: "Contact heading",
          contactDescription: "Contact description",
          publicEmail: "Public email",
          recipientEmail: "Form recipient email",
          whatsapp: "WhatsApp link",
          socials: "Social links, one per line\nFacebook|https://facebook.com/yourpage\nor just https://instagram.com/yourpage",
          saveSection: "Save section"
        };

  useEffect(() => {
    Promise.all([getAdminServices(), getAdminContent()])
      .then(([servicePayload, contentPayload]) => {
        const nextContentMap = contentPayload.content.reduce<ContentMap>((accumulator, item) => {
          accumulator[item.key] = item;
          return accumulator;
        }, {});

        setServices(servicePayload.services);
        setContentMap(nextContentMap);
        setSocialLinksDraft(toSocialLinkLines(nextContentMap.contact_page?.jsonData?.socialLinks));
      })
      .catch((err: Error) => setError(err.message));
  }, []);

  function updateService(index: number, field: keyof Service, value: unknown) {
    setServices((current) =>
      current.map((service, serviceIndex) =>
        serviceIndex === index ? { ...service, [field]: value } : service
      )
    );
  }

  function updateContent(key: string, next: Partial<SiteContent<any>>) {
    setContentMap((current) => ({
      ...current,
      [key]: {
        ...(current[key] || {
          id: "",
          key,
          title: "",
          content: "",
          jsonData: {},
          isActive: true,
          createdAt: "",
          updatedAt: ""
        }),
        ...next,
        jsonData: {
          ...(current[key]?.jsonData || {}),
          ...(next.jsonData || {})
        }
      }
    }));
  }

  async function handleSaveServices() {
    setSavingKey("services");
    setError("");
    try {
      const payload = await saveAdminServices({
        services: services.map((service, index) => ({
          id: service.id,
          title: service.title,
          slug: service.slug,
          description: service.description,
          order: service.order ?? index + 1,
          isActive: Boolean(service.isActive)
        })),
        removedIds
      });
      setServices(payload.services);
      setRemovedIds([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : ui.saveServicesError);
    } finally {
      setSavingKey("");
    }
  }

  async function handleSaveContent(key: string, payload: Record<string, unknown>) {
    setSavingKey(key);
    setError("");
    try {
      const response = await saveAdminContent(key, payload);
      setContentMap((current) => ({ ...current, [key]: response.content }));
      if (key === "contact_page") {
        setSocialLinksDraft(
          toSocialLinkLines(
            (response.content.jsonData as { socialLinks?: Array<{ label: string; url: string }> } | null)?.socialLinks
          )
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : ui.saveError);
    } finally {
      setSavingKey("");
    }
  }

  const homepage = contentMap.homepage_sections;
  const about = contentMap.about_page;
  const location = contentMap.location_page;
  const contact = contentMap.contact_page;

  return (
    <div className="space-y-6">
        <div className="panel p-6 sm:p-8">
        <span className="eyebrow">{t("admin.content.eyebrow")}</span>
        <h1 className="section-title mt-4">{t("admin.content.title")}</h1>
        <p className="muted-copy mt-4">{t("admin.content.copy")}</p>
      </div>

      {error ? <div className="panel p-5 text-ember">{error}</div> : null}

      <section className="panel p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-2xl">{ui.servicesTitle}</h2>
            <p className="mt-2 text-sm text-slate-500">{ui.servicesCopy}</p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              className="secondary-button"
              onClick={() =>
                setServices((current) => [
                  ...current,
                  {
                    title: "New Service",
                    slug: "",
                    description: "Describe the service.",
                    order: current.length + 1,
                    isActive: true
                  }
                ])
              }
            >
              {ui.addService}
            </button>
            <button type="button" className="primary-button" onClick={handleSaveServices} disabled={savingKey === "services"}>
              {savingKey === "services" ? ui.saving : ui.saveServices}
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4">
          {services.map((service, index) => (
            <div key={service.id || index} className="rounded-[24px] border border-line bg-shell p-4">
              <div className="grid gap-4 md:grid-cols-2">
                <input className="field" value={service.title || ""} onChange={(e) => updateService(index, "title", e.target.value)} placeholder={ui.serviceTitle} />
                <input className="field" value={service.slug || ""} onChange={(e) => updateService(index, "slug", e.target.value)} placeholder={ui.serviceSlug} />
                <input className="field" type="number" value={service.order || 0} onChange={(e) => updateService(index, "order", Number(e.target.value))} placeholder={ui.order} />
                <label className="flex items-center gap-3 rounded-[22px] border border-line bg-white px-4 py-3 text-sm text-slate-700">
                  <input type="checkbox" checked={Boolean(service.isActive)} onChange={(e) => updateService(index, "isActive", e.target.checked)} />
                  {ui.visible}
                </label>
              </div>
              <textarea className="field mt-4 min-h-28" value={service.description || ""} onChange={(e) => updateService(index, "description", e.target.value)} placeholder={ui.serviceDescription} />
              <button
                type="button"
                className="secondary-button mt-4 text-ember"
                onClick={() => {
                  if (service.id) {
                    setRemovedIds((current) => [...current, service.id as string]);
                  }
                  setServices((current) => current.filter((_, itemIndex) => itemIndex !== index));
                }}
              >
                {ui.removeService}
              </button>
            </div>
          ))}
        </div>
      </section>

      <ContentSection
        title={ui.homepageTitle}
        description={ui.homepageCopy}
        onSave={() =>
          handleSaveContent("homepage_sections", {
            title: homepage?.title || "",
            content: homepage?.content || "",
            isActive: homepage?.isActive ?? true,
            jsonData: homepage?.jsonData || {}
          })
        }
        saving={savingKey === "homepage_sections"}
        saveLabel={ui.saveSection}
        savingLabel={ui.saving}
      >
        <div className="grid gap-4">
          <input className="field" value={homepage?.title || ""} onChange={(e) => updateContent("homepage_sections", { title: e.target.value })} placeholder={ui.homepageTitleField} />
          <textarea className="field min-h-28" value={homepage?.content || ""} onChange={(e) => updateContent("homepage_sections", { content: e.target.value })} placeholder={ui.homepageTextField} />
          <textarea
            className="field min-h-24"
            value={toStatsLines(homepage?.jsonData?.stats)}
            onChange={(e) =>
              updateContent("homepage_sections", {
                jsonData: { ...homepage?.jsonData, stats: parseStatsLines(e.target.value) }
              })
            }
            placeholder={ui.statsField}
          />
          <textarea
            className="field min-h-24"
            value={(homepage?.jsonData?.whyChooseUs || []).join("\n")}
            onChange={(e) =>
              updateContent("homepage_sections", {
                jsonData: {
                  ...homepage?.jsonData,
                  whyChooseUs: e.target.value.split("\n").map((line) => line.trim()).filter(Boolean)
                }
              })
            }
            placeholder={ui.whyChooseUsField}
          />
        </div>
      </ContentSection>

      <ContentSection
        title={ui.aboutTitle}
        description={ui.aboutCopy}
        onSave={() =>
          handleSaveContent("about_page", {
            title: about?.title || "",
            content: about?.content || "",
            isActive: about?.isActive ?? true,
            jsonData: about?.jsonData || {}
          })
        }
        saving={savingKey === "about_page"}
        saveLabel={ui.saveSection}
        savingLabel={ui.saving}
      >
        <div className="grid gap-4">
          <input className="field" value={about?.title || ""} onChange={(e) => updateContent("about_page", { title: e.target.value })} placeholder={ui.aboutHeading} />
          <textarea className="field min-h-28" value={about?.content || ""} onChange={(e) => updateContent("about_page", { content: e.target.value })} placeholder={ui.aboutIntro} />
          <input className="field" value={about?.jsonData?.missionTitle || ""} onChange={(e) => updateContent("about_page", { jsonData: { ...about?.jsonData, missionTitle: e.target.value } })} placeholder={ui.missionTitle} />
          <textarea className="field min-h-24" value={about?.jsonData?.missionBody || ""} onChange={(e) => updateContent("about_page", { jsonData: { ...about?.jsonData, missionBody: e.target.value } })} placeholder={ui.missionBody} />
          <input className="field" value={about?.jsonData?.valuesTitle || ""} onChange={(e) => updateContent("about_page", { jsonData: { ...about?.jsonData, valuesTitle: e.target.value } })} placeholder={ui.valuesTitle} />
          <textarea
            className="field min-h-24"
            value={(about?.jsonData?.values || []).join("\n")}
            onChange={(e) =>
              updateContent("about_page", {
                jsonData: {
                  ...about?.jsonData,
                  values: e.target.value.split("\n").map((line) => line.trim()).filter(Boolean)
                }
              })
            }
            placeholder={ui.valuesField}
          />
          <input className="field" value={about?.jsonData?.teamTitle || ""} onChange={(e) => updateContent("about_page", { jsonData: { ...about?.jsonData, teamTitle: e.target.value } })} placeholder={ui.teamTitle} />
          <textarea className="field min-h-24" value={about?.jsonData?.teamBody || ""} onChange={(e) => updateContent("about_page", { jsonData: { ...about?.jsonData, teamBody: e.target.value } })} placeholder={ui.teamBody} />
        </div>
      </ContentSection>

      <ContentSection
        title={ui.locationTitle}
        description={ui.locationCopy}
        onSave={() =>
          handleSaveContent("location_page", {
            title: location?.title || "",
            content: location?.content || "",
            isActive: location?.isActive ?? true,
            jsonData: location?.jsonData || {}
          })
        }
        saving={savingKey === "location_page"}
        saveLabel={ui.saveSection}
        savingLabel={ui.saving}
      >
        <div className="grid gap-4">
          <input className="field" value={location?.title || ""} onChange={(e) => updateContent("location_page", { title: e.target.value })} placeholder={ui.locationHeading} />
          <textarea className="field min-h-24" value={location?.content || ""} onChange={(e) => updateContent("location_page", { content: e.target.value })} placeholder={ui.locationDescription} />
          <input className="field" value={location?.jsonData?.address || ""} onChange={(e) => updateContent("location_page", { jsonData: { ...location?.jsonData, address: e.target.value } })} placeholder={ui.address} />
          <input className="field" value={location?.jsonData?.phone || ""} onChange={(e) => updateContent("location_page", { jsonData: { ...location?.jsonData, phone: e.target.value } })} placeholder={ui.phone} />
          <input className="field" value={location?.jsonData?.mapEmbedUrl || ""} onChange={(e) => updateContent("location_page", { jsonData: { ...location?.jsonData, mapEmbedUrl: e.target.value } })} placeholder={ui.mapUrl} />
          <textarea className="field min-h-24" value={location?.jsonData?.notes || ""} onChange={(e) => updateContent("location_page", { jsonData: { ...location?.jsonData, notes: e.target.value } })} placeholder={ui.notes} />
          <textarea
            className="field min-h-28"
            value={toHoursLines(location?.jsonData?.hours)}
            onChange={(e) =>
              updateContent("location_page", {
                jsonData: { ...location?.jsonData, hours: parseHoursLines(e.target.value) }
              })
            }
            placeholder={ui.hoursField}
          />
        </div>
      </ContentSection>

      <ContentSection
        title={ui.contactTitle}
        description={ui.contactCopy}
        onSave={() =>
          handleSaveContent("contact_page", {
            title: contact?.title || "",
            content: contact?.content || "",
            isActive: contact?.isActive ?? true,
            jsonData: {
              ...(contact?.jsonData || {}),
              whatsapp: normalizeExternalUrl(String(contact?.jsonData?.whatsapp || "")),
              socialLinks: parseSocialLinkLines(socialLinksDraft)
                .filter((row) => row.label && row.url)
                .map((row) => ({
                  label: row.label,
                  url: normalizeExternalUrl(row.url)
                }))
            }
          })
        }
        saving={savingKey === "contact_page"}
        saveLabel={ui.saveSection}
        savingLabel={ui.saving}
      >
        <div className="grid gap-4">
          <input className="field" value={contact?.title || ""} onChange={(e) => updateContent("contact_page", { title: e.target.value })} placeholder={ui.contactHeading} />
          <textarea className="field min-h-24" value={contact?.content || ""} onChange={(e) => updateContent("contact_page", { content: e.target.value })} placeholder={ui.contactDescription} />
          <input className="field" value={contact?.jsonData?.phone || ""} onChange={(e) => updateContent("contact_page", { jsonData: { ...contact?.jsonData, phone: e.target.value } })} placeholder={ui.phone} />
          <input className="field" value={contact?.jsonData?.email || ""} onChange={(e) => updateContent("contact_page", { jsonData: { ...contact?.jsonData, email: e.target.value } })} placeholder={ui.publicEmail} />
          <input className="field" value={contact?.jsonData?.recipientEmail || ""} onChange={(e) => updateContent("contact_page", { jsonData: { ...contact?.jsonData, recipientEmail: e.target.value } })} placeholder={ui.recipientEmail} />
          <input className="field" value={contact?.jsonData?.whatsapp || ""} onChange={(e) => updateContent("contact_page", { jsonData: { ...contact?.jsonData, whatsapp: e.target.value } })} placeholder={ui.whatsapp} />
          <textarea
            className="field min-h-24"
            value={socialLinksDraft}
            onChange={(e) => {
              const nextValue = e.target.value;
              setSocialLinksDraft(nextValue);
              updateContent("contact_page", {
                jsonData: {
                  ...contact?.jsonData,
                  socialLinks: parseSocialLinkLines(nextValue).map((row) => ({
                    ...row,
                    url: normalizeExternalUrl(row.url)
                  }))
                }
              });
            }}
            placeholder={ui.socials}
          />
          <input className="field" value={contact?.jsonData?.address || ""} onChange={(e) => updateContent("contact_page", { jsonData: { ...contact?.jsonData, address: e.target.value } })} placeholder={ui.address} />
          <textarea
            className="field min-h-28"
            value={toHoursLines(contact?.jsonData?.hours)}
            onChange={(e) =>
              updateContent("contact_page", {
                jsonData: { ...contact?.jsonData, hours: parseHoursLines(e.target.value) }
              })
            }
            placeholder={ui.hoursField}
          />
        </div>
      </ContentSection>
    </div>
  );
}

function ContentSection({
  title,
  description,
  onSave,
  saving,
  saveLabel,
  savingLabel,
  children
}: {
  title: string;
  description: string;
  onSave: () => void;
  saving: boolean;
  saveLabel: string;
  savingLabel: string;
  children: ReactNode;
}) {
  return (
    <section className="panel p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-2xl">{title}</h2>
          <p className="mt-2 text-sm text-slate-500">{description}</p>
        </div>
        <button type="button" className="primary-button" onClick={onSave} disabled={saving}>
          {saving ? savingLabel : saveLabel}
        </button>
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}
