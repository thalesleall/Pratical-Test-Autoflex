<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRawMaterialsStore } from '@/stores/rawMaterials'
import AppCard from '@/components/AppCard.vue'
import AppButton from '@/components/AppButton.vue'
import AppInput from '@/components/AppInput.vue'
import AppModal from '@/components/AppModal.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import type { RawMaterialDTO } from '@/types/api'

const store = useRawMaterialsStore()
const isModalOpen = ref(false)
const editingMaterial = ref<RawMaterialDTO | null>(null)
const formName = ref('')
const formQuantity = ref('0')

onMounted(() => {
  store.fetchRawMaterials()
})

function openCreateModal() {
  editingMaterial.value = null
  formName.value = ''
  formQuantity.value = '0'
  isModalOpen.value = true
}

function handleEdit(material: RawMaterialDTO) {
  editingMaterial.value = material
  formName.value = material.name
  formQuantity.value = String(material.quantity)
  isModalOpen.value = true
}

async function handleSubmit() {
  const data = { name: formName.value, quantity: parseInt(formQuantity.value) }
  if (editingMaterial.value?.id) {
    await store.updateRawMaterial(editingMaterial.value.id, data)
  } else {
    await store.createRawMaterial(data)
  }
  isModalOpen.value = false
  formName.value = ''
  formQuantity.value = '0'
  editingMaterial.value = null
}

async function handleDelete(id: number) {
  if (confirm('Are you sure you want to delete this raw material?')) {
    await store.deleteRawMaterial(id)
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
            Raw Materials
          </h1>
          <p class="text-gray-600 text-sm sm:text-base">Manage your inventory</p>
        </div>
        <AppButton @click="openCreateModal" size="lg" class="w-full sm:w-auto"
          >+ New Material</AppButton
        >
      </div>

      <LoadingSpinner v-if="store.loading" />

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <AppCard
          v-for="(material, idx) in store.items"
          :key="material.id"
          class="animate-in fade-in slide-in-from-bottom duration-500"
          :style="{ animationDelay: `${idx * 50}ms` }"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <h3 class="text-lg sm:text-xl font-bold text-gray-900 mb-1 truncate">
                {{ material.name }}
              </h3>
              <div class="flex items-center gap-2">
                <span class="text-2xl sm:text-3xl text-blue-900 font-bold">{{
                  material.quantity
                }}</span>
                <span class="text-gray-500 text-sm">units</span>
              </div>
            </div>
            <div
              class="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform flex-shrink-0"
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
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
          </div>
          <div class="flex gap-2">
            <AppButton variant="secondary" @click="handleEdit(material)" class="flex-1 text-sm"
              >Edit</AppButton
            >
            <AppButton variant="danger" @click="handleDelete(material.id!)" class="flex-1 text-sm"
              >Delete</AppButton
            >
          </div>
        </AppCard>
      </div>

      <AppCard v-if="!store.loading && store.items.length === 0" class="text-center py-12">
        <p class="text-gray-500 text-lg mb-4">
          No materials yet. Click "New Material" to create one.
        </p>
        <AppButton @click="openCreateModal">Create First Material</AppButton>
      </AppCard>
    </div>
  </div>

  <AppModal
    :isOpen="isModalOpen"
    :title="editingMaterial ? 'Edit Material' : 'New Material'"
    @close="isModalOpen = false"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <AppInput
        label="Material Name"
        v-model="formName"
        placeholder="Enter material name"
        required
      />
      <AppInput label="Quantity" type="number" v-model="formQuantity" placeholder="0" required />
      <div class="flex gap-2 pt-4">
        <AppButton type="submit" class="flex-1">{{
          editingMaterial ? 'Update' : 'Create'
        }}</AppButton>
        <AppButton type="button" variant="secondary" @click="isModalOpen = false" class="flex-1"
          >Cancel</AppButton
        >
      </div>
    </form>
  </AppModal>
</template>
