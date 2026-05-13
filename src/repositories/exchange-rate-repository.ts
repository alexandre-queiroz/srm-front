import { apiFetchJson } from "@/lib/api-client";
import type { ExchangeRate } from "@/types";

export async function listExchangeRates(token: string): Promise<ExchangeRate[]> {
  return apiFetchJson<ExchangeRate[]>(`/v1/exchange-rates`, {}, token);
}
