<script setup lang="ts">
defineProps<{
  label?: string
  modelValue?: string | number
  type?: string
  placeholder?: string
  required?: boolean
  step?: string
  min?: string
  max?: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="flex flex-col gap-2">
    <label v-if="label" class="text-sm font-semibold text-gray-700">{{ label }}</label>
    <input
      :type="type || 'text'"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :step="step"
      :min="min"
      :max="max"
      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900 outline-none transition-all bg-white hover:border-gray-400"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </div>
</template>
