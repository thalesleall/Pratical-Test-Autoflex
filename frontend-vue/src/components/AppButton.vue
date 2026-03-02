<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}>()
</script>

<template>
  <button
    :type="type || 'button'"
    :disabled="disabled"
    :class="[
      'rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95',
      {
        'bg-gradient-to-r from-blue-900 to-blue-950 hover:from-blue-950 hover:to-slate-900 text-white shadow-lg hover:shadow-xl':
          variant === 'primary' || !variant,
        'bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300':
          variant === 'secondary',
        'bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-900 hover:to-blue-950 text-white shadow-lg hover:shadow-xl':
          variant === 'danger',
        'bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white shadow-lg hover:shadow-xl':
          variant === 'success',
      },
      {
        'px-3 py-1.5 text-sm': size === 'sm',
        'px-4 py-2 text-base': size === 'md' || !size,
        'px-6 py-3 text-lg': size === 'lg',
      },
    ]"
  >
    <slot />
  </button>
</template>
