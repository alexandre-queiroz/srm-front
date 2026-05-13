import { apiFetchJson } from "@/lib/api-client";

export interface SettlementReportItem {
  settled_at: string;
  assignor_name: string;
  receivable_id: string;
  invoice_key: string;
  face_value_brl: string;
  present_value_brl: string;
  currency_code: string;
  rate: string;
  spread_daily: string;
}

export interface SettlementSummary {
  total_count: number;
  total_face_value_brl: string;
  total_present_value_brl: string;
  average_spread: string;
}

export interface SettlementReportResponse {
  items: SettlementReportItem[];
  summary: SettlementSummary;
  page: number;
  page_size: number;
}

export async function getSettlementReport(
  token: string,
  params?: {
    start_date?: string;
    end_date?: string;
    assignor_id?: string;
    currency_code?: string;
    page?: number;
    page_size?: number;
  },
): Promise<SettlementReportResponse> {
  const qs = new URLSearchParams();
  if (params?.start_date) qs.set("start_date", params.start_date);
  if (params?.end_date) qs.set("end_date", params.end_date);
  if (params?.assignor_id) qs.set("assignor_id", params.assignor_id);
  if (params?.currency_code) qs.set("currency_code", params.currency_code);
  if (params?.page) qs.set("page", String(params.page));
  if (params?.page_size) qs.set("page_size", String(params.page_size));

  return apiFetchJson<SettlementReportResponse>(`/v1/reports/settlements?${qs}`, {}, token);
}
