import { defineStore } from 'pinia'
import { ref } from 'vue'
import { rawMaterialService } from '@/services/api/rawMaterialService'
import type { RawMaterialDTO } from '@/types/api'

export const useRawMaterialsStore = defineStore('rawMaterials', () => {
  const items = ref<RawMaterialDTO[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchRawMaterials() {
    loading.value = true
    error.value = null
    try {
      items.value = await rawMaterialService.getAll()
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch raw materials'
    } finally {
      loading.value = false
    }
  }

  async function createRawMaterial(material: RawMaterialDTO) {
    const created = await rawMaterialService.create(material)
    items.value.push(created)
    return created
  }

  async function updateRawMaterial(id: number, material: RawMaterialDTO) {
    const updated = await rawMaterialService.update(id, material)
    const index = items.value.findIndex((m) => m.id === updated.id)
    if (index !== -1) items.value[index] = updated
    return updated
  }

  async function deleteRawMaterial(id: number) {
    await rawMaterialService.delete(id)
    items.value = items.value.filter((m) => m.id !== id)
  }

  return {
    items,
    loading,
    error,
    fetchRawMaterials,
    createRawMaterial,
    updateRawMaterial,
    deleteRawMaterial,
  }
})
