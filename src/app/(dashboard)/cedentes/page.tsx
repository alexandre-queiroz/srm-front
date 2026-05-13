import { getAuthToken } from "@/lib/server-auth";
import { safeCall } from "@/lib/safe-call";
import { listCompanies } from "@/repositories/company-repository";
import type { Company } from "@/types";
import { CedentesView } from "./_view";

async function fetchCompanies(query?: string): Promise<Company[]> {
  "use server";
  const token = await getAuthToken();
  return listCompanies(token, { query, limit: 100 });
}

export default async function CedentesPage() {
  const initialData = await safeCall(() => fetchCompanies(), [] as Company[]);

  return (
    <CedentesView
      initialData={initialData}
      fetchCompanies={fetchCompanies}
    />
  );
}
