export interface Company {
  id: string;
  cnpj: string;
  social_reason: string;
  fantasy_name: string | null;
  created_at: string;
  available_receivables_count: number;
}

export interface Currency {
  id: string;
  code: string;
  name: string;
  symbol: string;
  is_base: boolean;
  is_active: boolean;
  created_at: string;
}

export interface ProductType {
  id: string;
  name: string;
  spread: string;
  is_active: boolean;
  updated_at: string;
}

export interface ExchangeRate {
  id: string;
  from_currency: string;
  to_currency: string;
  rate: string;
  source: string;
  is_stale: boolean;
  collected_at: string;
}

export interface BatchPreviewItem {
  receivable_id: string;
  invoice_key: string;
  installment_number: string;
  drawee: Company;
  face_value: string;
  currency_code: string;
  term_days: number;
  present_value: string;
  base_rate_annual: string;
  spread_annual: string;
}

export interface Batch {
  id: string;
  assignor: Company;
  status: "pending" | "queued" | "approved" | "rejected";
  version: number;
  rejection_reasons: Record<string, unknown> | null;
  total_receivables: number;
  total_face_value_brl: string;
  total_present_value_brl: string;
  created_at: string;
  updated_at: string;
}

export interface BatchDetail extends Batch {
  items: BatchPreviewItem[];
}

export interface BatchPreview {
  batch_id: string;
  assignor: Company;
  total_receivables: number;
  total_face_value: string;
  total_present_value: string;
  items: BatchPreviewItem[];
}

export interface Receivable {
  id: string;
  assignor: Company;
  drawee: Company;
  product_type: ProductType;
  invoice_key: string;
  invoice_number: string;
  series: string;
  issued_at: string;
  installment_number: string;
  products_value: string;
  discount_value: string;
  freight_value: string;
  other_value: string;
  face_value: string;
  currency_code: string;
  due_date: string;
  status: string;
  created_at: string;
}

export interface ReceivableUploadItem {
  invoice_key: string;
  installment_number: string;
  success: boolean;
  error: string | null;
  receivable_id: string | null;
}

export interface ReceivableUploadResult {
  upload_id: string;
  total: number;
  imported: number;
  skipped: number;
  items: ReceivableUploadItem[];
}

export interface SystemParam {
  key: string;
  value: string;
  description: string | null;
}

export interface CursorPage<T> {
  items: T[];
  next_cursor: string | null;
}

export interface Page<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}

export interface ApiError {
  detail: string;
}

export interface DashboardKpis {
  total_anticipated_brl: string;
  total_available_receivables: number;
  average_rate_pct: string;
  total_approved_batches: number;
}

export interface DailyVolume {
  date: string;
  volume_brl: string;
}

export interface TopAssignor {
  assignor_name: string;
  total_anticipated_brl: string;
  total_batches: number;
}

export interface RecentBatch {
  id: string;
  assignor_name: string;
  status: string;
  total_face_value_brl: string;
  total_present_value_brl: string;
  created_at: string;
}

export interface DashboardData {
  kpis: DashboardKpis;
  daily_volume: DailyVolume[];
  top_assignors: TopAssignor[];
  recent_batches: RecentBatch[];
}

export interface SettlementTransactionItem {
  transaction_id: string;
  invoice_key: string;
  installment_number: string;
  drawee_name: string;
  drawee_cnpj: string;
  instrument_currency: string;
  face_value: string;
  face_value_brl: string;
  present_value: string;
  exchange_rate_used: string | null;
  term_days: number;
  spread_used: string;
  base_rate_used: string;
  liquidated_at: string;
}

export interface SettlementBatchItem {
  batch_id: string;
  assignor_name: string;
  assignor_cnpj: string;
  processed_at: string;
  total_receivables: number;
  total_face_brl: string;
  total_present_brl: string;
  total_discount_brl: string;
  avg_rate_pct: string;
  transactions: SettlementTransactionItem[];
}

export interface SettlementBatchSummary {
  total_batches: number;
  total_receivables: number;
  total_face_brl: string;
  total_present_brl: string;
  total_discount_brl: string;
  avg_rate_pct: string;
}

export interface SettlementBatchReport {
  items: SettlementBatchItem[];
  summary: SettlementBatchSummary;
  page: number;
  page_size: number;
  total_pages: number;
  total_batches: number;
}
