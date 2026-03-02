<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useProductsStore } from '@/stores/products'
import { useRawMaterialsStore } from '@/stores/rawMaterials'
import { useCompositionsStore } from '@/stores/compositions'
import AppCard from '@/components/AppCard.vue'
import AppButton from '@/components/AppButton.vue'
import AppInput from '@/components/AppInput.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const productsStore = useProductsStore()
const materialsStore = useRawMaterialsStore()
const compositionsStore = useCompositionsStore()

const selectedProductId = ref<number | null>(null)
const selectedMaterialId = ref(0)
const quantity = ref('1')

onMounted(() => {
  productsStore.fetchProducts()
  materialsStore.fetchRawMaterials()
})

const selectedProductName = computed(() => {
  return productsStore.items.find((p) => p.id === selectedProductId.value)?.name || ''
})

function handleProductChange(productId: number) {
  selectedProductId.value = productId
  compositionsStore.fetchCompositions(productId)
}

async function handleAddComposition() {
  if (selectedProductId.value && selectedMaterialId.value) {
    await compositionsStore.addComposition(selectedProductId.value, {
      rawMaterialId: selectedMaterialId.value,
      quantity: parseInt(quantity.value),
    })
    selectedMaterialId.value = 0
    quantity.value = '1'
  }
}

async function handleDelete(rawMaterialId: number) {
  if (selectedProductId.value && confirm('Remove this material from the composition?')) {
    await compositionsStore.deleteComposition(selectedProductId.value, rawMaterialId)
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
      <div class="mb-8 animate-in fade-in slide-in-from-top duration-500">
        <h1
          class="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-900 to-blue-950 bg-clip-text text-transparent mb-2"
        >
          Product Recipes
        </h1>
        <p class="text-gray-600 text-sm sm:text-base">
          Define which materials are needed for each product
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <AppCard class="lg:col-span-1 animate-in fade-in slide-in-from-left duration-500">
          <h2 class="text-lg sm:text-xl font-bold text-gray-900 mb-4">Select Product</h2>
          <div class="space-y-2">
            <button
              v-for="(product, idx) in productsStore.items"
              :key="product.id"
              @click="handleProductChange(product.id!)"
              :class="[
                'w-full text-left p-3 sm:p-4 rounded-xl transition-all duration-200 animate-in fade-in slide-in-from-left',
                selectedProductId === product.id
                  ? 'bg-gradient-to-r from-blue-900 to-blue-950 text-white shadow-xl scale-105'
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-900 hover:scale-102 border border-gray-200',
              ]"
              :style="{ animationDelay: `${idx * 50}ms` }"
            >
              <div class="font-semibold text-sm sm:text-base">{{ product.name }}</div>
              <div
                :class="[
                  'text-xs sm:text-sm mt-1',
                  selectedProductId === product.id ? 'opacity-90' : 'opacity-60',
                ]"
              >
                ${{ (product.value ?? 0).toFixed(2) }}
              </div>
            </button>
            <p v-if="productsStore.items.length === 0" class="text-gray-500 text-center py-8">
              No products available
            </p>
          </div>
        </AppCard>

        <AppCard class="lg:col-span-2 animate-in fade-in slide-in-from-right duration-500">
          <template v-if="selectedProductId">
            <h2 class="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
              Recipe for {{ selectedProductName }}
            </h2>

            <form
              @submit.prevent="handleAddComposition"
              class="mb-6 p-4 sm:p-5 bg-gradient-to-br from-blue-50 to-slate-50 rounded-xl border border-blue-200"
            >
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div class="sm:col-span-2">
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Material</label>
                  <select
                    v-model.number="selectedMaterialId"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900 outline-none bg-white hover:border-gray-400 transition-all"
                    required
                  >
                    <option :value="0">Select a material</option>
                    <option
                      v-for="material in materialsStore.items"
                      :key="material.id"
                      :value="material.id"
                    >
                      {{ material.name }} ({{ material.quantity }} available)
                    </option>
                  </select>
                </div>
                <AppInput label="Quantity" type="number" min="1" v-model="quantity" required />
              </div>
              <AppButton type="submit" variant="success" class="mt-4 w-full"
                >+ Add Material</AppButton
              >
            </form>

            <LoadingSpinner v-if="compositionsStore.loading" />

            <div v-else class="space-y-3">
              <div
                v-for="(comp, idx) in compositionsStore.compositions"
                :key="comp.rawMaterialId"
                class="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 via-slate-50 to-blue-100 rounded-xl border border-blue-200 hover:shadow-md transition-all animate-in fade-in slide-in-from-bottom duration-300"
                :style="{ animationDelay: `${idx * 50}ms` }"
              >
                <div class="flex items-center gap-3 flex-1">
                  <div
                    class="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0"
                  >
                    <svg
                      class="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                  <div>
                    <p class="font-semibold text-gray-900 text-sm sm:text-base">
                      {{
                        materialsStore.items.find((m) => m.id === comp.rawMaterialId)?.name ||
                        comp.rawMaterialName
                      }}
                    </p>
                    <p class="text-xs sm:text-sm text-gray-600">
                      Quantity: {{ comp.quantity }} units
                    </p>
                  </div>
                </div>
                <AppButton
                  variant="danger"
                  size="sm"
                  @click="handleDelete(comp.rawMaterialId)"
                  class="flex-shrink-0"
                  >Remove</AppButton
                >
              </div>
              <div v-if="compositionsStore.compositions.length === 0" class="text-center py-12">
                <p class="text-gray-500 text-sm sm:text-base">
                  No materials added yet. Add materials using the form above.
                </p>
              </div>
            </div>
          </template>

          <div v-else class="flex flex-col items-center justify-center h-64">
            <div class="text-6xl mb-4">📦</div>
            <p class="text-gray-500">Select a product to manage its recipe</p>
          </div>
        </AppCard>
      </div>
    </div>
  </div>
</template>
