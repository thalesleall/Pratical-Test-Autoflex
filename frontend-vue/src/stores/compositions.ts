import { defineStore } from 'pinia'
import { ref } from 'vue'
import { productCompositionService } from '@/services/api/productCompositionService'
import type { CompositionDTO } from '@/types/api'

export const useCompositionsStore = defineStore('compositions', () => {
  const currentProductId = ref<number | null>(null)
  const compositions = ref<CompositionDTO[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchCompositions(productId: number) {
    loading.value = true
    error.value = null
    try {
      compositions.value = await productCompositionService.getByProduct(productId)
      currentProductId.value = productId
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch compositions'
    } finally {
      loading.value = false
    }
  }

  async function addComposition(productId: number, composition: CompositionDTO) {
    await productCompositionService.addRawMaterial(productId, composition)
    compositions.value = await productCompositionService.getByProduct(productId)
  }

  async function updateComposition(
    productId: number,
    rawMaterialId: number,
    composition: CompositionDTO,
  ) {
    await productCompositionService.updateRawMaterialQuantity(productId, rawMaterialId, composition)
    compositions.value = await productCompositionService.getByProduct(productId)
  }

  async function deleteComposition(productId: number, rawMaterialId: number) {
    await productCompositionService.removeRawMaterial(productId, rawMaterialId)
    compositions.value = compositions.value.filter((c) => c.rawMaterialId !== rawMaterialId)
  }

  function clearCompositions() {
    currentProductId.value = null
    compositions.value = []
  }

  return {
    currentProductId,
    compositions,
    loading,
    error,
    fetchCompositions,
    addComposition,
    updateComposition,
    deleteComposition,
    clearCompositions,
  }
})
