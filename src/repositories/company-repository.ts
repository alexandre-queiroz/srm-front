import { apiFetchJson } from "@/lib/api-client";
import type { Company } from "@/types";

export async function listCompanies(
  token: string,
  params?: { social_reason?: string; social_reason_op?: string; cnpj?: string; cnpj_op?: string; limit?: number },
): Promise<Company[]> {
  const qs = new URLSearchParams();
  if (params?.social_reason) qs.set("social_reason", params.social_reason);
  if (params?.social_reason_op) qs.set("social_reason_op", params.social_reason_op);
  if (params?.cnpj) qs.set("cnpj", params.cnpj);
  if (params?.cnpj_op) qs.set("cnpj_op", params.cnpj_op);
  if (params?.limit) qs.set("limit", String(params.limit));

  return apiFetchJson<Company[]>(`/v1/companies?${qs}`, {}, token);
}

export async function createCompany(token: string, payload: { cnpj: string; name: string }): Promise<Company> {
  return apiFetchJson<Company>(`/v1/companies`, { method: "POST", body: JSON.stringify(payload) }, token);
}
