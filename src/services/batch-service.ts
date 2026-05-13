import * as batchRepo from "@/repositories/batch-repository";
import type { Batch, BatchDetail, BatchPreview, CursorPage } from "@/types";

export async function getBatches(
  token: string,
  params?: { assignor_id?: string; page?: number; page_size?: number },
): Promise<Batch[]> {
  return batchRepo.listBatches(token, params);
}

export async function getBatchesCursor(
  token: string,
  params?: { assignor_id?: string; after?: string; page_size?: number },
): Promise<CursorPage<Batch>> {
  return batchRepo.listBatchesCursor(token, params);
}

export async function getBatchDetail(token: string, batchId: string): Promise<BatchDetail> {
  return batchRepo.getBatch(token, batchId);
}

export async function getBatchPreview(token: string, batchId: string): Promise<BatchPreview> {
  return batchRepo.previewBatch(token, batchId);
}

export async function submitBatch(
  token: string,
  payload: { assignor_id: string; receivable_ids: string[] },
): Promise<Batch> {
  return batchRepo.createBatch(token, payload);
}

export async function confirmBatch(
  token: string,
  batchId: string,
  expectedVersion: number,
): Promise<Batch> {
  return batchRepo.confirmBatch(token, batchId, expectedVersion);
}

export async function queueBatch(
  token: string,
  batchId: string,
  expectedVersion: number,
): Promise<Batch> {
  return batchRepo.queueBatch(token, batchId, expectedVersion);
}
