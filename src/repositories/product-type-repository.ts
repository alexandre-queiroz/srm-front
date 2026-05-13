import { apiFetchJson } from "@/lib/api-client";
import type { ProductType, SystemParam } from "@/types";

export async function listProductTypes(token: string): Promise<ProductType[]> {
  return apiFetchJson<ProductType[]>(`/v1/product-types`, {}, token);
}

export async function updateProductTypeSpread(
  token: string,
  productTypeId: string,
  spread: string,
): Promise<ProductType> {
  return apiFetchJson<ProductType>(
    `/v1/product-types/${productTypeId}`,
    { method: "PATCH", body: JSON.stringify({ spread }) },
    token,
  );
}

export async function listSystemParams(token: string): Promise<SystemParam[]> {
  return apiFetchJson<SystemParam[]>(`/v1/product-types/params`, {}, token);
}

export async function updateSystemParam(
  token: string,
  key: string,
  value: string,
): Promise<SystemParam> {
  return apiFetchJson<SystemParam>(
    `/v1/product-types/params/${key}`,
    { method: "PATCH", body: JSON.stringify({ value }) },
    token,
  );
}
