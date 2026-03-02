<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useProductsStore } from '@/stores/products'
import AppCard from '@/components/AppCard.vue'
import AppButton from '@/components/AppButton.vue'
import AppInput from '@/components/AppInput.vue'
import AppModal from '@/components/AppModal.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import type { ProductDTO } from '@/types/api'

const store = useProductsStore()
const isModalOpen = ref(false)
const editingProduct = ref<ProductDTO | null>(null)
const formName = ref('')
const formValue = ref('0')

onMounted(() => {
  store.fetchProducts()
})

function openCreateModal() {
  editingProduct.value = null
  formName.value = ''
  formValue.value = '0'
  isModalOpen.value = true
}

function handleEdit(product: ProductDTO) {
  editingProduct.value = product
  formName.value = product.name
  formValue.value = String(product.value)
  isModalOpen.value = true
}

async function handleSubmit() {
  const data = { name: formName.value, value: parseFloat(formValue.value) }
  if (editingProduct.value?.id) {
    await store.updateProduct(editingProduct.value.id, data)
  } else {
    await store.createProduct(data)
  }
  isModalOpen.value = false
  formName.value = ''
  formValue.value = '0'
  editingProduct.value = null
}

async function handleDelete(id: number) {
  if (confirm('Are you sure you want to delete this product?')) {
    await store.deleteProduct(id)
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
      <div
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4 animate-in fade-in slide-in-from-top duration-500"
      >
        <div>
          <h1
            class="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-900 to-blue-950 bg-clip-text text-transparent mb-2"
          >
            Products
          </h1>
          <p class="text-gray-600 text-sm sm:text-base">Manage your product catalog</p>
        </div>
        <AppButton @click="openCreateModal" size="lg" class="w-full sm:w-auto"
          >+ New Product</AppButton
        >
      </div>

      <LoadingSpinner v-if="store.loading" />

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <AppCard
          v-for="(product, idx) in store.items"
          :key="product.id"
          class="animate-in fade-in slide-in-from-bottom duration-500"
          :style="{ animationDelay: `${idx * 50}ms` }"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <h3 class="text-lg sm:text-xl font-bold text-gray-900 mb-1 truncate">
                {{ product.name }}
              </h3>
              <div class="flex items-center gap-2">
                <span class="text-2xl sm:text-3xl text-blue-900 font-bold"
                  >${{ (product.value ?? 0).toFixed(2) }}</span
                >
              </div>
            </div>
            <div
              class="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-900 to-blue-950 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform flex-shrink-0"
            >
              <svg
                class="w-6 h-6 sm:w-7 sm:h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
          </div>
          <div class="flex gap-2">
            <AppButton variant="secondary" @click="handleEdit(product)" class="flex-1 text-sm"
              >Edit</AppButton
            >
            <AppButton variant="danger" @click="handleDelete(product.id!)" class="flex-1 text-sm"
              >Delete</AppButton
            >
          </div>
        </AppCard>
      </div>

      <AppCard v-if="!store.loading && store.items.length === 0" class="text-center py-12">
        <p class="text-gray-500 text-lg mb-4">
          No products yet. Click "New Product" to create one.
        </p>
        <AppButton @click="openCreateModal">Create First Product</AppButton>
      </AppCard>
    </div>
  </div>

  <AppModal
    :isOpen="isModalOpen"
    :title="editingProduct ? 'Edit Product' : 'New Product'"
    @close="isModalOpen = false"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <AppInput label="Product Name" v-model="formName" placeholder="Enter product name" required />
      <AppInput
        label="Value"
        type="number"
        step="0.01"
        v-model="formValue"
        placeholder="0.00"
        required
      />
      <div class="flex gap-2 pt-4">
        <AppButton type="submit" class="flex-1">{{
          editingProduct ? 'Update' : 'Create'
        }}</AppButton>
        <AppButton type="button" variant="secondary" @click="isModalOpen = false" class="flex-1"
          >Cancel</AppButton
        >
      </div>
    </form>
  </AppModal>
</template>
