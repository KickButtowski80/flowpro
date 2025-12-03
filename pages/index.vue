<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section class="bg-blue-600 text-white py-20">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl font-bold mb-4">
          {{ greeting }}, Welcome to FlowPro Plumbing!
        </h1>
        <p class="text-xl mb-8">
          {{ currentMessage }}
        </p>
        <button class="btn-primary text-lg">
          Book Your Service Now
        </button>
      </div>
    </section>
    
    <!-- Features Section -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12">Why Choose FlowPro?</h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div 
            v-for="feature in features" 
            :key="feature.title"
            class="text-center p-6 bg-white rounded-lg shadow-md"
          >
            <div class="text-4xl mb-4">{{ feature.icon }}</div>
            <h3 class="text-xl font-semibold mb-2">{{ feature.title }}</h3>
            <p class="text-gray-600">{{ feature.description }}</p>
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

onMounted(() => {
  // Update time every minute
  setInterval(updateTime, 60000)
  
  // Change greeting after 10 seconds
  setTimeout(() => {
    greeting.value = 'Welcome'
  }, 10000)
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
</script>



<style scoped>
/* Component-specific styles can use regular CSS */
.container {
  max-width: 1200px;
}
</style>