import { getAuthToken } from "@/lib/server-auth";
import { safeCall } from "@/lib/safe-call";
import { getSettlementBatchReport } from "@/repositories/report-repository";
import type { SettlementBatchReport } from "@/types";
import { RelatoriosView } from "./_view";

const EMPTY_FALLBACK: SettlementBatchReport = {
  items: [],
  summary: {
    total_batches: 0,
    total_receivables: 0,
    total_face_brl: "0",
    total_present_brl: "0",
    total_discount_brl: "0",
    avg_rate_pct: "0",
  },
  page: 1,
  page_size: 20,
  total_pages: 0,
  total_batches: 0,
};

async function fetchReport(params?: Parameters<typeof getSettlementBatchReport>[1]): Promise<SettlementBatchReport> {
  "use server";
  const token = await getAuthToken();
  return getSettlementBatchReport(token, params);
}

export default async function RelatoriosPage() {
  const initialData = await safeCall(
    () => fetchReport({ page: 1, page_size: 20 }),
    EMPTY_FALLBACK,
  );

  return (
    <RelatoriosView
      initialData={initialData}
      fetchReport={fetchReport}
    />
  );
}
