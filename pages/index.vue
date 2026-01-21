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
    <section class="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">
      <!-- Background Elements -->
      <div class="absolute inset-0 bg-black/20"></div>
      <div class="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-white/10 blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-flowpro/20 blur-3xl"></div>
      <div class="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-3xl"></div>
      
      <div class="relative z-10 container mx-auto px-4 text-center">
        <div class="max-w-5xl mx-auto">
          <!-- Status Badge -->
          <div class="glass-card mb-8 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white shadow-lg">
            <span class="relative flex h-3 w-3">
              <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
              <span class="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
            </span>
            Available 24/7 • Licensed & Insured
          </div>
          
          <!-- Main Heading -->
          <h1 class="mb-8 text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-8xl">
            Professional Plumbing
            <span class="block text-blue-200">You Can Trust</span>
          </h1>
          
          <!-- Subheading -->
          <p class="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-blue-100 sm:text-2xl">
            {{ currentMessage }} Expert solutions for all your plumbing needs with transparent pricing and guaranteed satisfaction.
          </p>
          
          <!-- CTA Buttons -->
          <div class="flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
            <a href="#contact" class="group relative overflow-hidden rounded-2xl bg-white px-8 py-5 text-lg font-bold text-flowpro shadow-hero transition-all hover:scale-105 hover:shadow-2xl">
              <span class="relative z-10 flex items-center gap-3">
                <span>🚀 Get Started</span>
                <span class="transition-transform duration-300 group-hover:translate-x-2">→</span>
              </span>
            </a>
            <a href="tel:5551234567" class="glass-card flex items-center gap-3 rounded-2xl px-8 py-5 text-lg font-semibold text-white transition-all hover:bg-white/30 hover:scale-105">
              <span>📞 Call Now</span>
              <span class="text-blue-200">(555) 123-4567</span>
            </a>
          </div>
          
          <!-- Trust Indicators -->
          <div class="mt-16 grid grid-cols-3 gap-8 md:gap-16">
            <div class="text-center">
              <div class="text-3xl font-black text-white">500+</div>
              <div class="text-base font-medium text-blue-100">Happy Customers</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-black text-white">4.9</div>
              <div class="text-base font-medium text-blue-100">Star Rating</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-black text-white">24/7</div>
              <div class="text-base font-medium text-blue-100">Emergency Service</div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Services Section -->
    <section id="services" class="py-24 lg:py-32">
      <div class="container mx-auto px-4">
        <div class="mb-20 text-center">
          <h2 class="text-4xl font-black tracking-tight text-neutral-900 sm:text-5xl">Our Services</h2>
          <div class="mx-auto mt-6 h-1.5 w-32 rounded-full bg-gradient-to-r from-flowpro to-flowpro-accent"></div>
          <p class="text-body mx-auto mt-8 max-w-3xl text-lg">
            Comprehensive plumbing solutions for residential and commercial properties. No job is too big or too small.
          </p>
        </div>
        
        <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div 
            v-for="feature in features" 
            :key="feature.title"
            class="group relative overflow-hidden rounded-3xl bg-gradient-card p-8 shadow-card transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
          >
            <div class="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br from-flowpro/10 to-flowpro/5 transition-all duration-500 group-hover:scale-150"></div>
            
            <div class="relative z-10">
              <div class="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-flowpro to-flowpro-dark text-4xl shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:shadow-xl">
                {{ feature.icon }}
              </div>
              <h3 class="mb-4 text-2xl font-bold text-neutral-900">{{ feature.title }}</h3>
              <p class="text-neutral-600 leading-relaxed">{{ feature.description }}</p>
              
              <div class="mt-8 flex items-center gap-2 font-bold text-flowpro transition-colors group-hover:text-flowpro-dark">
                <span>Learn more</span>
                <span class="text-lg transition-transform duration-300 group-hover:translate-x-2">→</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Emergency Section -->
    <section id="emergency" class="py-24 lg:py-32">
      <div class="container mx-auto px-4">
        <div class="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-red-600 to-red-800 p-12 shadow-2xl md:p-20">
          <!-- Background Effects -->
          <div class="absolute inset-0 bg-black/20"></div>
          <div class="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-white/10 blur-3xl"></div>
          <div class="absolute -left-32 -bottom-32 h-96 w-96 rounded-full bg-white/5 blur-3xl"></div>
          
          <div class="relative z-10 grid items-center gap-16 lg:grid-cols-2">
            <div>
              <div class="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-4xl">
                🚨
              </div>
              <h2 class="mb-6 text-4xl font-black text-white sm:text-5xl">Plumbing Emergency?</h2>
              <p class="mb-8 text-xl text-white/90 leading-relaxed">
                Don't wait for disaster to strike. Our rapid-response team is on standby 24/7 to handle your most urgent plumbing crises.
              </p>
              
              <div class="flex flex-col gap-4 sm:flex-row">
                <a href="tel:5551234567" class="group relative overflow-hidden rounded-2xl bg-white px-8 py-4 text-lg font-black text-red-600 shadow-lg transition-all hover:scale-105 hover:shadow-xl">
                  <span class="relative z-10 flex items-center gap-3">
                    <span>📞 Emergency: (555) 123-4567</span>
                  </span>
                </a>
              </div>
            </div>
            
            <div class="glass-blue rounded-3xl p-8 backdrop-blur-lg">
              <h4 class="mb-8 text-2xl font-bold text-white">Why Choose Our Emergency Service?</h4>
              <div class="space-y-6">
                <div class="flex items-start gap-4">
                  <div class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                    <span class="text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <div class="font-semibold text-white">60-Minute Response</div>
                    <div class="text-white/80">Average arrival time in your area</div>
                  </div>
                </div>
                <div class="flex items-start gap-4">
                  <div class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                    <span class="text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <div class="font-semibold text-white">Fully Equipped</div>
                    <div class="text-white/80">We arrive ready to fix most issues on-site</div>
                  </div>
                </div>
                <div class="flex items-start gap-4">
                  <div class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                    <span class="text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <div class="font-semibold text-white">Upfront Pricing</div>
                    <div class="text-white/80">No surprise fees, transparent costs</div>
                  </div>
                </div>
                <div class="flex items-start gap-4">
                  <div class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                    <span class="text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <div class="font-semibold text-white">Licensed & Insured</div>
                    <div class="text-white/80">Fully certified professionals</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Component Showcase Section -->
    <section class="py-24 lg:py-32 bg-neutral-50">
      <div class="container mx-auto px-4">
        <div class="mb-20 text-center">
          <h2 class="text-4xl font-black tracking-tight text-neutral-900 sm:text-5xl">Component Library</h2>
          <div class="mx-auto mt-6 h-1.5 w-32 rounded-full bg-gradient-to-r from-flowpro to-flowpro-accent"></div>
          <p class="text-body mx-auto mt-8 max-w-3xl text-lg">
            Our reusable Vue components built with Nuxt 3 and Tailwind CSS. Clean, consistent, and ready for production.
          </p>
        </div>
        
        <div class="text-center">
          <BaseButton variant="primary" size="large" @click="navigateTo('/component-showcase')">
            View Component Library
          </BaseButton>
          <p class="mt-4 text-neutral-600">
            See our reusable Vue components in action with interactive demos
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const greeting = ref('Hello')
const currentTime = ref(new Date())

const currentMessage = computed(() => {
  const hour = currentTime.value.getHours()
  if (hour < 12) return 'Good morning! Your day starts right with reliable plumbing.'
  if (hour < 17) return 'Good afternoon! Perfect time to tackle those plumbing projects.'
  return 'Good evening! Emergency services available when you need us most.'
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
/* Component-specific styles */
</style>