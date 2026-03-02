<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isMenuOpen = ref(false)

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/products', label: 'Products' },
  { to: '/materials', label: 'Materials' },
  { to: '/compositions', label: 'Recipes' },
  { to: '/production', label: 'Production' },
]
</script>

<template>
  <nav class="bg-blue-900 text-white shadow-xl sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center space-x-2">
          <div
            class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm"
          >
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <h1 class="text-2xl font-bold tracking-tight">Autoflex</h1>
        </div>

        <div class="hidden md:flex space-x-2">
          <router-link
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
              route.path === link.to
                ? 'bg-white text-blue-900 shadow-lg transform scale-105'
                : 'hover:bg-white/10 hover:scale-105',
            ]"
          >
            {{ link.label }}
          </router-link>
        </div>

        <button
          @click="isMenuOpen = !isMenuOpen"
          class="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              v-if="isMenuOpen"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
            <path
              v-else
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      <div
        v-if="isMenuOpen"
        class="md:hidden pb-4 space-y-2 animate-in slide-in-from-top duration-200"
      >
        <router-link
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          @click="isMenuOpen = false"
          :class="[
            'block px-4 py-3 rounded-lg text-sm font-medium transition-all',
            route.path === link.to ? 'bg-white text-blue-900' : 'bg-white/10 hover:bg-white/20',
          ]"
        >
          {{ link.label }}
        </router-link>
      </div>
    </div>
  </nav>
</template>
