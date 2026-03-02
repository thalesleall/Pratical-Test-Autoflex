import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import { productionPlanningService } from '@/services/api/productionPlanningService'
import type { ProductionSuggestion } from '@/types/api'

export const useProductionStore = defineStore('production', () => {
  const suggestions = ref<ProductionSuggestion[]>([])
  const selectedProducts = reactive<Record<string, number>>({})
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchProductionSuggestions() {
    loading.value = true
    error.value = null
    try {
      suggestions.value = await productionPlanningService.getSuggestion()
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch production suggestions'
    } finally {
      loading.value = false
    }
  }

  function setProductQuantity(productName: string, quantity: number) {
    if (quantity > 0) {
      selectedProducts[productName] = quantity
    } else {
      delete selectedProducts[productName]
    }
  }

  function clearSelection() {
    Object.keys(selectedProducts).forEach((key) => {
      delete selectedProducts[Number(key)]
    })
  }

  return {
    suggestions,
    selectedProducts,
    loading,
    error,
    fetchProductionSuggestions,
    setProductQuantity,
    clearSelection,
  }
})
