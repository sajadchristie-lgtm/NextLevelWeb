import { useEffect, useState } from "react";
import { getAdminAccount, updateAdminAccount } from "../lib/api";
import { setAuthToken } from "../lib/auth";
import { useLanguage } from "../lib/i18n";

export function AdminAccountPage() {
  const [email, setEmail] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { language } = useLanguage();

  const ui =
    language === "sv"
      ? {
          title: "Konto",
          copy: "Uppdatera din admininloggning. Ange ditt nuvarande lösenord för att bekräfta ändringar.",
          emailSection: "E-post",
          passwordSection: "Lösenord",
          confirmSection: "Bekräfta",
          emailLabel: "E-postadress",
          newPasswordLabel: "Nytt lösenord",
          newPasswordHint: "Minst 8 tecken. Lämna tomt för att behålla nuvarande lösenord.",
          confirmPasswordLabel: "Upprepa nytt lösenord",
          currentPasswordLabel: "Nuvarande lösenord",
          save: "Spara ändringar",
          saving: "Sparar...",
          saved: "Kontot uppdaterades.",
          mismatch: "De nya lösenorden matchar inte.",
          passwordTooShort: "Det nya lösenordet måste vara minst 8 tecken.",
          nothingChanged: "Inget att spara.",
          loadError: "Kunde inte ladda kontot.",
          saveError: "Kunde inte spara kontot."
        }
      : {
          title: "Account",
          copy: "Update your admin sign-in. Enter your current password to confirm any changes.",
          emailSection: "Email",
          passwordSection: "Password",
          confirmSection: "Confirm",
          emailLabel: "Email address",
          newPasswordLabel: "New password",
          newPasswordHint: "At least 8 characters. Leave blank to keep your current password.",
          confirmPasswordLabel: "Repeat new password",
          currentPasswordLabel: "Current password",
          save: "Save changes",
          saving: "Saving...",
          saved: "Account updated.",
          mismatch: "The new passwords do not match.",
          passwordTooShort: "New password must be at least 8 characters.",
          nothingChanged: "Nothing to save.",
          loadError: "Could not load the account.",
          saveError: "Could not save the account."
        };

  useEffect(() => {
    let cancelled = false;
    getAdminAccount()
      .then((payload) => {
        if (cancelled) return;
        setEmail(payload.user.email);
        setOriginalEmail(payload.user.email);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message || ui.loadError);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const emailChanged = email.trim() !== originalEmail.trim() && email.trim() !== "";
    const wantsNewPassword = newPassword.length > 0;

    if (!emailChanged && !wantsNewPassword) {
      setError(ui.nothingChanged);
      return;
    }

    if (wantsNewPassword) {
      if (newPassword.length < 8) {
        setError(ui.passwordTooShort);
        return;
      }
      if (newPassword !== confirmPassword) {
        setError(ui.mismatch);
        return;
      }
    }

    setSaving(true);
    try {
      const payload: { email?: string; currentPassword: string; newPassword?: string } = {
        currentPassword
      };
      if (emailChanged) payload.email = email.trim();
      if (wantsNewPassword) payload.newPassword = newPassword;

      const result = await updateAdminAccount(payload);
      if (result.token) {
        setAuthToken(result.token);
      }
      setOriginalEmail(result.user.email);
      setEmail(result.user.email);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccess(ui.saved);
    } catch (err) {
      setError(err instanceof Error ? err.message : ui.saveError);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="text-sm text-slate">{ui.saving === "Saving..." ? "Loading..." : "Laddar..."}</div>;
  }

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <h1 className="h-section">{ui.title}</h1>
        <p className="lead">{ui.copy}</p>
      </header>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <section className="card space-y-4">
          <p className="text-xs font-semibold uppercase tracking-editorial text-slate">
            {ui.emailSection}
          </p>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-onyx">{ui.emailLabel}</span>
            <input
              type="email"
              className="field"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </label>
        </section>

        <section className="card space-y-4">
          <p className="text-xs font-semibold uppercase tracking-editorial text-slate">
            {ui.passwordSection}
          </p>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-onyx">{ui.newPasswordLabel}</span>
            <input
              type="password"
              className="field"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              autoComplete="new-password"
              minLength={newPassword ? 8 : undefined}
            />
            <span className="mt-2 block text-xs text-slate">{ui.newPasswordHint}</span>
          </label>
          {newPassword ? (
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-onyx">
                {ui.confirmPasswordLabel}
              </span>
              <input
                type="password"
                className="field"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                autoComplete="new-password"
                minLength={8}
                required
              />
            </label>
          ) : null}
        </section>

        <section className="card space-y-4">
          <p className="text-xs font-semibold uppercase tracking-editorial text-slate">
            {ui.confirmSection}
          </p>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-onyx">
              {ui.currentPasswordLabel}
            </span>
            <input
              type="password"
              className="field"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
        </section>

        <div className="flex flex-wrap items-center gap-4">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? ui.saving : ui.save}
          </button>
          {success ? <span className="text-sm text-forest">{success}</span> : null}
          {error ? <span className="text-sm text-bronze">{error}</span> : null}
        </div>
      </form>
    </div>
  );
}
