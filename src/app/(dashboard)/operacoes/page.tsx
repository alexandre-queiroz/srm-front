import { getAuthToken } from "@/lib/server-auth";
import { safeCall } from "@/lib/safe-call";
import { listReceivables, uploadReceivableXml } from "@/repositories/receivable-repository";
import { listProductTypes } from "@/repositories/product-type-repository";
import { listCurrencies } from "@/repositories/currency-repository";
import type { Receivable, ProductType, ReceivableUploadResult, Currency } from "@/types";
import { OperacoesView } from "./_view";

async function fetchReceivables(params: {
  page: number;
  pageSize: number;
  status?: string;
  invoice_key?: string;
  invoice_key_op?: string;
  assignor_id?: string;
}): Promise<Receivable[]> {
  "use server";
  const token = await getAuthToken();
  return listReceivables(token, {
    page: params.page,
    page_size: params.pageSize,
    status: params.status,
    invoice_key: params.invoice_key,
    invoice_key_op: params.invoice_key_op,
    assignor_id: params.assignor_id
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

export default async function OperacoesPage() {
  const [initialData, productTypes, currencies] = await Promise.all([
    safeCall(() => fetchReceivables({ page: 1, pageSize: 20 }), [] as Receivable[]),
    safeCall(() => fetchProductTypes(), [] as ProductType[]),
    safeCall(() => fetchCurrencies(), [] as Currency[]),
  ]);

  return (
    <OperacoesView
      initialData={initialData}
      productTypes={productTypes}
      currencies={currencies}
      fetchReceivables={fetchReceivables}
      uploadXml={uploadXml}
    />
  );
}
