import { getAuthToken } from "@/lib/server-auth";
import { safeCall } from "@/lib/safe-call";
import { getSettlementReport, type SettlementReportResponse } from "@/repositories/report-repository";
import { RelatoriosView } from "./_view";

async function fetchReport(params?: any): Promise<SettlementReportResponse> {
  "use server";
  const token = await getAuthToken();
  return getSettlementReport(token, params);
}

export default async function RelatoriosPage() {
  const initialData = await safeCall(() => fetchReport({ page: 1, page_size: 20 }), null);

  return (
    <RelatoriosView
      initialData={initialData}
      fetchReport={fetchReport}
    />
  );
}
