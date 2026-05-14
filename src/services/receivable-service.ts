import * as receivableRepo from "@/repositories/receivable-repository";
import type { CursorPage, Page, Receivable, ReceivableUploadResult } from "@/types";

export async function getReceivables(
  token: string,
  params?: { assignor_id?: string; page?: number; page_size?: number },
): Promise<Page<Receivable>> {
  return receivableRepo.listReceivables(token, params);
}

export async function getReceivablesCursor(
  token: string,
  params?: { assignor_id?: string; after?: string; page_size?: number },
): Promise<CursorPage<Receivable>> {
  return receivableRepo.listReceivablesCursor(token, params);
}

export async function uploadXml(
  token: string,
  file: File,
  params?: { product_type_id?: string; currency_code?: string },
): Promise<ReceivableUploadResult> {
  return receivableRepo.uploadReceivableXml(token, file, params);
}
