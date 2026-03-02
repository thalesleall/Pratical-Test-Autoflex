<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useProductionStore } from '@/stores/production'
import { useRawMaterialsStore } from '@/stores/rawMaterials'
import AppCard from '@/components/AppCard.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const productionStore = useProductionStore()
const materialsStore = useRawMaterialsStore()

onMounted(() => {
  productionStore.fetchProductionSuggestions()
  materialsStore.fetchRawMaterials()
})

const totalUnits = computed(() =>
  productionStore.suggestions.reduce((sum, s) => sum + s.producibleQuantity, 0),
)
const totalRevenue = computed(() =>
  productionStore.suggestions.reduce((sum, s) => sum + (s.totalValueEstimate ?? 0), 0),
)
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
      <!-- Header -->
      <div class="mb-8 animate-in fade-in slide-in-from-top duration-500">
        <h1
          class="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-900 to-blue-950 bg-clip-text text-transparent mb-2"
        >
          Production Suggestions
        </h1>
        <p class="text-gray-600 text-sm sm:text-base">
          Products ordered by highest value. Materials are virtually consumed following priority.
        </p>
      </div>

      <!-- Algorithm Explanation Panel -->
      <div class="mb-8 animate-in fade-in slide-in-from-bottom duration-700">
        <div
          class="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 border border-emerald-200 rounded-2xl p-5 sm:p-6 shadow-sm"
        >
          <div class="mb-4">
            <h2 class="text-base sm:text-lg font-bold text-emerald-900 mb-1">
              Smart Algorithm Active Greedy Strategy
            </h2>
            <p class="text-xs sm:text-sm text-emerald-700 leading-relaxed">
              The system prioritizes products by highest value and simulates material consumption in
              order. Each product uses remaining materials after higher-value products.
            </p>
          </div>
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div
              class="bg-white border border-emerald-200 rounded-xl p-4 flex flex-col gap-2 shadow-sm"
            >
              <div class="flex items-center gap-2 mb-1">
                <span
                  class="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold shrink-0"
                  >1</span
                >
                <span class="text-xs font-bold text-emerald-900 uppercase tracking-wide"
                  >Sort by Value</span
                >
              </div>
              <p class="text-xs text-gray-600 text-center">Products ordered highest to lowest</p>
            </div>
            <div
              class="bg-white border border-teal-200 rounded-xl p-4 flex flex-col gap-2 shadow-sm"
            >
              <div class="flex items-center gap-2 mb-1">
                <span
                  class="flex items-center justify-center w-6 h-6 rounded-full bg-teal-600 text-white text-xs font-bold shrink-0"
                  >2</span
                >
                <span class="text-xs font-bold text-teal-900 uppercase tracking-wide"
                  >Load Stock</span
                >
              </div>
              <p class="text-xs text-gray-600 text-center">Create virtual inventory copy</p>
            </div>
            <div
              class="bg-white border border-cyan-200 rounded-xl p-4 flex flex-col gap-2 shadow-sm"
            >
              <div class="flex items-center gap-2 mb-1">
                <span
                  class="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-600 text-white text-xs font-bold shrink-0"
                  >3</span
                >
                <span class="text-xs font-bold text-cyan-900 uppercase tracking-wide"
                  >Calculate Bottleneck</span
                >
              </div>
              <p class="text-xs text-gray-600 text-center">Find limiting ingredient</p>
            </div>
            <div
              class="bg-white border border-blue-200 rounded-xl p-4 flex flex-col gap-2 shadow-sm"
            >
              <div class="flex items-center gap-2 mb-1">
                <span
                  class="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold shrink-0"
                  >4</span
                >
                <span class="text-xs font-bold text-blue-900 uppercase tracking-wide"
                  >Virtual Consumption</span
                >
              </div>
              <p class="text-xs text-gray-600 text-center">Subtract materials for next</p>
            </div>
          </div>
        </div>
      </div>

      <LoadingSpinner v-if="productionStore.loading" />

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <!-- Suggestions Table -->
        <div class="lg:col-span-2">
          <AppCard>
            <!-- Table header -->
            <div class="hidden sm:grid grid-cols-5 gap-3 px-2 pb-3 border-b border-gray-200 mb-2">
              <span class="text-xs font-bold text-gray-400 uppercase tracking-wide">#</span>
              <span class="text-xs font-bold text-gray-400 uppercase tracking-wide col-span-2"
                >Product</span
              >
              <span class="text-xs font-bold text-gray-400 uppercase tracking-wide text-right"
                >Unit Value</span
              >
              <span class="text-xs font-bold text-gray-400 uppercase tracking-wide text-right"
                >Quantity</span
              >
            </div>
            <div class="hidden sm:grid grid-cols-5 gap-3 px-2 pb-2 mb-1">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span class="text-xs font-bold text-gray-400 uppercase tracking-wide text-right"
                >Max Revenue</span
              >
            </div>

            <!-- Empty state -->
            <div v-if="productionStore.suggestions.length === 0" class="text-center py-12">
              <p class="text-gray-500 text-lg mb-2">No production suggestions available.</p>
              <p class="text-gray-400 text-sm">Make sure you have products with recipes.</p>
            </div>

            <!-- Rows -->
            <div
              v-for="(suggestion, idx) in productionStore.suggestions"
              :key="suggestion.productName"
              class="grid grid-cols-1 sm:grid-cols-5 gap-2 sm:gap-3 items-center px-2 py-4 border-b border-gray-100 last:border-0 hover:bg-blue-50/40 rounded-xl transition-colors animate-in fade-in slide-in-from-left duration-500"
              :style="{ animationDelay: `${idx * 80}ms` }"
            >
              <!-- # -->
              <span
                class="hidden sm:flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-800 text-xs font-bold"
                >{{ idx + 1 }}</span
              >

              <!-- Product -->
              <div class="sm:col-span-2">
                <div class="flex items-center gap-2 sm:hidden mb-1">
                  <span
                    class="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs font-bold"
                    >{{ idx + 1 }}</span
                  >
                </div>
                <p class="font-bold text-gray-900 text-sm sm:text-base">
                  {{ suggestion.productName }}
                </p>
                <p class="text-xs text-gray-400 mt-0.5">Priority by highest value</p>
              </div>

              <!-- Unit Value -->
              <div class="flex sm:block items-center justify-between">
                <span class="text-xs text-gray-400 sm:hidden">Unit Value</span>
                <p class="font-bold text-purple-700 text-sm sm:text-right">
                  ${{ (suggestion.unitValue ?? 0).toFixed(2) }}
                </p>
              </div>

              <!-- Quantity + Max Revenue (stacked on the last column) -->
              <div class="flex sm:block items-center justify-between sm:text-right">
                <span class="text-xs text-gray-400 sm:hidden">Quantity</span>
                <div>
                  <p class="font-bold text-blue-700 text-sm">
                    {{ suggestion.producibleQuantity }}
                    <span class="text-xs font-normal text-gray-500">units</span>
                  </p>
                  <p class="font-bold text-emerald-700 text-sm">
                    ${{ (suggestion.totalValueEstimate ?? 0).toFixed(2) }}
                  </p>
                </div>
              </div>
            </div>
          </AppCard>
        </div>

        <!-- Right column -->
        <div class="space-y-4 animate-in fade-in slide-in-from-right duration-700">
          <!-- Total Opportunity -->
          <AppCard
            class="bg-gradient-to-br from-white to-blue-50 border-2 border-blue-200"
            :hover="false"
          >
            <h2 class="text-base sm:text-lg font-bold text-gray-900 mb-4">Total Opportunity</h2>
            <div class="space-y-3">
              <div
                class="flex items-center justify-between p-3 bg-white rounded-xl border border-blue-100"
              >
                <span class="text-sm text-gray-600">Total Products:</span>
                <span class="font-bold text-blue-900 text-lg">{{
                  productionStore.suggestions.length
                }}</span>
              </div>
              <div
                class="flex items-center justify-between p-3 bg-white rounded-xl border border-blue-100"
              >
                <span class="text-sm text-gray-600">Total Units:</span>
                <span class="font-bold text-blue-900 text-lg">{{ totalUnits }}</span>
              </div>
              <div
                class="flex items-center justify-between p-3 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl border border-blue-300"
              >
                <span class="text-sm font-semibold text-gray-700">Max Revenue:</span>
                <span class="font-bold text-blue-900 text-xl">${{ totalRevenue.toFixed(2) }}</span>
              </div>
            </div>
          </AppCard>

          <!-- Raw Materials -->
          <AppCard
            class="bg-gradient-to-br from-white to-slate-50 border-2 border-slate-200"
            :hover="false"
          >
            <h3 class="text-base sm:text-lg font-bold text-gray-900 mb-3">Raw Materials</h3>
            <div class="space-y-2 max-h-64 overflow-y-auto">
              <div
                v-for="material in materialsStore.items"
                :key="material.id"
                class="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 hover:border-slate-300 transition-all"
              >
                <span class="text-xs sm:text-sm text-gray-700 font-medium truncate mr-2">{{
                  material.name
                }}</span>
                <span
                  class="text-xs sm:text-sm font-bold bg-slate-700 text-white px-3 py-1 rounded-full whitespace-nowrap"
                  >{{ material.quantity }}</span
                >
              </div>
              <p
                v-if="materialsStore.items.length === 0"
                class="text-center text-gray-400 text-sm py-4"
              >
                No materials
              </p>
            </div>
          </AppCard>
        </div>
      </div>
    </div>
  </div>
</template>
