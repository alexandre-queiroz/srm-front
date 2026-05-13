import { getAuthToken } from "@/lib/server-auth";
import { listBatches, getBatch, createBatch, previewBatch, queueBatch } from "@/repositories/batch-repository";
import { listReceivables } from "@/repositories/receivable-repository";
import { listCompanies } from "@/repositories/company-repository";
import type { Batch, BatchDetail, Receivable, Company, BatchPreview } from "@/types";
import { LotesView } from "./_view";

async function fetchBatches(page: number, pageSize: number): Promise<Batch[]> {
  "use server";
  const token = await getAuthToken();
  return listBatches(token, { page, page_size: pageSize });
}

async function fetchCompanies(query?: string): Promise<Company[]> {
  "use server";
  const token = await getAuthToken();
  return listCompanies(token, { query, limit: 50 });
}

async function fetchReceivablesByAssignor(assignorId: string, page: number, pageSize: number): Promise<Receivable[]> {
  "use server";
  const token = await getAuthToken();
  return listReceivables(token, { assignor_id: assignorId, page, page_size: pageSize });
}

async function createBatchAndPreview(
  assignorId: string,
  receivableIds: string[],
): Promise<{ batch: Batch; preview: BatchPreview }> {
  "use server";
  const token = await getAuthToken();
  const batch = await createBatch(token, { assignor_id: assignorId, receivable_ids: receivableIds });
  const preview = await previewBatch(token, batch.id);
  return { batch, preview };
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
  const [initialData, companies] = await Promise.all([
    fetchBatches(1, 20),
    fetchCompanies(),
  ]);

  return (
    <LotesView
      initialData={initialData}
      companies={companies}
      fetchBatches={fetchBatches}
      fetchBatchDetail={fetchBatchDetail}
      fetchCompanies={fetchCompanies}
      fetchReceivablesByAssignor={fetchReceivablesByAssignor}
      createBatchAndPreview={createBatchAndPreview}
      queueBatchAction={queueBatchAction}
    />
  );
}
