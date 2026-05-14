import * as productTypeRepo from "@/repositories/product-type-repository";
import type { ProductType, SystemParam } from "@/types";

export async function getProductTypes(token: string): Promise<ProductType[]> {
  return productTypeRepo.listProductTypes(token);
}

export async function updateSpread(token: string, productTypeId: string, spread: string): Promise<ProductType> {
  return productTypeRepo.updateProductTypeSpread(token, productTypeId, spread);
}

export async function getSystemParams(token: string): Promise<SystemParam[]> {
  return productTypeRepo.listSystemParams(token);
}

export async function updateSystemParam(token: string, key: string, value: string): Promise<SystemParam> {
  return productTypeRepo.updateSystemParam(token, key, value);
}
