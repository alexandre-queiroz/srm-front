import { apiFetch, apiFetchJson } from "@/lib/api-client";
import type { CursorPage, Receivable, ReceivableUploadResult } from "@/types";

export async function listReceivables(
  token: string,
  params?: { assignor_id?: string; page?: number; page_size?: number },
): Promise<Receivable[]> {
  const qs = new URLSearchParams();
  if (params?.assignor_id) qs.set("assignor_id", params.assignor_id);
  if (params?.page) qs.set("page", String(params.page));
  if (params?.page_size) qs.set("page_size", String(params.page_size));

  return apiFetchJson<Receivable[]>(`/v1/receivables?${qs}`, {}, token);
}

export async function listReceivablesCursor(
  token: string,
  params?: { assignor_id?: string; after?: string; page_size?: number },
): Promise<CursorPage<Receivable>> {
  const qs = new URLSearchParams();
  if (params?.assignor_id) qs.set("assignor_id", params.assignor_id);
  if (params?.after) qs.set("after", params.after);
  if (params?.page_size) qs.set("page_size", String(params.page_size));

  return apiFetchJson<CursorPage<Receivable>>(`/v1/receivables/cursor?${qs}`, {}, token);
}

export async function uploadReceivableXml(
  token: string,
  file: File,
  params?: { product_type_id?: string; currency_code?: string },
): Promise<ReceivableUploadResult> {
  const qs = new URLSearchParams();
  if (params?.product_type_id) qs.set("product_type_id", params.product_type_id);
  if (params?.currency_code) qs.set("currency_code", params.currency_code);

  const formData = new FormData();
  formData.append("file", file);

  const res = await apiFetch(
    `/v1/receivables/upload?${qs}`,
    { method: "POST", body: formData, headers: { Authorization: `Bearer ${token}` } },
  );

  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(body.detail ?? res.statusText);
  }

  return res.json() as Promise<ReceivableUploadResult>;
}
