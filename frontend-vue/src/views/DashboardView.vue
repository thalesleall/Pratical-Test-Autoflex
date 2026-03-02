<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useProductsStore } from '@/stores/products'
import { useRawMaterialsStore } from '@/stores/rawMaterials'
import { useProductionStore } from '@/stores/production'
import AppCard from '@/components/AppCard.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const productsStore = useProductsStore()
const materialsStore = useRawMaterialsStore()
const productionStore = useProductionStore()

onMounted(() => {
  productsStore.fetchProducts()
  materialsStore.fetchRawMaterials()
  productionStore.fetchProductionSuggestions()
})

const totalProductValue = computed(() =>
  productsStore.items.reduce((sum, p) => sum + (p.value ?? 0), 0),
)
const totalMaterialQuantity = computed(() =>
  materialsStore.items.reduce((sum, m) => sum + (m.quantity ?? 0), 0),
)
const topSuggestion = computed(() => productionStore.suggestions[0])
const isLoading = computed(
  () => productsStore.loading || materialsStore.loading || productionStore.loading,
)
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
      <div class="mb-8 sm:mb-12 animate-in fade-in slide-in-from-top duration-500">
        <h1
          class="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-900 to-blue-950 bg-clip-text text-transparent mb-2"
        >
          Dashboard
        </h1>
        <p class="text-gray-600 text-sm sm:text-base">Production management overview</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
        <AppCard
          class="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 animate-in fade-in slide-in-from-left duration-500"
          :hover="false"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs sm:text-sm text-blue-900 font-semibold mb-1">Total Products</p>
              <p class="text-3xl sm:text-4xl font-bold text-blue-900">
                {{ productsStore.items.length }}
              </p>
              <p class="text-xs text-blue-800 mt-2 font-medium">
                Value: ${{ (totalProductValue ?? 0).toFixed(2) }}
              </p>
            </div>
            <div
              class="w-14 h-14 sm:w-16 sm:h-16 bg-blue-900 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform"
            >
              <svg
                class="w-7 h-7 sm:w-8 sm:h-8 text-white"
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
        </AppCard>

        <AppCard
          class="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200 animate-in fade-in slide-in-from-bottom duration-500 delay-100"
          :hover="false"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs sm:text-sm text-slate-900 font-semibold mb-1">Raw Materials</p>
              <p class="text-3xl sm:text-4xl font-bold text-slate-900">
                {{ materialsStore.items.length }}
              </p>
              <p class="text-xs text-slate-800 mt-2 font-medium">
                Qty: {{ totalMaterialQuantity }} units
              </p>
            </div>
            <div
              class="w-14 h-14 sm:w-16 sm:h-16 bg-slate-700 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform"
            >
              <svg
                class="w-7 h-7 sm:w-8 sm:h-8 text-white"
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
          </div>
        </AppCard>

        <AppCard
          class="bg-gradient-to-br from-blue-100 to-blue-200 border-blue-300 sm:col-span-2 lg:col-span-1 animate-in fade-in slide-in-from-right duration-500 delay-200"
          :hover="false"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs sm:text-sm text-blue-900 font-semibold mb-1">Production</p>
              <p class="text-3xl sm:text-4xl font-bold text-blue-900">
                {{ productionStore.suggestions.length }}
              </p>
              <p v-if="topSuggestion" class="text-xs text-blue-800 mt-2 font-medium">
                Top: {{ topSuggestion.productName.substring(0, 15)
                }}{{ topSuggestion.productName.length > 15 ? '...' : '' }} ({{
                  topSuggestion.producibleQuantity
                }})
              </p>
            </div>
            <div
              class="w-14 h-14 sm:w-16 sm:h-16 bg-blue-800 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform"
            >
              <svg
                class="w-7 h-7 sm:w-8 sm:h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
          </div>
        </AppCard>
      </div>

      <LoadingSpinner v-if="isLoading" />

      <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <AppCard class="animate-in fade-in slide-in-from-left duration-700">
          <div class="flex items-center justify-between mb-4 sm:mb-6">
            <h2 class="text-lg sm:text-xl font-bold text-gray-900">Recent Products</h2>
            <router-link
              to="/products"
              class="text-xs sm:text-sm text-blue-900 hover:text-blue-950 font-semibold transition-colors flex items-center gap-1 hover:gap-2"
            >
              View all <span>→</span>
            </router-link>
          </div>
          <div class="space-y-2 sm:space-y-3">
            <div
              v-for="(product, idx) in productsStore.items.slice(0, 5)"
              :key="product.id"
              class="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-transparent rounded-xl hover:from-blue-100 hover:shadow-md transition-all cursor-pointer border border-blue-100"
              :style="{ animationDelay: `${idx * 100}ms` }"
            >
              <span class="font-semibold text-gray-900 text-sm sm:text-base truncate mr-2">{{
                product.name
              }}</span>
              <span
                class="text-xs sm:text-sm bg-blue-900 text-white px-2 sm:px-3 py-1 rounded-full font-bold whitespace-nowrap"
                >${{ product.value.toFixed(2) }}</span
              >
            </div>
            <div v-if="productsStore.items.length === 0" class="text-center py-8">
              <p class="text-gray-400 text-sm">No products yet</p>
              <router-link
                to="/products"
                class="text-blue-600 text-sm mt-2 inline-block hover:underline"
                >Create your first product</router-link
              >
            </div>
          </div>
        </AppCard>

        <AppCard class="animate-in fade-in slide-in-from-right duration-700">
          <div class="flex items-center justify-between mb-4 sm:mb-6">
            <h2 class="text-lg sm:text-xl font-bold text-gray-900">Production Ideas</h2>
            <router-link
              to="/production"
              class="text-xs sm:text-sm text-blue-900 hover:text-blue-950 font-semibold transition-colors flex items-center gap-1 hover:gap-2"
            >
              Plan <span>→</span>
            </router-link>
          </div>
          <div class="space-y-2 sm:space-y-3">
            <div
              v-for="(suggestion, idx) in productionStore.suggestions.slice(0, 5)"
              :key="suggestion.productName"
              class="p-3 sm:p-4 bg-gradient-to-r from-blue-50 via-slate-50 to-blue-100 rounded-xl hover:shadow-md transition-all cursor-pointer border border-blue-200"
              :style="{ animationDelay: `${idx * 100}ms` }"
            >
              <div class="flex items-center justify-between mb-1">
                <span class="font-semibold text-gray-900 text-sm sm:text-base truncate mr-2">{{
                  suggestion.productName
                }}</span>
                <span
                  class="text-xs sm:text-sm bg-blue-900 text-white px-2 sm:px-3 py-1 rounded-full font-bold whitespace-nowrap"
                  >${{ (suggestion.totalValueEstimate ?? 0).toFixed(2) }}</span
                >
              </div>
              <div class="flex items-center gap-2 text-xs text-gray-600">
                <span class="bg-white px-2 py-0.5 rounded-full"
                  >Max: {{ suggestion.producibleQuantity ?? 0 }} units</span
                >
                <span class="bg-white px-2 py-0.5 rounded-full"
                  >${{ (suggestion.unitValue ?? 0).toFixed(2) }}/unit</span
                >
              </div>
            </div>
            <div v-if="productionStore.suggestions.length === 0" class="text-center py-8">
              <p class="text-gray-400 text-sm">No suggestions available</p>
              <router-link
                to="/compositions"
                class="text-green-600 text-sm mt-2 inline-block hover:underline"
                >Create product recipes first</router-link
              >
            </div>
          </div>
        </AppCard>
      </div>
    </div>
  </div>
</template>
