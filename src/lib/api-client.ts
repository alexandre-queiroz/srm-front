export const PROXY_PATH = "/api-srv";

export function resolveApiUrl(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const isServer = typeof window === "undefined";

  if (isServer) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://srm-back-psi.vercel.app/api";
    return `${baseUrl}${cleanPath}`;
  }

  return `${PROXY_PATH}${cleanPath}`;
}

export class ApiResponseError extends Error {
  constructor(
    public readonly status: number,
    public readonly detail: string,
  ) {
    super(detail);
    this.name = "ApiResponseError";
  }
}

export async function apiFetch(
  path: string,
  options: RequestInit = {},
  token?: string,
): Promise<Response> {
  const url = resolveApiUrl(path);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return fetch(url, { ...options, headers });
}

export async function apiFetchJson<T>(
  path: string,
  options: RequestInit = {},
  token?: string,
): Promise<T> {
  const res = await apiFetch(path, options, token);

  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: res.statusText }));
    throw new ApiResponseError(res.status, body.detail ?? res.statusText);
  }

  return res.json() as Promise<T>;
}
