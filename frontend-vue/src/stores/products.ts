import { defineStore } from 'pinia'
import { ref } from 'vue'
import { productService } from '@/services/api/productService'
import type { ProductDTO, ProductWithComposition } from '@/types/api'

export const useProductsStore = defineStore('products', () => {
  const items = ref<ProductWithComposition[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchProducts() {
    loading.value = true
    error.value = null
    try {
      items.value = await productService.getAll()
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch products'
    } finally {
      loading.value = false
    }
  }

  async function createProduct(product: ProductDTO) {
    const created = await productService.create(product)
    items.value.push(created)
    return created
  }

  async function updateProduct(id: number, product: ProductDTO) {
    const updated = await productService.update(id, product)
    const index = items.value.findIndex((p) => p.id === updated.id)
    if (index !== -1) items.value[index] = updated
    return updated
  }

  async function deleteProduct(id: number) {
    await productService.delete(id)
    items.value = items.value.filter((p) => p.id !== id)
  }

  return { items, loading, error, fetchProducts, createProduct, updateProduct, deleteProduct }
})
