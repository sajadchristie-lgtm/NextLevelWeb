import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { startAdminAccess, checkAdminAccess } from "../lib/api";
import { buildAdminPath } from "../lib/admin";
import { getAuthToken } from "../lib/auth";
import { useLanguage } from "../lib/i18n";

export function AdminAccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const { language, setLanguage } = useLanguage();
  const ui =
    language === "sv"
      ? {
          languageLabel: "Sprak",
          eyebrow: "Privat admin",
          title: "Privat atkomst",
          copy: "Ange din privata atkomstkod for att lasa upp admininloggningen.",
          placeholder: "Atkomstkod",
          submit: "Lasa upp admin",
          submitting: "Laser upp...",
          fallbackError: "Kunde inte verifiera atkomsten."
        }
      : {
          languageLabel: "Language",
          eyebrow: "Private admin",
          title: "Private access",
          copy: "Enter your private access code to unlock the admin login.",
          placeholder: "Access code",
          submit: "Unlock admin",
          submitting: "Unlocking...",
          fallbackError: "Could not verify access."
        };

  useEffect(() => {
    let active = true;

    checkAdminAccess()
      .then((payload) => {
        if (!active) {
          return;
        }

        if (payload.unlocked) {
          const from = (location.state as { from?: string } | null)?.from;
          navigate(getAuthToken() ? from || buildAdminPath("/") : buildAdminPath("/login"), { replace: true });
          return;
        }

        setChecking(false);
      })
      .catch(() => {
        if (active) {
          setChecking(false);
        }
      });

    return () => {
      active = false;
    };
  }, [location.state, navigate]);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");

    try {
      await startAdminAccess({ code: String(formData.get("code") || "") });
      const from = (location.state as { from?: string } | null)?.from;
      navigate(getAuthToken() ? from || buildAdminPath("/") : buildAdminPath("/login"), { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : ui.fallbackError);
    } finally {
      setLoading(false);
    }
  }

  if (checking) {
    return <div className="container-shell py-10 text-sm text-slate-500">Checking admin access...</div>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#fcfbf8_0%,#f1eadf_55%,#e7ecf2_100%)] px-4 py-10">
      <div className="panel w-full max-w-md p-6 sm:p-8">
        <div className="mb-6 flex justify-end">
          <div className="rounded-[22px] border border-[#d8b36a] bg-[linear-gradient(135deg,#fff3cf_0%,#ffe3b2_52%,#fff8ec_100%)] p-3 shadow-[0_16px_36px_rgba(111,78,17,0.14)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/70">{ui.languageLabel}</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                className={`rounded-[16px] border px-3 py-2 text-sm font-semibold transition ${
                  language === "en"
                    ? "border-ink bg-ink text-white shadow-[0_10px_24px_rgba(24,28,34,0.2)]"
                    : "border-white/80 bg-white/90 text-ink hover:bg-white"
                }`}
                onClick={() => setLanguage("en")}
              >
                EN
              </button>
              <button
                type="button"
                className={`rounded-[16px] border px-3 py-2 text-sm font-semibold transition ${
                  language === "sv"
                    ? "border-ink bg-ink text-white shadow-[0_10px_24px_rgba(24,28,34,0.2)]"
                    : "border-white/80 bg-white/90 text-ink hover:bg-white"
                }`}
                onClick={() => setLanguage("sv")}
              >
                SV
              </button>
            </div>
          </div>
        </div>
        <img src="/logo.png" alt={"Bilv\u00e5rd center i K\u00e4vlinge logo"} className="h-16 w-16 rounded-3xl object-cover" />
        <span className="eyebrow">{ui.eyebrow}</span>
        <h1 className="mt-4 font-display text-4xl">{ui.title}</h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">{ui.copy}</p>

        <form
          className="mt-8 grid gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            handleSubmit(new FormData(event.currentTarget));
          }}
        >
          <input name="code" type="password" className="field" placeholder={ui.placeholder} required />
          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? ui.submitting : ui.submit}
          </button>
          {error ? <p className="text-sm text-ember">{error}</p> : null}
        </form>
      </div>
    </div>
  );
}
