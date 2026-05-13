import { cookies } from "next/headers";
import { COOKIE_NAMES } from "./cookies";

export async function getAuthToken(): Promise<string> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAMES.AUTH_TOKEN)?.value;
  if (!token) throw new Error("Não autenticado.");
  return token;
}
