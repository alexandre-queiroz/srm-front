import { getAuthToken } from "@/lib/server-auth";
import { safeCall } from "@/lib/safe-call";
import { listCurrencies, createCurrency } from "@/repositories/currency-repository";
import type { Currency } from "@/types";
import { MoedasView } from "./_view";

async function fetchCurrencies(params?: { code?: string; code_op?: string; name?: string; name_op?: string }): Promise<Currency[]> {
  "use server";
  const token = await getAuthToken();
  return listCurrencies(token, params);
}

async function addCurrency(payload: { code: string; name: string; symbol: string; is_base: boolean }): Promise<Currency> {
  "use server";
  const token = await getAuthToken();
  return createCurrency(token, payload);
}

export default async function MoedasPage() {
  const initialData = await safeCall(() => fetchCurrencies(), [] as Currency[]);

  return <MoedasView initialData={initialData} fetchCurrencies={fetchCurrencies} addCurrency={addCurrency} />;
}
