const API_BASE_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/g, "");

export function resolveAssetUrl(value: string | null | undefined) {
  if (!value) {
    return "";
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  if (!API_BASE_URL) {
    return value;
  }

  return value.startsWith("/") ? `${API_BASE_URL}${value}` : `${API_BASE_URL}/${value}`;
}
