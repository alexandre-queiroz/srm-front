import { apiFetchJson } from "@/lib/api-client";
import type { Company } from "@/types";

export async function listCompanies(
  token: string,
  params?: { query?: string; limit?: number },
): Promise<Company[]> {
  const qs = new URLSearchParams();
  if (params?.query) qs.set("query", params.query);
  if (params?.limit) qs.set("limit", String(params.limit));

  return apiFetchJson<Company[]>(`/v1/companies?${qs}`, {}, token);
}

export async function createCompany(
  token: string,
  payload: { cnpj: string; name: string },
): Promise<Company> {
  return apiFetchJson<Company>(
    `/v1/companies`,
    { method: "POST", body: JSON.stringify(payload) },
    token,
  );
}
