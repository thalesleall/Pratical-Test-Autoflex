<template>
  <div class="flex flex-col items-center justify-center py-12 gap-4">
    <div class="relative">
      <div class="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600" />
      <div
        class="absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-blue-400 opacity-20"
      />
    </div>
    <p class="text-gray-500 text-sm font-medium animate-pulse">Loading...</p>
  </div>
</template>
