import { apiFetchJson } from "@/lib/api-client";
import type { Batch, BatchDetail, BatchPreview, CursorPage } from "@/types";

export async function listBatches(
  token: string,
  params?: { assignor_id?: string; page?: number; page_size?: number },
): Promise<Batch[]> {
  const qs = new URLSearchParams();
  if (params?.assignor_id) qs.set("assignor_id", params.assignor_id);
  if (params?.page) qs.set("page", String(params.page));
  if (params?.page_size) qs.set("page_size", String(params.page_size));

  return apiFetchJson<Batch[]>(`/v1/batches?${qs}`, {}, token);
}

export async function listBatchesCursor(
  token: string,
  params?: { assignor_id?: string; after?: string; page_size?: number },
): Promise<CursorPage<Batch>> {
  const qs = new URLSearchParams();
  if (params?.assignor_id) qs.set("assignor_id", params.assignor_id);
  if (params?.after) qs.set("after", params.after);
  if (params?.page_size) qs.set("page_size", String(params.page_size));

  return apiFetchJson<CursorPage<Batch>>(`/v1/batches/cursor?${qs}`, {}, token);
}

export async function getBatch(token: string, batchId: string): Promise<BatchDetail> {
  return apiFetchJson<BatchDetail>(`/v1/batches/${batchId}`, {}, token);
}

export async function previewBatch(token: string, batchId: string): Promise<BatchPreview> {
  return apiFetchJson<BatchPreview>(`/v1/batches/${batchId}/preview`, {}, token);
}

export async function createBatch(
  token: string,
  payload: { assignor_id: string; receivable_ids: string[] },
): Promise<Batch> {
  return apiFetchJson<Batch>(`/v1/batches`, { method: "POST", body: JSON.stringify(payload) }, token);
}

export async function confirmBatch(
  token: string,
  batchId: string,
  expectedVersion: number,
): Promise<Batch> {
  return apiFetchJson<Batch>(
    `/v1/batches/${batchId}/confirm`,
    { method: "POST", body: JSON.stringify({ expected_version: expectedVersion }) },
    token,
  );
}

export async function queueBatch(
  token: string,
  batchId: string,
  expectedVersion: number,
): Promise<Batch> {
  return apiFetchJson<Batch>(
    `/v1/batches/${batchId}/queue`,
    { method: "POST", body: JSON.stringify({ expected_version: expectedVersion }) },
    token,
  );
}
