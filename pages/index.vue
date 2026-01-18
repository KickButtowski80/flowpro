<template>
  <div class="min-h-screen bg-neutral-50">
    <!-- Hero Section -->
    <section class="bg-flowpro text-white py-20">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-headline mb-4">
          {{ greeting }}, Welcome to FlowPro Plumbing!
        </h1>
        <p class="text-xl mb-8">
          {{ currentMessage }}
        </p>
        <a href="#booking" class="btn-primary text-lg">
          🚀 Book Your Service Now
        </a>
      </div>
    </section>
    
    <!-- Stats Section -->
    <section class="py-12 bg-white">
      <div class="container mx-auto px-4">
        <div class="grid md:grid-cols-4 gap-8 text-center">
          <div 
            v-for="stat in stats" 
            :key="stat.label"
            class="p-4"
          >
            <div class="text-3xl mb-2">{{ stat.icon }}</div>
            <div class="text-2xl font-bold text-flowpro mb-1">{{ stat.value }}</div>
            <div class="text-sm text-neutral-600">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Features Section -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-4">Why Choose FlowPro?</h2>
        <p class="text-body text-center mb-12 max-w-2xl mx-auto">
          Professional plumbing services you can trust, with transparent pricing and guaranteed satisfaction
        </p>
        <div class="grid md:grid-cols-3 gap-8">
          <div 
            v-for="feature in features" 
            :key="feature.title"
            class="text-center p-6 bg-white rounded-lg shadow-md"
          >
            <div class="text-4xl mb-4">{{ feature.icon }}</div>
            <h3 class="text-xl font-semibold mb-2">{{ feature.title }}</h3>
            <p class="text-neutral-600">{{ feature.description }}</p>
            <a href="#" class="text-flowpro hover:text-flowpro-dark mt-4 inline-block">
              Learn more →
            </a>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Emergency Section -->
    <section class="py-16 bg-flowpro-light">
      <div class="container mx-auto px-4 text-center">
        <div class="text-5xl mb-4">🚨</div>
        <h2 class="text-3xl font-bold mb-4">Plumbing Emergency?</h2>
        <p class="text-body mb-8 max-w-2xl mx-auto">
          Don't wait! Our emergency team is available 24/7 for urgent repairs
        </p>
        <div class="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
          <div class="text-2xl font-bold text-flowpro mb-2">
            📞 Call Emergency Line: (555) 123-4567
          </div>
        </div>
      </div>
    </section>
  </div>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue'

const greeting = ref('Hello')
const currentTime = ref(new Date())

const currentMessage = computed(() => {
  const hour = currentTime.value.getHours()
  if (hour < 12) return 'Good morning! Ready to start your day?'
  if (hour < 17) return 'Good afternoon! Perfect time for plumbing projects!'
  return 'Good evening! Emergency services available 24/7!'
})

const updateTime = () => {
  currentTime.value = new Date()
}

// Store references for cleanup
let timeInterval = null
let greetingTimeout = null

onMounted(() => {
  // Update time every minute
  timeInterval = setInterval(updateTime, 60000)
  
  // Change greeting after 10 seconds
  greetingTimeout = setTimeout(() => {
    greeting.value = 'Welcome'
  }, 10000)
})

onUnmounted(() => {
  // Cleanup to prevent memory leaks
  if (timeInterval) clearInterval(timeInterval)
  if (greetingTimeout) clearTimeout(greetingTimeout)
})

const features = ref([
  {
    icon: '🔧',
    title: 'Expert Repairs',
    description: 'Licensed professionals with 10+ years experience'
  },
  {
    icon: '⚡',
    title: 'Fast Response',
    description: '24/7 emergency service within 60 minutes'
  },
  {
    icon: '💰',
    title: 'Fair Pricing',
    description: 'Transparent quotes with no hidden fees'
  }
])

const stats = ref([
  {
    icon: '🏆',
    value: '500+',
    label: 'Happy Customers'
  },
  {
    icon: '⭐',
    value: '4.9',
    label: 'Average Rating'
  },
  {
    icon: '🔧',
    value: '10+',
    label: 'Years Experience'
  },
  {
    icon: '🚀',
    value: '24/7',
    label: 'Emergency Service'
  }
])
</script>



<style scoped>
/* Component-specific styles - container handled by Tailwind */
</style>