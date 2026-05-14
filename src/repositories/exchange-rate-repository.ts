import { apiFetchJson } from "@/lib/api-client";
import type { ExchangeRate } from "@/types";

export async function listExchangeRates(token: string): Promise<ExchangeRate[]> {
  return apiFetchJson<ExchangeRate[]>(`/v1/exchange-rates`, {}, token);
}

export async function getCurrentRate(token: string): Promise<ExchangeRate> {
  return apiFetchJson<ExchangeRate>(`/v1/exchange-rates/latest`, {}, token);
}

export async function triggerCollectExchangeRate(token: string): Promise<ExchangeRate> {
  return apiFetchJson<ExchangeRate>(`/v1/exchange-rates/collect`, { method: "POST" }, token);
}
