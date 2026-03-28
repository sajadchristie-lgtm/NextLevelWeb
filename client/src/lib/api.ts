import { clearAuthToken, getAuthToken } from "./auth";
import type { AdminUser, Car, DashboardData, HomeData, Inquiry, Service, SiteContent } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

type FetchOptions = RequestInit & {
  auth?: boolean;
};

async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);

  if (options.auth) {
    const token = getAuthToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers
  });

  if (response.status === 401 && options.auth) {
    clearAuthToken();
  }

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(payload?.message || "Request failed.");
  }

  return response.json() as Promise<T>;
}

export function getHomeData() {
  return apiFetch<HomeData>("/api/public/home");
}

export function getCars(query: URLSearchParams) {
  return apiFetch<{ cars: Car[]; brands: string[] }>(`/api/public/cars?${query.toString()}`);
}

export function getCar(slug: string) {
  return apiFetch<{ car: Car }>(`/api/public/cars/${slug}`);
}

export function getServices() {
  return apiFetch<{ services: Service[] }>("/api/public/services");
}

export function getContent<T = any>(key: string) {
  return apiFetch<{ content: SiteContent<T> }>(`/api/public/content/${key}`);
}

export function submitInquiry(payload: Record<string, unknown>) {
  return apiFetch<{ message: string; inquiryId: string }>("/api/public/inquiries", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function adminLogin(payload: { email: string; password: string }) {
  return apiFetch<{ token: string; user: AdminUser }>("/api/admin/auth/login", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function startAdminAccess(payload: { code: string }) {
  return apiFetch<{ unlocked: boolean }>("/api/admin/access/start", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function checkAdminAccess() {
  return apiFetch<{ unlocked: boolean }>("/api/admin/access/check");
}

export function clearAdminAccess() {
  return apiFetch<{ unlocked: boolean }>("/api/admin/access/logout", {
    method: "POST"
  });
}

export function getAdminDashboard() {
  return apiFetch<DashboardData>("/api/admin/dashboard", { auth: true });
}

export function getAdminCars() {
  return apiFetch<{ cars: Car[] }>("/api/admin/cars", { auth: true });
}

export function getAdminCar(id: string) {
  return apiFetch<{ car: Car }>(`/api/admin/cars/${id}`, { auth: true });
}

export function deleteAdminCar(id: string) {
  return apiFetch<{ message: string }>(`/api/admin/cars/${id}`, {
    method: "DELETE",
    auth: true
  });
}

export function saveAdminCar(method: "POST" | "PUT", payload: FormData, id?: string) {
  return apiFetch<{ car: Car }>(id ? `/api/admin/cars/${id}` : "/api/admin/cars", {
    method,
    body: payload,
    auth: true
  });
}

export function getAdminServices() {
  return apiFetch<{ services: Service[] }>("/api/admin/services", { auth: true });
}

export function saveAdminServices(payload: { services: Partial<Service>[]; removedIds: string[] }) {
  return apiFetch<{ services: Service[] }>("/api/admin/services", {
    method: "PUT",
    body: JSON.stringify(payload),
    auth: true
  });
}

export function getAdminContent() {
  return apiFetch<{ content: SiteContent[] }>("/api/admin/content", { auth: true });
}

export function saveAdminContent(key: string, payload: Record<string, unknown>) {
  return apiFetch<{ content: SiteContent }>(`/api/admin/content/${key}`, {
    method: "PUT",
    body: JSON.stringify(payload),
    auth: true
  });
}

export function getAdminInquiries() {
  return apiFetch<{ inquiries: Inquiry[] }>("/api/admin/inquiries", { auth: true });
}
