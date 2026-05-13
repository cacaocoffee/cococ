// HTTP 클라이언트.
// 같은 도메인에 호스팅될 때(Vercel)는 BASE를 비워서 상대경로로 /api/* 호출.
// 로컬 dev에서 별도 API 서버를 쓰는 경우 VITE_API_URL 또는 VITE_API_BASE_URL 지정.

// 인증은 서버가 발급하는 HttpOnly 쿠키(cococ_admin_session)로 수행한다.
// 클라이언트는 토큰 값을 보지 못하고, 로그인 여부만 UI 게이트용으로 sessionStorage에 보관한다.
const FLAG_KEY = "cococ_admin_logged_in";
const BASE = (
  (import.meta.env.VITE_API_URL as string | undefined) ??
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  ""
).replace(/\/$/, "");

export const getAdminToken = (): string | null =>
  typeof window === "undefined" ? null : sessionStorage.getItem(FLAG_KEY);

export const setAdminToken = (_token: string): void => {
  // 토큰 자체는 더 이상 클라이언트에 저장되지 않는다(HttpOnly 쿠키로 이동).
  // UI 게이트용 마커만 유지.
  sessionStorage.setItem(FLAG_KEY, "1");
};

export const clearAdminToken = (): void => {
  sessionStorage.removeItem(FLAG_KEY);
};

// ─── Inflight counter (전역 progress bar 용) ──────────────────
let inflightCount = 0;
const inflightListeners = new Set<(n: number) => void>();

const notifyInflight = (): void => {
  for (const fn of inflightListeners) fn(inflightCount);
};

export const beginInflight = (): void => {
  inflightCount += 1;
  notifyInflight();
};

export const endInflight = (): void => {
  inflightCount = Math.max(0, inflightCount - 1);
  notifyInflight();
};

export const subscribeInflight = (fn: (n: number) => void): (() => void) => {
  inflightListeners.add(fn);
  fn(inflightCount);
  return () => {
    inflightListeners.delete(fn);
  };
};

// 401 받으면 토큰만 비우고 admin shell 에 신호만 보낸다.
// (window.location.href 로 강제 리로드하면 SPA 상태가 날아가서
//  사용자 입장에선 "갑자기 새로고침되는" 것처럼 보이므로 이벤트로 처리)
export const ADMIN_UNAUTHORIZED_EVENT = "admin:unauthorized";

const handle401 = (): void => {
  if (typeof window === "undefined") return;
  const hadToken = Boolean(getAdminToken());
  clearAdminToken();
  // 토큰이 원래 없었던 호출(=공개 API, 잘못된 호출)은 무시 — admin 화면에 팝업 띄울 이유 없음.
  if (hadToken) {
    window.dispatchEvent(new Event(ADMIN_UNAUTHORIZED_EVENT));
  }
};

const buildHeaders = (init?: HeadersInit): Headers => new Headers(init);

async function request<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const headers = buildHeaders(init.headers);
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  beginInflight();
  try {
    // credentials: 'include' — HttpOnly 어드민 쿠키를 자동 동봉.
    const res = await fetch(`${BASE}${path}`, { ...init, headers, credentials: "include" });
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
  } finally {
    endInflight();
  }
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
  beginInflight();
  try {
    const res = await fetch(`${BASE}${path}`, {
      method: "POST",
      headers,
      body: fd,
      credentials: "include",
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
  } finally {
    endInflight();
  }
}
