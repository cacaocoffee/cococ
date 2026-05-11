// HTTP 클라이언트.
// 같은 도메인에 호스팅될 때(Vercel)는 BASE를 비워서 상대경로로 /api/* 호출.
// 로컬 dev에서 별도 API 서버를 쓰는 경우 VITE_API_URL 또는 VITE_API_BASE_URL 지정.

const TOKEN_KEY = "cococ_admin_token";
const BASE = (
  (import.meta.env.VITE_API_URL as string | undefined) ??
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  ""
).replace(/\/$/, "");

export const getAdminToken = (): string | null =>
  typeof window === "undefined" ? null : sessionStorage.getItem(TOKEN_KEY);

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

async function request<T>(
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

export const apiFetch = request;

export const apiGet = <T>(path: string): Promise<T> =>
  request<T>(path, { method: "GET" });

export const apiPost = <T>(path: string, body?: unknown): Promise<T> =>
  request<T>(path, {
    method: "POST",
    body: body === undefined ? undefined : JSON.stringify(body),
  });

export const apiPut = <T>(path: string, body?: unknown): Promise<T> =>
  request<T>(path, {
    method: "PUT",
    body: body === undefined ? undefined : JSON.stringify(body),
  });

export const apiPatch = <T>(path: string, body?: unknown): Promise<T> =>
  request<T>(path, {
    method: "PATCH",
    body: body === undefined ? undefined : JSON.stringify(body),
  });

export const apiDelete = <T = void>(path: string): Promise<T> =>
  request<T>(path, { method: "DELETE" });

export async function apiUploadFile(
  pathOrFile: string | File,
  maybeFile?: File,
): Promise<{ url: string } | string> {
  // 호환: apiUploadFile(file) 또는 apiUploadFile(path, file) 둘 다 허용
  const path = typeof pathOrFile === "string" ? pathOrFile : "/api/upload";
  const file = typeof pathOrFile === "string" ? maybeFile! : pathOrFile;

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
  const data = (await res.json()) as { url: string };
  // 기존 upload.ts는 URL 문자열을 기대 → 단일 인자 호출일 때 URL만 반환
  return typeof pathOrFile === "string" ? data : data.url;
}
