import * as exchangeRateRepo from "@/repositories/exchange-rate-repository";
import type { ExchangeRate } from "@/types";

export async function getExchangeRates(token: string): Promise<ExchangeRate[]> {
  return exchangeRateRepo.listExchangeRates(token);
}
