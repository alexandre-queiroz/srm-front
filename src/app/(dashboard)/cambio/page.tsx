import { getAuthToken } from "@/lib/server-auth";
import { safeCall } from "@/lib/safe-call";
import { listExchangeRates, triggerCollectExchangeRate } from "@/repositories/exchange-rate-repository";
import type { ExchangeRate } from "@/types";
import { CambioView } from "./_view";

async function fetchRates(): Promise<ExchangeRate[]> {
  "use server";
  const token = await getAuthToken();
  return listExchangeRates(token);
}

async function triggerCollect(): Promise<ExchangeRate> {
  "use server";
  const token = await getAuthToken();
  return triggerCollectExchangeRate(token);
}

export default async function CambioPage() {
  const initialData = await safeCall(() => fetchRates(), [] as ExchangeRate[]);

  return (
    <CambioView
      initialData={initialData}
      fetchRates={fetchRates}
      triggerCollect={triggerCollect}
    />
  );
}
