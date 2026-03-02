import { apiClient } from './config'
import type { CompositionDTO } from '@/types/api'

export const productCompositionService = {
  async getByProduct(productId: number): Promise<CompositionDTO[]> {
    return apiClient.get<CompositionDTO[]>(`/products/${productId}/raw-materials`)
  },
  async addRawMaterial(productId: number, composition: CompositionDTO): Promise<void> {
    return apiClient.post<void>(`/products/${productId}/raw-materials`, composition)
  },
  async updateRawMaterialQuantity(
    productId: number,
    rawMaterialId: number,
    composition: CompositionDTO,
  ): Promise<CompositionDTO> {
    return apiClient.put<CompositionDTO>(
      `/products/${productId}/raw-materials/${rawMaterialId}`,
      composition,
    )
  },
  async removeRawMaterial(productId: number, rawMaterialId: number): Promise<void> {
    return apiClient.delete<void>(`/products/${productId}/raw-materials/${rawMaterialId}`)
  },
}
