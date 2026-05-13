import { getAuthToken } from "@/lib/server-auth";
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
  let initialData: ExchangeRate[] = [];
  try {
    initialData = await fetchRates();
  } catch {
    // endpoint indisponível — renderiza com lista vazia
  }

  return (
    <CambioView
      initialData={initialData}
      fetchRates={fetchRates}
      triggerCollect={triggerCollect}
    />
  );
}
