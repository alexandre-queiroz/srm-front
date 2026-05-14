import * as companyRepo from "@/repositories/company-repository";
import type { Company } from "@/types";

export async function getCompanies(token: string, params?: { query?: string; limit?: number }): Promise<Company[]> {
  return companyRepo.listCompanies(token, params);
}

export async function createCompany(token: string, payload: { cnpj: string; name: string }): Promise<Company> {
  return companyRepo.createCompany(token, payload);
}
