import { getAuthToken } from "@/lib/server-auth";
import { getSettlementReport, type SettlementReportResponse } from "@/repositories/report-repository";
import { RelatoriosView } from "./_view";

async function fetchReport(params?: any): Promise<SettlementReportResponse> {
  "use server";
  const token = await getAuthToken();
  return getSettlementReport(token, params);
}

export default async function RelatoriosPage() {
  let initialData: SettlementReportResponse | null = null;
  try {
    initialData = await fetchReport({ page: 1, page_size: 20 });
  } catch {
    // endpoint indisponível — renderiza sem dados iniciais
  }

  return (
    <RelatoriosView
      initialData={initialData}
      fetchReport={fetchReport}
    />
  );
}
