import { getAuthToken } from "@/lib/server-auth";
import { safeCall } from "@/lib/safe-call";
import { listReceivables, uploadReceivableXml } from "@/repositories/receivable-repository";
import { listProductTypes } from "@/repositories/product-type-repository";
import { listCurrencies } from "@/repositories/currency-repository";
import type { Receivable, ProductType, ReceivableUploadResult, Currency, Page } from "@/types";
import { OperacoesView } from "./_view";

async function fetchReceivables(params: {
  page: number;
  pageSize: number;
  status?: string;
  invoice_key?: string;
  invoice_key_op?: string;
  assignor_id?: string;
}): Promise<Page<Receivable>> {
  "use server";
  const token = await getAuthToken();
  return listReceivables(token, {
    page: params.page,
    page_size: params.pageSize,
    status: params.status,
    invoice_key: params.invoice_key,
    invoice_key_op: params.invoice_key_op,
    assignor_id: params.assignor_id,
  });
}

async function fetchProductTypes(): Promise<ProductType[]> {
  "use server";
  const token = await getAuthToken();
  return listProductTypes(token);
}

async function fetchCurrencies(): Promise<Currency[]> {
  "use server";
  const token = await getAuthToken();
  return listCurrencies(token, { active_only: true });
}

async function uploadXml(formData: FormData): Promise<ReceivableUploadResult> {
  "use server";
  const token = await getAuthToken();
  const file = formData.get("file") as File;
  const product_type_id = formData.get("product_type_id") as string | null;
  const currency_code = (formData.get("currency_code") as string) || "BRL";
  return uploadReceivableXml(token, file, {
    product_type_id: product_type_id || undefined,
    currency_code,
  });
}

const normalize = (r: Page<Receivable> | Receivable[]): Page<Receivable> =>
  Array.isArray(r) ? { items: r, total: r.length, page: 1, page_size: 20, pages: 1 } : r;

export default async function OperacoesPage() {
  const emptyPage: Page<Receivable> = { items: [], total: 0, page: 1, page_size: 20, pages: 0 };
  const [rawData, productTypes, currencies] = await Promise.all([
    safeCall(() => fetchReceivables({ page: 1, pageSize: 20 }), emptyPage),
    safeCall(() => fetchProductTypes(), [] as ProductType[]),
    safeCall(() => fetchCurrencies(), [] as Currency[]),
  ]);

  const initialData = normalize(rawData as any);

  return (
    <OperacoesView
      initialData={initialData.items}
      initialTotal={initialData.total}
      productTypes={productTypes}
      currencies={currencies}
      fetchReceivables={fetchReceivables}
      uploadXml={uploadXml}
    />
  );
}
