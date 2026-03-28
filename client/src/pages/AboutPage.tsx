import { useEffect, useState } from "react";
import { getContent } from "../lib/api";
import type { SiteContent } from "../types";
import { localizeContent, useLanguage } from "../lib/i18n";

type AboutJson = {
  missionTitle?: string;
  missionBody?: string;
  valuesTitle?: string;
  values?: string[];
  teamTitle?: string;
  teamBody?: string;
};

export function AboutPage() {
  const [content, setContent] = useState<SiteContent<AboutJson> | null>(null);
  const [error, setError] = useState("");
  const { language, t } = useLanguage();

  useEffect(() => {
    getContent<AboutJson>("about_page")
      .then((payload) => setContent(payload.content))
      .catch((err: Error) => setError(err.message));
  }, []);

  const localized = localizeContent("about_page", content, language) as SiteContent<AboutJson> | null;

  return (
    <div className="container-shell space-y-8 py-10">
      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="panel p-6 sm:p-8">
          <span className="eyebrow">{t("about.eyebrow")}</span>
          <h1 className="section-title mt-4">{localized?.title || "About Bilv\u00e5rd center i K\u00e4vlinge"}</h1>
          <p className="muted-copy mt-5">{localized?.content}</p>
        </div>

        <div className="panel bg-ink p-6 text-white sm:p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-white/60">
            {localized?.jsonData?.missionTitle || "Our mission"}
          </p>
          <p className="mt-4 text-lg leading-8 text-white/80">{localized?.jsonData?.missionBody}</p>
        </div>
      </div>

      {error ? <div className="text-center text-ember">{error}</div> : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="panel p-6 sm:p-8">
          <h2 className="font-display text-3xl">{localized?.jsonData?.valuesTitle || t("about.valuesFallback")}</h2>
          <div className="mt-6 grid gap-4">
            {(localized?.jsonData?.values || []).map((value: string) => (
              <div key={value} className="rounded-[24px] bg-sand p-5 text-sm leading-7 text-slate-700">
                {value}
              </div>
            ))}
          </div>
        </div>

        <div className="panel p-6 sm:p-8">
          <h2 className="font-display text-3xl">{localized?.jsonData?.teamTitle || "Built on trust"}</h2>
          <p className="muted-copy mt-4">{localized?.jsonData?.teamBody}</p>
          <div className="mt-8 rounded-[28px] bg-[linear-gradient(135deg,#f6e1cb_0%,#f8f5ef_60%,#e3e9f0_100%)] p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{t("about.presentation")}</p>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              {t("about.presentationCopy")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
