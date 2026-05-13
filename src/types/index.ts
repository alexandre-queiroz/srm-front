export interface Company {
  id: string;
  cnpj: string;
  name: string;
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

export interface ApiError {
  detail: string;
}
