import { getAuthToken } from "@/lib/server-auth";
import { safeCall } from "@/lib/safe-call";
import { listBatches, getBatch, createBatch, previewBatch, queueBatch, simulateBatch } from "@/repositories/batch-repository";
import { listReceivables } from "@/repositories/receivable-repository";
import { listCompanies } from "@/repositories/company-repository";
import type { Batch, BatchDetail, Receivable, Company, BatchPreview } from "@/types";
import { LotesView } from "./_view";

async function fetchBatches(params: { 
  page: number; 
  pageSize: number; 
  status?: string; 
  assignor_id?: string;
}): Promise<Batch[]> {
  "use server";
  const token = await getAuthToken();
  return listBatches(token, { 
    page: params.page, 
    page_size: params.pageSize,
    status: params.status,
    assignor_id: params.assignor_id
  });
}

async function fetchCompanies(social_reason?: string): Promise<Company[]> {
  "use server";
  const token = await getAuthToken();
  return listCompanies(token, { social_reason, limit: 50 });
}

async function fetchReceivableCount(assignorId: string): Promise<number> {
  "use server";
  const token = await getAuthToken();
  const result = await listReceivables(token, { assignor_id: assignorId, status: "available", page: 1, page_size: 1 });
  return result.total;
}

async function fetchReceivablesByAssignor(assignorId: string, page: number, pageSize: number): Promise<Receivable[]> {
  "use server";
  const token = await getAuthToken();
  const result = await listReceivables(token, { assignor_id: assignorId, page, page_size: pageSize });
  return result.items;
}

async function simulateBatchAction(
  assignorId: string,
  receivableIds: string[],
): Promise<BatchPreview> {
  "use server";
  const token = await getAuthToken();
  return simulateBatch(token, { assignor_id: assignorId, receivable_ids: receivableIds });
}

async function createAndQueueBatchAction(
  assignorId: string,
  receivableIds: string[],
): Promise<Batch> {
  "use server";
  const token = await getAuthToken();
  const batch = await createBatch(token, { assignor_id: assignorId, receivable_ids: receivableIds });
  return queueBatch(token, batch.id, batch.version);
}

async function fetchBatchDetail(batchId: string): Promise<BatchDetail> {
  "use server";
  const token = await getAuthToken();
  return getBatch(token, batchId);
}

async function queueBatchAction(batchId: string, expectedVersion: number): Promise<Batch> {
  "use server";
  const token = await getAuthToken();
  return queueBatch(token, batchId, expectedVersion);
}

export default async function LotesPage() {
  const initialData = await safeCall(() => fetchBatches({ page: 1, pageSize: 20 }), [] as Batch[]);

  return (
    <LotesView
      initialData={initialData}
      fetchBatches={fetchBatches}
      fetchBatchDetail={fetchBatchDetail}
      fetchCompanies={fetchCompanies}
      fetchReceivablesByAssignor={fetchReceivablesByAssignor}
      fetchReceivableCount={fetchReceivableCount}
      simulateBatch={simulateBatchAction}
      createAndQueueBatch={createAndQueueBatchAction}
      queueBatchAction={queueBatchAction}
    />
  );
}

