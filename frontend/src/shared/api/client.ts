import { ApiError } from "./errors";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api/v1";
let refreshPromise: Promise<string | null> | null = null;

function accessToken() {
  return typeof window === "undefined" ? null : sessionStorage.getItem("access_token");
}

function clearSession() {
  sessionStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = localStorage.getItem("refresh_token");
  if (!refreshToken) return null;
  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
  if (!response.ok) {
    clearSession();
    return null;
  }
  const tokens = (await response.json()) as { access_token: string; refresh_token: string };
  sessionStorage.setItem("access_token", tokens.access_token);
  localStorage.setItem("refresh_token", tokens.refresh_token);
  return tokens.access_token;
}

async function getRefreshedToken() {
  refreshPromise ??= refreshAccessToken().finally(() => { refreshPromise = null; });
  return refreshPromise;
}

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
  allowRefresh = true,
): Promise<T> {
  const headers = new Headers(init.headers);
  if (!(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const token = accessToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let response = await fetch(`${API_URL}${path}`, { ...init, headers });
  if (response.status === 401 && allowRefresh && path !== "/auth/refresh") {
    const refreshed = await getRefreshedToken();
    if (refreshed) {
      headers.set("Authorization", `Bearer ${refreshed}`);
      response = await fetch(`${API_URL}${path}`, { ...init, headers });
    } else if (typeof window !== "undefined") {
      window.location.assign("/login");
    }
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({ detail: "Có lỗi xảy ra" }));
    throw new ApiError(
      response.status,
      typeof body.detail === "string" ? body.detail : "Có lỗi xảy ra",
      response.headers.get("X-Request-ID") ?? undefined,
    );
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export async function logout() {
  const refreshToken = localStorage.getItem("refresh_token");
  try {
    if (refreshToken) {
      await apiRequest<void>("/auth/logout", {
        method: "POST",
        body: JSON.stringify({ refresh_token: refreshToken }),
      }, false);
    }
  } finally {
    clearSession();
  }
}
