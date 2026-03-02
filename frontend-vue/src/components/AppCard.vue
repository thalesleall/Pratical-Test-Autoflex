<script setup lang="ts">
defineProps<{
  hover?: boolean
}>()
</script>

<template>
  <div
    :class="[
      'bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transition-all duration-300',
      { 'hover:shadow-2xl hover:-translate-y-1': hover !== false },
    ]"
  >
    <slot />
  </div>
</template>
