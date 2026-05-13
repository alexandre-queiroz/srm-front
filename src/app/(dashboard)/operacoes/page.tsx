import { getAuthToken } from "@/lib/server-auth";
import { listReceivables, uploadReceivableXml } from "@/repositories/receivable-repository";
import { listProductTypes } from "@/repositories/product-type-repository";
import type { Receivable, ProductType, ReceivableUploadResult } from "@/types";
import { OperacoesView } from "./_view";

async function fetchReceivables(page: number, pageSize: number): Promise<Receivable[]> {
  "use server";
  const token = await getAuthToken();
  return listReceivables(token, { page, page_size: pageSize });
}

async function fetchProductTypes(): Promise<ProductType[]> {
  "use server";
  const token = await getAuthToken();
  return listProductTypes(token);
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
  const [initialData, productTypes] = await Promise.all([
    fetchReceivables(1, 20),
    fetchProductTypes(),
  ]);

  return (
    <OperacoesView
      initialData={initialData}
      productTypes={productTypes}
      fetchReceivables={fetchReceivables}
      uploadXml={uploadXml}
    />
  );
}
