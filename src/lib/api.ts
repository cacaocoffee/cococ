const TOKEN_KEY = "cococ_admin_token";
const BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

export const getAdminToken = (): string | null =>
  sessionStorage.getItem(TOKEN_KEY);

export const setAdminToken = (token: string): void => {
  sessionStorage.setItem(TOKEN_KEY, token);
};

export const clearAdminToken = (): void => {
  sessionStorage.removeItem(TOKEN_KEY);
};

const handle401 = (): void => {
  clearAdminToken();
  if (typeof window !== "undefined" && window.location.pathname !== "/admin") {
    window.location.href = "/admin";
  }
};

const buildHeaders = (init?: HeadersInit): Headers => {
  const headers = new Headers(init);
  const token = getAdminToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return headers;
};

export async function apiFetch<T = unknown>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const headers = buildHeaders(init.headers);
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const res = await fetch(`${BASE}${path}`, { ...init, headers });
  if (res.status === 401) {
    handle401();
    throw new Error("Unauthorized");
  }
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export async function apiUploadFile(
  path: string,
  file: File,
): Promise<{ url: string }> {
  const headers = buildHeaders();
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers,
    body: fd,
  });
  if (res.status === 401) {
    handle401();
    throw new Error("Unauthorized");
  }
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }
  return (await res.json()) as { url: string };
}
