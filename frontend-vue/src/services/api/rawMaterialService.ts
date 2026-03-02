import { apiClient } from './config'
import type { RawMaterialDTO } from '@/types/api'

export const rawMaterialService = {
  async getAll(): Promise<RawMaterialDTO[]> {
    return apiClient.get<RawMaterialDTO[]>('/raw-materials')
  },
  async getById(id: number): Promise<RawMaterialDTO> {
    return apiClient.get<RawMaterialDTO>(`/raw-materials/${id}`)
  },
  async create(rawMaterial: Omit<RawMaterialDTO, 'id'>): Promise<RawMaterialDTO> {
    return apiClient.post<RawMaterialDTO>('/raw-materials', rawMaterial)
  },
  async update(id: number, rawMaterial: Omit<RawMaterialDTO, 'id'>): Promise<RawMaterialDTO> {
    return apiClient.put<RawMaterialDTO>(`/raw-materials/${id}`, rawMaterial)
  },
  async delete(id: number): Promise<void> {
    return apiClient.delete<void>(`/raw-materials/${id}`)
  },
}
