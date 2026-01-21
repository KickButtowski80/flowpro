<template>
  <!-- Contact Section -->
  <section :id="sectionId" class="py-24 lg:py-32 bg-neutral-50">
    <div class="container mx-auto px-4">
      <div class="mb-20 text-center">
        <h2 class="text-4xl font-black tracking-tight text-neutral-900 sm:text-5xl">{{ title }}</h2>
        <div class="mx-auto mt-6 h-1.5 w-32 rounded-full bg-gradient-to-r from-flowpro to-flowpro-accent"></div>
        <p class="text-body mx-auto mt-8 max-w-3xl text-lg">
          {{ description }}
        </p>
      </div>
      
      <div class="grid gap-16 lg:grid-cols-2">
        <!-- Contact Form -->
        <div>
          <div class="rounded-3xl bg-white p-8 shadow-card">
            <h3 class="mb-8 text-2xl font-bold text-neutral-900">{{ formTitle }}</h3>
            
            <form @submit.prevent="handleSubmit" class="space-y-6">
              <BaseInput
                v-model="formData.name"
                label="Full Name"
                placeholder="John Doe"
                required
                name="name"
                autocomplete="name"
                data-testid="contact-name"
              >
                <template #prefix>
                  <span class="text-lg">👤</span>
                </template>
              </BaseInput>
              
              <BaseInput
                v-model="formData.email"
                label="Email Address"
                type="email"
                placeholder="john@example.com"
                required
                name="email"
                autocomplete="email"
                data-testid="contact-email"
              >
                <template #prefix>
                  <span class="text-lg">📧</span>
                </template>
              </BaseInput>
              
              <BaseInput
                v-model="formData.phone"
                label="Phone Number"
                type="tel"
                placeholder="(555) 123-4567"
                required
                name="phone"
                autocomplete="tel"
                data-testid="contact-phone"
              >
                <template #prefix>
                  <span class="text-lg">📞</span>
                </template>
              </BaseInput>
              
              <BaseInput
                v-model="formData.service"
                label="Service Needed"
                placeholder="e.g., Emergency Repair, Installation"
                name="service"
                autocomplete="off"
                data-testid="contact-service"
              >
                <template #prefix>
                  <span class="text-lg">🔧</span>
                </template>
                <template #suffix>
                  <BaseButton variant="secondary" size="small" type="button">
                    Browse
                  </BaseButton>
                </template>
              </BaseInput>
              
              <div>
                <label for="message" class="input-label">Message</label>
                <textarea
                  id="message"
                  v-model="formData.message"
                  rows="4"
                  class="input-field w-full resize-none"
                  placeholder="Tell us about your plumbing needs..."
                  name="message"
                  data-testid="contact-message"
                ></textarea>
              </div>
              
              <div class="flex gap-4">
                <BaseButton 
                  type="submit" 
                  variant="primary" 
                  size="large"
                  :disabled="isSubmitting"
                  class="flex-1"
                >
                  <span v-if="isSubmitting">Sending...</span>
                  <span v-else>{{ submitButtonText }}</span>
                </BaseButton>
                
                <BaseButton 
                  type="button" 
                  variant="secondary" 
                  size="large"
                  @click="resetForm"
                >
                  Clear
                </BaseButton>
              </div>
            </form>
          </div>
        </div>
        
        <!-- Contact Information -->
        <div class="space-y-8">
          <div class="rounded-3xl bg-gradient-to-br from-flowpro to-flowpro-dark p-8 text-white">
            <h3 class="mb-8 text-2xl font-bold">{{ contactTitle }}</h3>
            
            <div class="space-y-6">
              <div class="flex items-start gap-4">
                <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                  <span class="text-xl">📞</span>
                </div>
                <div>
                  <div class="font-semibold text-white">Phone</div>
                  <div class="text-white/90">{{ phoneNumber }}</div>
                  <div class="text-white/70 text-sm">24/7 Emergency Service</div>
                </div>
              </div>
              
              <div class="flex items-start gap-4">
                <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                  <span class="text-xl">📧</span>
                </div>
                <div>
                  <div class="font-semibold text-white">Email</div>
                  <div class="text-white/90">{{ emailAddress }}</div>
                  <div class="text-white/70 text-sm">Quick response guaranteed</div>
                </div>
              </div>
              
              <div class="flex items-start gap-4">
                <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                  <span class="text-xl">📍</span>
                </div>
                <div>
                  <div class="font-semibold text-white">Address</div>
                  <div class="text-white/90">{{ address }}</div>
                  <div class="text-white/70 text-sm">Service area: {{ serviceArea }}</div>
                </div>
              </div>
              
              <div class="flex items-start gap-4">
                <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                  <span class="text-xl">🕐</span>
                </div>
                <div>
                  <div class="font-semibold text-white">Hours</div>
                  <div class="text-white/90">{{ businessHours }}</div>
                  <div class="text-white/70 text-sm">Emergency service available 24/7</div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Emergency CTA -->
          <div class="rounded-3xl bg-gradient-to-br from-red-600 to-red-800 p-8 text-white text-center">
            <div class="mb-4 text-4xl">🚨</div>
            <h4 class="mb-4 text-xl font-bold">Plumbing Emergency?</h4>
            <p class="mb-6 text-white/90">Don't wait! Call us now for immediate assistance.</p>
            <a 
              :href="`tel:${emergencyPhone}`" 
              class="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 font-black text-red-600 transition-all hover:scale-105"
            >
              <span>📞 Call Now: {{ emergencyPhone }}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
/**
 * ContactSection - Contact form and business information section
 * 
 * @component
 * @description A comprehensive contact section with form using BaseInput components and business information
 * 
 * @example
 * <ContactSection 
 *   @form-submit="handleContactSubmit"
 * />
 */

/**
 * Component props
 * @typedef {Object} ContactSectionProps
 * @property {string} [sectionId='contact'] - Section ID for navigation
 * @property {string} [title='Get Your Free Quote'] - Section title
 * @property {string} [description=''] - Section description
 * @property {string} [formTitle='Send Us a Message'] - Form title
 * @property {string} [submitButtonText='Send Message'] - Submit button text
 * @property {string} [contactTitle='Contact Information'] - Contact info title
 * @property {string} [phoneNumber='(555) 123-4567'] - Business phone
 * @property {string} [emailAddress='info@flowpro.com'] - Business email
 * @property {string} [address='123 Main St, City, State 12345'] - Business address
 * @property {string} [serviceArea='City Metro Area'] - Service area
 * @property {string} [businessHours='Mon-Fri: 8AM-6PM, Sat: 9AM-4PM'] - Business hours
 * @property {string} [emergencyPhone='5551234567'] - Emergency phone number
 */
const props = defineProps({
  sectionId: {
    type: String,
    default: 'contact'
  },
  title: {
    type: String,
    default: 'Get Your Free Quote'
  },
  description: {
    type: String,
    default: "Ready to get started? Fill out the form below and we'll get back to you within 24 hours. For emergencies, call us directly!"
  },
  formTitle: {
    type: String,
    default: 'Send Us a Message'
  },
  submitButtonText: {
    type: String,
    default: 'Send Message'
  },
  contactTitle: {
    type: String,
    default: 'Contact Information'
  },
  phoneNumber: {
    type: String,
    default: '(555) 123-4567'
  },
  emailAddress: {
    type: String,
    default: 'info@flowpro.com'
  },
  address: {
    type: String,
    default: '123 Main St, City, State 12345'
  },
  serviceArea: {
    type: String,
    default: 'City Metro Area'
  },
  businessHours: {
    type: String,
    default: 'Mon-Fri: 8AM-6PM, Sat: 9AM-4PM'
  },
  emergencyPhone: {
    type: String,
    default: '5551234567'
  }
})

/**
 * Emit events for form interactions
 */
const emit = defineEmits(['form-submit'])

/**
 * Form data and state
 */
const formData = ref({
  name: '',
  email: '',
  phone: '',
  service: '',
  message: ''
})

const isSubmitting = ref(false)

/**
 * Handle form submission
 * @param {Event} event - Submit event
 */
const handleSubmit = async (event) => {
  isSubmitting.value = true
  
  try {
    // Emit form data to parent
    emit('form-submit', { ...formData.value })
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Reset form on success
    resetForm()
    
  } catch (error) {
    console.error('Form submission error:', error)
  } finally {
    isSubmitting.value = false
  }
}

/**
 * Reset form data
 */
const resetForm = () => {
  formData.value = {
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  }
}
</script>

<style scoped>
/* Component-specific styles */
.shadow-card {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

/* Animation utilities are handled by Tailwind classes */
</style>
