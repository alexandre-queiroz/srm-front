"use server";

import { cookies } from "next/headers";
import { COOKIE_NAMES } from "@/lib/cookies";
import { apiFetchJson, ApiResponseError } from "@/lib/api-client";

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  expires_in: number;
}

export async function loginAction(
  credentials: LoginPayload,
): Promise<{ success: true } | { error: string }> {
  try {
    const data = await apiFetchJson<LoginResponse>("/v1/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAMES.AUTH_TOKEN, data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: data.expires_in,
      path: "/",
    });

    try {
      const me = await apiFetchJson<{ id: string; name: string; email: string }>(
        "/v1/auth/me",
        {},
        data.access_token,
      );
      cookieStore.set(COOKIE_NAMES.USER_INFO, JSON.stringify({ name: me.name, id: me.id }), {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: data.expires_in,
        path: "/",
      });
    } catch {
      // non-critical — layout falls back to "SRM"
    }

    return { success: true };
  } catch (err) {
    if (err instanceof ApiResponseError) {
      if (err.detail === "Invalid credentials") return { error: "E-mail ou senha incorretos." };
      if (err.detail === "Inactive user") return { error: "Usuário inativo. Entre em contato com o suporte." };
      return { error: err.detail };
    }
    return { error: "Erro interno ao processar login." };
  }
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAMES.AUTH_TOKEN);
  cookieStore.delete(COOKIE_NAMES.USER_INFO);
}
