<template>
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
          {{ statusBadge }}
        </div>
        
        <!-- Main Heading -->
        <h1 class="mb-8 text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-8xl">
          {{ mainHeading }}
          <span class="block text-blue-200">{{ subHeading }}</span>
        </h1>
        
        <!-- Subheading -->
        <p class="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-blue-100 sm:text-2xl">
          {{ greetingMessage }} {{ description }}
        </p>
        
        <!-- CTA Buttons -->
        <div class="flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
          <a 
            :href="primaryCtaLink" 
            class="group relative overflow-hidden rounded-2xl bg-white px-8 py-5 text-lg font-bold text-flowpro shadow-hero transition-all hover:scale-105 hover:shadow-2xl"
          >
            <span class="relative z-10 flex items-center gap-3">
              <span>{{ primaryCtaText }}</span>
              <span class="transition-transform duration-300 group-hover:translate-x-2">→</span>
            </span>
          </a>
          <a 
            :href="secondaryCtaLink" 
            class="glass-card flex items-center gap-3 rounded-2xl px-8 py-5 text-lg font-semibold text-white transition-all hover:bg-white/30 hover:scale-105"
          >
            <span>{{ secondaryCtaText }}</span>
            <span class="text-blue-200">{{ secondaryCtaSubtext }}</span>
          </a>
        </div>
        
        <!-- Trust Indicators -->
        <div class="mt-16 grid grid-cols-3 gap-8 md:gap-16">
          <div 
            v-for="indicator in trustIndicators" 
            :key="indicator.label"
            class="text-center"
          >
            <div class="text-3xl font-black text-white">{{ indicator.value }}</div>
            <div class="text-base font-medium text-blue-100">{{ indicator.label }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
/**
 * HeroSection - Main hero banner component
 * 
 * @component
 * @description A full-screen hero section with animated background, CTAs, and trust indicators
 * 
 * @example
 * <HeroSection 
 *   greeting-message="Good morning!"
 *   primary-cta-link="#contact"
 *   primary-cta-text="Get Started"
 *   secondary-cta-link="tel:5551234567"
 *   secondary-cta-text="Call Now"
 *   secondary-cta-subtext="(555) 123-4567"
 * />
 */

/**
 * Component props
 * @typedef {Object} HeroSectionProps
 * @property {string} [statusBadge='Available 24/7 • Licensed & Insured'] - Status badge text
 * @property {string} [mainHeading='Professional Plumbing'] - Main heading text
 * @property {string} [subHeading='You Can Trust'] - Sub heading text
 * @property {string} [greetingMessage] - Dynamic greeting message (e.g., "Good morning!")
 * @property {string} [description='Expert solutions for all your plumbing needs with transparent pricing and guaranteed satisfaction.'] - Description text
 * @property {string} [primaryCtaLink='#contact'] - Primary CTA link
 * @property {string} [primaryCtaText='🚀 Get Started'] - Primary CTA button text
 * @property {string} [secondaryCtaLink='tel:5551234567'] - Secondary CTA link
 * @property {string} [secondaryCtaText='📞 Call Now'] - Secondary CTA button text
 * @property {string} [secondaryCtaSubtext='(555) 123-4567'] - Secondary CTA subtext
 * @property {Array} [trustIndicators] - Array of trust indicator objects
 */
const props = defineProps({
  statusBadge: {
    type: String,
    default: 'Available 24/7 • Licensed & Insured'
  },
  mainHeading: {
    type: String,
    default: 'Professional Plumbing'
  },
  subHeading: {
    type: String,
    default: 'You Can Trust'
  },
  greetingMessage: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: 'Expert solutions for all your plumbing needs with transparent pricing and guaranteed satisfaction.'
  },
  primaryCtaLink: {
    type: String,
    default: '#services'
  },
  primaryCtaText: {
    type: String,
    default: '🚀 Get Started'
  },
  secondaryCtaLink: {
    type: String,
    default: 'tel:5551234567'
  },
  secondaryCtaText: {
    type: String,
    default: '📞 Call Now'
  },
  secondaryCtaSubtext: {
    type: String,
    default: '(555) 123-4567'
  },
  trustIndicators: {
    type: Array,
    default: () => [
      { value: '500+', label: 'Happy Customers' },
      { value: '4.9', label: 'Star Rating' },
      { value: '24/7', label: 'Emergency Service' }
    ]
  }
})
</script>

<style scoped>
/* Component-specific styles */
.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.bg-gradient-hero {
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%);
}

.shadow-hero {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.bg-flowpro {
  background-color: #3b82f6;
}

/* Animation classes are handled by Tailwind utilities */
</style>
