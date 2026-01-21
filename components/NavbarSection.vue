<template>
  <!-- Navigation -->
  <nav class="fixed top-0 z-50 w-full bg-flowpro border-b border-flowpro-dark/20 backdrop-blur-lg shadow-lg">
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
            class="relative pl-6 text-white hover:text-blue-200 transition-colors text-lg font-semibold before:content-['⚙️'] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300"
          >
            Services
          </a>
          <a 
            href="#about" 
            class="relative pl-6 text-white hover:text-blue-200 transition-colors text-lg font-semibold before:content-['⚙️'] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300"
          >
            About
          </a>
          <a 
            href="#emergency" 
            class="relative pl-6 text-white hover:text-red-200 transition-colors text-lg font-semibold before:content-['⚙️'] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300"
          >
            Emergency
          </a>
          <a 
            href="#contact" 
            class="relative pl-6 text-white hover:text-green-200 transition-colors text-lg font-semibold before:content-['⚙️'] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300"
          >
            Contact
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
            class="relative block pl-6 text-white hover:text-blue-200 transition-colors py-3 text-lg font-semibold before:content-['⚙️'] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300"
            @click="closeMobileMenu"
          >
            Services
          </a>
          <a 
            href="#about" 
            class="relative block pl-6 text-white hover:text-blue-200 transition-colors py-3 text-lg font-semibold before:content-['⚙️'] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300"
            @click="closeMobileMenu"
          >
            About
          </a>
          <a 
            href="#emergency" 
            class="relative block pl-6 text-white hover:text-red-200 transition-colors py-3 text-lg font-semibold before:content-['⚙️'] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300"
            @click="closeMobileMenu"
          >
            Emergency
          </a>
          <a 
            href="#contact" 
            class="relative block pl-6 text-white hover:text-green-200 transition-colors py-3 text-lg font-semibold before:content-['⚙️'] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300"
            @click="closeMobileMenu"
          >
            Contact
          </a>
          <a 
            href="#get-quote" 
            class="relative overflow-hidden block rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-4 font-black text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:from-green-600 hover:to-emerald-700 before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100 text-center"
            @click="closeMobileMenu"
          >
            <span class="relative z-10 flex items-center justify-center gap-2">
              <span class="text-lg">💰</span>
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
 * NavbarSection - Main navigation component with mobile menu
 * 
 * @component
 * @description A responsive navigation bar with desktop links and mobile hamburger menu
 * 
 * @example
 * <NavbarSection />
 */

import { ref } from 'vue'

// Mobile menu state
const isMobileMenuOpen = ref(false)

// Toggle mobile menu
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

// Close mobile menu
const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}
</script>

<style scoped>
/* Component-specific styles */
/* All styling is handled by Tailwind classes and props */
</style>
