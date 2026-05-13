/**
 * Utility for managing cookies with best practices.
 */

export const COOKIE_NAMES = {
  AUTH_TOKEN: "srm_token",
} as const;

interface CookieOptions {
  expires?: number | Date; // in seconds if number
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: "Lax" | "Strict" | "None";
}

export function setCookie(name: string, value: string, options: CookieOptions = {}) {
  const {
    expires,
    path = "/",
    domain,
    secure = true,
    sameSite = "Lax",
  } = options;

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (expires) {
    if (typeof expires === "number") {
      const date = new Date();
      date.setTime(date.getTime() + expires * 1000);
      cookieString += `; expires=${date.toUTCString()}`;
    } else {
      cookieString += `; expires=${expires.toUTCString()}`;
    }
  }

  if (path) cookieString += `; path=${path}`;
  if (domain) cookieString += `; domain=${domain}`;
  if (secure) cookieString += "; secure";
  if (sameSite) cookieString += `; SameSite=${sameSite}`;

  document.cookie = cookieString;
}

export function getCookie(name: string): string | null {
  const nameEQ = `${encodeURIComponent(name)}=`;
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
  }
  return null;
}

export function deleteCookie(name: string, path: string = "/", domain?: string) {
  setCookie(name, "", { expires: -1, path, domain });
}
