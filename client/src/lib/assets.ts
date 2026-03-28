import { getApiBaseUrl } from "./api-base";

export function resolveAssetUrl(value: string | null | undefined) {
  if (!value) {
    return "";
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  const apiBaseUrl = getApiBaseUrl();

  if (!apiBaseUrl) {
    return value;
  }

  return value.startsWith("/") ? `${apiBaseUrl}${value}` : `${apiBaseUrl}/${value}`;
}
