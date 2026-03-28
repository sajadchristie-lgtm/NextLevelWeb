function normalizeAdminBasePath(value: string | undefined) {
  const trimmed = (value || "/portal-bilvard-private").trim();
  const withLeadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  const normalized = withLeadingSlash.replace(/\/+$/g, "");
  return normalized || "/portal-bilvard-private";
}

export const ADMIN_BASE_PATH = normalizeAdminBasePath(import.meta.env.VITE_ADMIN_BASE_PATH);
export const ADMIN_ROUTE_PATH = ADMIN_BASE_PATH.slice(1);

export function buildAdminPath(path = "") {
  if (!path || path === "/") {
    return ADMIN_BASE_PATH;
  }

  return `${ADMIN_BASE_PATH}${path.startsWith("/") ? path : `/${path}`}`;
}
