import { getAuthToken } from "@/lib/server-auth";
import { safeCall } from "@/lib/safe-call";
import { listProductTypes } from "@/repositories/product-type-repository";
import type { ProductType } from "@/types";
import { ProdutosView } from "./_view";

async function fetchProductTypes(): Promise<ProductType[]> {
  "use server";
  const token = await getAuthToken();
  return listProductTypes(token);
}

export default async function ProdutosPage() {
  const initialData = await safeCall(() => fetchProductTypes(), [] as ProductType[]);

  return <ProdutosView initialData={initialData} fetchProductTypes={fetchProductTypes} />;
}
