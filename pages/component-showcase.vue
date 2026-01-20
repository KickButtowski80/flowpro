<template>
  <div class="component-showcase">
    <!-- Hero Section -->
    <BaseCard variant="elevated" class="hero-card">
      <template #header>
        <h1 class="text-4xl font-bold text-center">🧩 Component Showcase</h1>
      </template>
      <div class="text-center">
        <p class="text-lg text-gray-600 mb-8">
          See your reusable components in action! Each component is self-contained but works together harmoniously.
        </p>
        <BaseButton variant="primary" size="large" @click="showAllVariants = !showAllVariants">
          {{ showAllVariants ? 'Hide' : 'Show' }} All Variants
        </BaseButton>
      </div>
    </BaseCard>

    <!-- Button Showcase -->
    <BaseCard v-if="showAllVariants">
      <template #header>
        <h2 class="text-2xl font-bold">🔘 Button Components</h2>
      </template>
      
      <div class="space-y-8">
        <!-- Variants -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Variants</h3>
          <div class="flex flex-wrap gap-4">
            <BaseButton variant="primary">Primary</BaseButton>
            <BaseButton variant="secondary">Secondary</BaseButton>
            <BaseButton variant="success">Success</BaseButton>
            <BaseButton variant="warning">Warning</BaseButton>
            <BaseButton variant="danger">Danger</BaseButton>
            <BaseButton variant="ghost">Ghost</BaseButton>
          </div>
        </div>

        <!-- Sizes -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Sizes</h3>
          <div class="flex flex-wrap gap-4 items-center">
            <BaseButton size="small">Small</BaseButton>
            <BaseButton size="medium">Medium</BaseButton>
            <BaseButton size="large">Large</BaseButton>
          </div>
        </div>

        <!-- States -->
        <div>
          <h3 class="text-lg font-semibold mb-4">States</h3>
          <div class="flex flex-wrap gap-4">
            <BaseButton>Normal</BaseButton>
            <BaseButton loading>Loading</BaseButton>
            <BaseButton disabled>Disabled</BaseButton>
            <BaseButton full-width>Full Width</BaseButton>
          </div>
        </div>
      </div>
    </BaseCard>

    <!-- Card Showcase -->
    <BaseCard>
      <template #header>
        <h2 class="text-2xl font-bold">🃏 Card Components</h2>
      </template>
      
      <div class="grid md:grid-cols-3 gap-6">
        <!-- Simple card -->
        <BaseCard>
          <h3 class="font-semibold mb-2">Simple Card</h3>
          <p class="text-gray-600">Basic card with default content.</p>
        </BaseCard>

        <!-- Card with header -->
        <BaseCard variant="elevated" hover>
          <template #header>
            <div class="flex items-center gap-2">
              <span class="text-2xl">⭐</span>
              <h3 class="font-semibold">Featured Card</h3>
            </div>
          </template>
          <p class="text-gray-600">Card with custom header and hover effect.</p>
        </BaseCard>

        <!-- Card with footer -->
        <BaseCard variant="outlined">
          <h3 class="font-semibold mb-2">Card with Actions</h3>
          <p class="text-gray-600 mb-4">Card with footer actions.</p>
          <template #footer>
            <div class="flex gap-2">
              <BaseButton size="small">Learn More</BaseButton>
            </div>
          </template>
        </BaseCard>
      </div>
    </BaseCard>

    <!-- Input Showcase -->
    <BaseCard>
      <template #header>
        <h2 class="text-2xl font-bold">📝 Input Components</h2>
      </template>
      
      <form @submit.prevent="handleFormSubmit" class="space-y-6 max-w-2xl">
        <div class="grid md:grid-cols-2 gap-6">
          <BaseInput 
            v-model="formData.name" 
            label="Full Name" 
            placeholder="Enter your name" 
            required 
            helper-text="We'll use this to personalize your experience" 
          />
          
          <BaseInput 
            v-model="formData.email" 
            label="Email Address" 
            type="email" 
            placeholder="your@email.com" 
            required 
            :error="emailError" 
            helper-text="We'll never share your email" 
          />
          
          <BaseInput 
            v-model="formData.phone" 
            label="Phone Number" 
            type="tel" 
            placeholder="(555) 123-4567" 
            helper-text="Optional, for appointment reminders"
          >
            <template #prefix>
              <span class="text-gray-500">📞</span>
            </template>
          </BaseInput>
          
          <BaseInput 
            v-model="formData.service" 
            label="Service Type" 
            placeholder="What do you need help with?" 
            readonly 
            helper-text="Select from our services page"
          >
            <template #suffix>
              <BaseButton size="small" type="button">Browse</BaseButton>
            </template>
          </BaseInput>
        </div>

        <div class="flex gap-4">
          <BaseButton type="submit" variant="primary">
            Submit Form
          </BaseButton>
          <BaseButton type="button" variant="ghost" @click="resetForm">
            Reset
          </BaseButton>
        </div>
      </form>
    </BaseCard>

    <!-- Results Display -->
    <BaseCard v-if="submittedData" variant="elevated">
      <template #header>
        <h2 class="text-2xl font-bold text-green-600">✅ Form Submitted!</h2>
      </template>
      <pre class="bg-gray-100 p-4 rounded-lg text-sm overflow-auto">{{ JSON.stringify(submittedData, null, 2) }}</pre>
    </BaseCard>
  </div>
</template>

<script setup>
const showAllVariants = ref(false)
const submittedData = ref(null)

const formData = ref({
  name: '',
  email: '',
  phone: '',
  service: ''
})

const emailError = computed(() => {
  const email = formData.value.email
  if (!email) return ''
  if (!email.includes('@')) return 'Please enter a valid email'
  return ''
})

const handleFormSubmit = () => {
  if (emailError.value) {
    alert('Please fix errors before submitting')
    return
  }
  
  submittedData.value = { ...formData.value }
  console.log('Form submitted:', submittedData.value)
}

const resetForm = () => {
  formData.value = {
    name: '',
    email: '',
    phone: '',
    service: ''
  }
  submittedData.value = null
}

useHead({
  title: 'Component Showcase - FlowPro Plumbing',
  meta: [
    { name: 'description', content: 'See our reusable Vue components in action' }
  ]
})
</script>

<style scoped>
.component-showcase {
  @apply min-h-screen bg-gray-50 py-8;
}

.component-showcase > * {
  @apply max-w-6xl mx-auto mb-8 px-4;
}

.hero-card {
  @apply text-center py-12;
}

.space-y-8 > * + * {
  @apply mt-8;
}

.grid {
  @apply grid gap-6;
}

@media (min-width: 768px) {
  .md\:grid-cols-2 {
    @apply grid-cols-2;
  }
  .md\:grid-cols-3 {
    @apply grid-cols-3;
  }
}
</style>
