<script setup lang="ts">
defineProps<{
  isOpen: boolean
  title: string
}>()

const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div class="fixed inset-0 bg-black/60 backdrop-blur-md" @click="emit('close')" />
      <div
        class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-300 border border-gray-200"
      >
        <div class="flex items-center justify-between mb-6">
          <h2
            class="text-2xl font-bold bg-gradient-to-r from-blue-900 to-blue-950 bg-clip-text text-transparent"
          >
            {{ title }}
          </h2>
          <button
            @click="emit('close')"
            class="text-gray-400 hover:text-gray-600 transition-all hover:rotate-90 duration-200 p-1 hover:bg-gray-100 rounded-lg"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <slot />
      </div>
    </div>
  </Teleport>
</template>
