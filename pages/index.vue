<template>
  <div class="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100">
    <!-- Navigation -->
    <nav class="fixed top-0 z-50 w-full bg-flowpro border-b border-flowpro-dark/20 backdrop-blur-lg shadow-lg">
      <div class="container mx-auto px-4">
        <div class="flex h-16 items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-flowpro font-bold">
              FP
            </div>
            <span class="text-xl font-bold text-white">FlowPro</span>
          </div>
          
          <div class="hidden md:flex items-center gap-8">
            <a href="#services" class="text-white hover:text-blue-200 transition-colors">Services</a>
            <a href="#about" class="text-white hover:text-blue-200 transition-colors">About</a>
            <a href="#emergency" class="text-white hover:text-red-200 transition-colors">Emergency</a>
            <a href="#contact" class="btn-primary text-sm">Get Quote</a>
          </div>
          
          <button class="md:hidden text-neutral-600">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <HeroSection 
      :greeting-message="currentMessage"
    />
    
    <!-- Services Section -->
    <ServicesSection 
      :services="features"
    />
    
    <!-- About Section -->
    <AboutSection />
    
    <!-- Emergency Section -->
    <EmergencySection 
      :phone-number="5551234567"
    />
    
    <!-- Component Showcase Section -->
    <ComponentShowcaseSection 
      @showcase-click="handleShowcaseClick"
    />
    
    <!-- Contact Section -->
    <ContactSection 
      @form-submit="handleContactSubmit"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import HeroSection from '~/components/HeroSection.vue'
import ServicesSection from '~/components/ServicesSection.vue'
import AboutSection from '~/components/AboutSection.vue'
import EmergencySection from '~/components/EmergencySection.vue'
import ComponentShowcaseSection from '~/components/ComponentShowcaseSection.vue'
import ContactSection from '~/components/ContactSection.vue'

const greeting = ref('Hello')

const currentMessage = computed(() => {
  // Get current hour once - no need for updates
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning! Your day starts right with reliable plumbing.'
  if (hour < 17) return 'Good afternoon! Perfect time to tackle those plumbing projects.'
  return 'Good evening! Emergency services available when you need us most.'
})

// No timers needed - greeting is computed once

// Event handler for ComponentShowcaseSection
const handleShowcaseClick = (event) => {
  // Navigate to component showcase page
  navigateTo('/component-showcase')
}

// Event handler for ContactSection
const handleContactSubmit = (formData) => {
  console.log('Contact form submitted:', formData)
  // Here you would normally send to API, email, etc.
  // For now, just log the data
}

const features = ref([
  {
    icon: '🔧',
    title: 'Expert Repairs',
    description: 'Licensed professionals with 10+ years experience using state-of-the-art diagnostic equipment for permanent, reliable fixes.'
  },
  {
    icon: '⚡',
    title: 'Fast Response',
    description: '24/7 emergency service within 60 minutes. We arrive fully equipped to handle most repairs in a single visit, saving you time and money.'
  },
  {
    icon: '💰',
    title: 'Fair Pricing',
    description: 'Transparent quotes with no hidden fees. We provide detailed up-front pricing so you know exactly what to expect before we begin work.'
  },
  {
    icon: '🔍',
    title: 'Inspections',
    description: 'Comprehensive plumbing inspections to identify potential issues before they become costly problems. Perfect for homebuyers and maintenance.'
  },
  {
    icon: '�',
    title: 'Installation',
    description: 'Professional installation of fixtures, water heaters, pipes, and complete plumbing systems. All work meets local codes and standards.'
  },
  {
    icon: '�️',
    title: 'Maintenance',
    description: 'Preventive maintenance plans to keep your plumbing system running efficiently and avoid unexpected breakdowns.'
  }
])
</script>

<style scoped>
/* Component-specific styles only */
/* Smooth scrolling is now in assets/css/style.css */
</style>