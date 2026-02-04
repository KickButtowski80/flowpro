<template>
  <!-- Navigation -->
  <nav class="fixed top-0 z-50 isolate w-full bg-flowpro border-b border-flowpro-dark/20 backdrop-blur-lg shadow-lg">
    <div class="container mx-auto px-4">
      <div class="flex h-20 items-center justify-between">
        <!-- Logo -->
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-flowpro font-bold text-lg">
            FP
          </div>
          <span class="text-2xl font-black text-white">FlowPro</span>
        </div>
        
        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center gap-10">
          <a 
            href="#services" 
            :class="[
              'relative pl-6 text-lg font-semibold transition-all duration-300',
              isSectionActive('services') 
                ? 'text-blue-300 scale-105' 
                : 'text-white hover:text-blue-200'
            ]"
          >
            <span class="relative">
              Services
              <span 
                v-if="isSectionActive('services')"
                class="absolute -top-2 -right-3 text-lg animate-bounce"
              >🔧</span>
            </span>
          </a>
          <a 
            href="#about" 
            :class="[
              'relative pl-6 text-lg font-semibold transition-all duration-300',
              isSectionActive('about') 
                ? 'text-purple-300 scale-105' 
                : 'text-white hover:text-blue-200'
            ]"
          >
            <span class="relative">
              About
              <span 
                v-if="isSectionActive('about')"
                class="absolute -top-1 -right-4 text-lg animate-pulse"
              >📋</span>
            </span>
          </a>
          <a 
            href="#emergency" 
            :class="[
              'relative pl-6 text-lg font-semibold transition-all duration-300',
              isSectionActive('emergency') 
                ? 'text-red-300 scale-105 animate-pulse' 
                : 'text-white hover:text-red-200'
            ]"
          >
            <span class="relative">
              Emergency
              <span 
                v-if="isSectionActive('emergency')"
                class="absolute -top-1 -right-4 text-lg animate-spin"
              >🚨</span>
            </span>
          </a>
          <a 
            href="#contact" 
            :class="[
              'relative pl-6 text-lg font-semibold transition-all duration-300',
              isSectionActive('contact') 
                ? 'text-green-300 scale-105' 
                : 'text-white hover:text-green-200'
            ]"
          >
            <span class="relative">
              Contact
              <span 
                v-if="isSectionActive('contact')"
                class="absolute -top-1 -right-4 text-lg animate-bounce"
              >📞</span>
            </span>
          </a>
          <a 
            href="#get-quote" 
            class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-3 font-black text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:from-green-600 hover:to-emerald-700 before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100"
          >
            <span class="relative z-10 flex items-center gap-2">
              <span class="text-lg">💰</span>
              Get Quote
            </span>
          </a>
        </div>
        
        <!-- Mobile Menu Button -->
        <button 
          class="md:hidden text-neutral-600"
          @click="toggleMobileMenu"
          aria-label="Toggle mobile menu"
        >
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>
      
      <!-- Mobile Menu -->
      <div 
        v-if="isMobileMenuOpen"
        class="md:hidden border-t border-flowpro-dark/20 bg-flowpro/95 backdrop-blur-lg"
      >
        <div class="px-4 py-6 space-y-4">
          <a 
            href="#services" 
            :class="[
              'relative block pl-6 transition-colors py-3 text-lg font-semibold',
              isSectionActive('services') 
                ? 'text-blue-300 scale-105' 
                : 'text-white hover:text-blue-200'
            ]"
            @click="closeMobileMenu"
          >
            <span class="relative">
              Services
              <span 
                v-if="isSectionActive('services')"
                class="absolute -top-2 -right-3 text-lg animate-bounce transition-all duration-300"
              >🔧</span>
            </span>
          </a>

          <a 
            href="#about" 
            :class="[
              'relative block pl-6 transition-colors py-3 text-lg font-semibold',
              isSectionActive('about') 
                ? 'text-purple-300 scale-105' 
                : 'text-white hover:text-blue-200'
            ]"
            @click="closeMobileMenu"
          >
            <span class="relative">
              About
              <span 
                v-if="isSectionActive('about')"
                class="absolute -top-1 -right-4 text-lg animate-pulse transition-all duration-300"
              >📋</span>
            </span>
          </a>
          <a 
            href="#emergency" 
            :class="[
              'relative block pl-6 transition-colors py-3 text-lg font-semibold',
              isSectionActive('emergency') 
                ? 'text-red-300 scale-105 animate-pulse' 
                : 'text-white hover:text-red-200'
            ]"
            @click="closeMobileMenu"
          >
            <span class="relative">
              Emergency
              <span 
                v-if="isSectionActive('emergency')"
                class="absolute -top-1 -right-4 text-lg animate-spin transition-all duration-300"
              >🚨</span>
            </span>
          </a>
          <a 
            href="#contact" 
            :class="[
              'relative block pl-6 transition-colors py-3 text-lg font-semibold',
              isSectionActive('contact') 
                ? 'text-green-300 scale-105' 
                : 'text-white hover:text-green-200'
            ]"
            @click="closeMobileMenu"
          >
            <span class="relative">
              Contact
              <span 
                v-if="isSectionActive('contact')"
                class="absolute -top-1 -right-4 text-lg animate-bounce transition-all duration-300"
              >📞</span>
            </span>
          </a>
          <a 
            href="#get-quote" 
            :class="[
              'relative overflow-hidden block rounded-2xl px-8 py-4 font-black shadow-lg transition-all duration-300 text-center',
              isSectionActive('get-quote') 
                ? 'bg-gradient-to-r from-green-600 to-emerald-700 text-white scale-105 shadow-xl' 
                : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:scale-105 hover:shadow-xl hover:from-green-600 hover:to-emerald-700'
            ]"
            @click="closeMobileMenu"
          >
            <span class="relative z-10 flex items-center justify-center gap-2">
              <span class="text-lg">💰</span>
              <span 
                v-if="isSectionActive('get-quote')"
                class="absolute -top-2 -right-3 text-lg animate-bounce transition-all duration-300"
              >🎯</span>
              Get Quote
            </span>
          </a>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
/**
 * NavbarSection - Main navigation component with mobile menu and active states
 * 
 * @component
 * @description A responsive navigation bar with desktop links, mobile hamburger menu, and scroll-based active section highlighting
 * 
 * @example
 * <NavbarSection />
 */

import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useActiveSection } from '~/composables/useActiveSection'

// Mobile menu state
const isMobileMenuOpen = ref(false)

// Active section detection
const { isSectionActive, observeSection } = useActiveSection()

// Mobile menu functions
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

// Close mobile menu on escape key
const handleEscape = (event) => {
  if (event.key === 'Escape') {
    closeMobileMenu()
  }
}

// Lifecycle hooks
onMounted(() => {
  document.addEventListener('keydown', handleEscape)
  
  // Observe sections for active state detection
  nextTick(() => {
    const sections = {
      services: document.querySelector('section#services'),
      about: document.querySelector('section#about'),
      emergency: document.querySelector('section#emergency'),
      contact: document.querySelector('section#contact'),
      'get-quote': document.querySelector('section#get-quote')
    }
    
    Object.entries(sections).forEach(([id, element]) => {
      observeSection(id, element)
    })
  })
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
})
</script>

<style scoped>
/* Component-specific styles */
/* All styling is handled by Tailwind classes and props */
</style>
