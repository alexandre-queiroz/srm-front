import { getAuthToken } from "@/lib/server-auth";
import { listProductTypes } from "@/repositories/product-type-repository";
import type { ProductType } from "@/types";
import { ProdutosView } from "./_view";

async function fetchProductTypes(): Promise<ProductType[]> {
  "use server";
  const token = await getAuthToken();
  return listProductTypes(token);
}

export default async function ProdutosPage() {
  let initialData: ProductType[] = [];
  try {
    initialData = await fetchProductTypes();
  } catch {
    // endpoint indisponível — renderiza com lista vazia
  }

  return (
    <ProdutosView
      initialData={initialData}
      fetchProductTypes={fetchProductTypes}
    />
  );
}
