import { apiClient } from "./config";
import type { ProductDTO } from "@/types/api";

export const productService = {
  async getAll(): Promise<ProductDTO[]> {
    return apiClient.get<ProductDTO[]>("/products");
  },

  async getById(id: number): Promise<ProductDTO> {
    return apiClient.get<ProductDTO>(`/products/${id}`);
  },

  async create(product: Omit<ProductDTO, "id">): Promise<ProductDTO> {
    return apiClient.post<ProductDTO>("/products", product);
  },

  async update(id: number, product: Omit<ProductDTO, "id">): Promise<ProductDTO> {
    return apiClient.put<ProductDTO>(`/products/${id}`, product);
  },

  async delete(id: number): Promise<void> {
    return apiClient.delete<void>(`/products/${id}`);
  },
};
