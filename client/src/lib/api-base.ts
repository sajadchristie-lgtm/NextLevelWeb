function normalizeBaseUrl(value: string | undefined) {
  return (value || "").replace(/\/+$/g, "");
}

function shouldUseNetlifyProxy() {
  if (!import.meta.env.PROD || typeof window === "undefined") {
    return false;
  }

  return window.location.hostname.endsWith(".netlify.app");
}

export function getApiBaseUrl() {
  if (shouldUseNetlifyProxy()) {
    return "";
  }

  return normalizeBaseUrl(import.meta.env.VITE_API_URL);
}

export function resolveApiUrl(path: string) {
  const baseUrl = getApiBaseUrl();
  return `${baseUrl}${path}`;
}

