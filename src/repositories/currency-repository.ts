import { apiFetchJson } from "@/lib/api-client";
import type { Currency } from "@/types";

export async function listCurrencies(
  token: string,
  params?: { code?: string; code_op?: string; name?: string; name_op?: string; active_only?: boolean },
): Promise<Currency[]> {
  const qs = new URLSearchParams();
  if (params?.code) qs.set("code", params.code);
  if (params?.code_op) qs.set("code_op", params.code_op);
  if (params?.name) qs.set("name", params.name);
  if (params?.name_op) qs.set("name_op", params.name_op);
  if (params?.active_only) qs.set("active_only", "true");

  return apiFetchJson<Currency[]>(`/v1/currencies?${qs}`, {}, token);
}

export async function createCurrency(
  token: string,
  payload: { code: string; name: string; symbol: string; is_base?: boolean },
): Promise<Currency> {
  return apiFetchJson<Currency>(`/v1/currencies`, { method: "POST", body: JSON.stringify(payload) }, token);
}
