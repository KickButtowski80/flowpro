<template>
    <!-- Main Content -->
    <main class="container md:mx-auto px-4">
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
        :phone-number="'(555) 123-4567'"
      />
      
      <!-- Component Showcase Section -->
      <ComponentShowcaseSection 
        @showcase-click="handleShowcaseClick"
      />
      
      <!-- Contact Section -->
      <ContactSection />
      
      <!-- Get Quote Section -->
      <GetQuoteSection />
    </main>
</template>

<script setup>
import { ref, computed } from 'vue'

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