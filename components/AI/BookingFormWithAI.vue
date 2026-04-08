<template>
  <div class="booking-form-with-ai">
    <div class="container mx-auto px-4 py-12">
      <div class="grid md:grid-cols-2 gap-8">
        <!-- Left: Customer Input Form -->
        <div class="bg-white rounded-lg shadow-lg p-8">
          <h2 class="text-3xl font-bold mb-6">📝 Describe Your Plumbing Issue</h2>
          
          <form @submit.prevent="submitForm">
            <div class="mb-6">
              <label class="block text-lg font-semibold mb-2">What's the problem?</label>
              <textarea
                v-model="customerDescription"
                @input="analyzeIssue"
                placeholder="Tell us about your plumbing issue in detail. The more information, the better we can help..."
                class="w-full h-32 p-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
              ></textarea>
              <p class="text-sm text-gray-500 mt-2">{{ customerDescription.length }} characters</p>
            </div>

            <div class="mb-6">
              <label class="block text-lg font-semibold mb-2">Your Contact Information</label>
              <input
                v-model="customerName"
                type="text"
                placeholder="Your name"
                class="w-full p-3 border-2 border-gray-300 rounded-lg mb-3 focus:border-blue-500 focus:outline-none"
              />
              <input
                v-model="customerPhone"
                type="tel"
                placeholder="Your phone number"
                class="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition"
            >
              Submit Request
            </button>
          </form>
        </div>

        <!-- Right: AI Analysis -->
        <div v-if="aiAnalysis && aiAnalysis.category" class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-lg p-8">
          <h2 class="text-3xl font-bold mb-6">🤖 AI Analysis</h2>

          <!-- Primary Issue -->
          <div class="bg-white rounded-lg p-6 mb-6 border-l-4 border-blue-600">
            <h3 class="text-xl font-bold mb-2">{{ getCategoryName(aiAnalysis.category) }}</h3>
            <p class="text-gray-600 mb-4">{{ getCategoryDescription(aiAnalysis.category) }}</p>
            <div class="flex items-center gap-4">
              <span class="text-sm font-semibold text-gray-600">Confidence:</span>
              <div class="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  class="bg-blue-600 h-2 rounded-full"
                  :style="{ width: (aiAnalysis.confidence * 100) + '%' }"
                ></div>
              </div>
              <span class="text-sm font-bold">{{ Math.round(aiAnalysis.confidence * 100) }}%</span>
            </div>
          </div>

          <!-- Safety Instructions -->
          <div class="bg-yellow-50 rounded-lg p-6 border-l-4 border-yellow-500 mb-6">
            <h4 class="font-bold mb-3 flex items-center gap-2">
              <span class="text-xl">⚠️</span> Safety Instructions
            </h4>
            <ul class="space-y-2 text-sm">
              <li v-for="instruction in getSafetyInstructions(aiAnalysis.category)" :key="instruction" class="flex items-start gap-2">
                <span class="text-yellow-600 font-bold">•</span>
                <span>{{ instruction }}</span>
              </li>
            </ul>
          </div>

          <!-- Next Steps -->
          <div class="bg-green-50 rounded-lg p-6 border-l-4 border-green-500">
            <h4 class="font-bold mb-3 flex items-center gap-2">
              <span class="text-xl">✓</span> What Happens Next
            </h4>
            <p class="text-sm text-gray-700">
              A dispatcher will review your request and call you back within the estimated response time. 
              Keep your phone nearby and be ready to provide additional details if needed.
            </p>
            <p class="text-sm font-semibold mt-3 text-green-700">
              Estimated Response: {{ getResponseTime(aiAnalysis.category) }}
            </p>
          </div>
        </div>

        <!-- No Analysis Yet -->
        <div v-else class="bg-gray-50 rounded-lg shadow-lg p-8 flex items-center justify-center min-h-64">
          <div class="text-center">
            <p class="text-gray-500 text-lg">Describe your issue to see AI analysis</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { suggestJobType } from '~/utils/ai/aiBasicLearner.js'

const customerDescription = ref('')
const customerName = ref('')
const customerPhone = ref('')
const aiAnalysis = ref(null)

const CATEGORY_INFO = {
  gas_line_services: {
    name: 'Gas Line Services',
    description: 'Gas leak detected - this is a safety emergency',
    safetyInstructions: [
      'Evacuate the building immediately',
      'Do not use electrical switches or create sparks',
      'Do not use open flames or light matches',
      'Call 911 from outside the building',
      'Wait for emergency responders outside'
    ],
    responseTime: 'Within 15 minutes'
  },
  emergency_plumbing: {
    name: 'Emergency Plumbing',
    description: 'Burst pipe or major water emergency detected',
    safetyInstructions: [
      'Locate and shut off your main water valve immediately',
      'Turn off electricity to affected areas if safe',
      'Move valuables away from water damage areas',
      'Document damage with photos for insurance',
      'Avoid walking in standing water'
    ],
    responseTime: 'Within 30 minutes'
  },
  water_heater_services: {
    name: 'Water Heater Services',
    description: 'Water heater issue detected',
    safetyInstructions: [
      'Turn off the water heater if it is leaking',
      'Do not attempt repairs yourself',
      'Check for gas leaks if you smell rotten eggs',
      'Ensure proper ventilation in the area',
      'Keep children and pets away from the unit'
    ],
    responseTime: 'Within 24 hours'
  },
  drain_cleaning_sewer: {
    name: 'Drain Cleaning & Sewer',
    description: 'Clogged drain or sewer backup detected',
    safetyInstructions: [
      'Avoid using affected drains and toilets',
      'Do not pour chemicals down the drain',
      'Keep children and pets away from affected areas',
      'Ensure proper ventilation if odors are present',
      'Do not attempt to clear main sewer line yourself'
    ],
    responseTime: 'Within 24 hours'
  },
  bathroom_kitchen_fixtures: {
    name: 'Bathroom & Kitchen Fixtures',
    description: 'Faucet or fixture repair needed',
    safetyInstructions: [
      'Turn off water to the affected fixture if possible',
      'Place a bucket under leaks to prevent water damage',
      'Do not attempt repairs if you are unsure',
      'Keep the area dry to prevent slipping',
      'Document any water damage'
    ],
    responseTime: 'Within 3-5 days'
  },
  plumbing_repairs: {
    name: 'Plumbing Repairs',
    description: 'General plumbing repair needed',
    safetyInstructions: [
      'Locate your main water shut-off valve',
      'Turn off water if there is active leaking',
      'Place buckets under leaks to contain water',
      'Document the issue with photos',
      'Avoid using affected fixtures'
    ],
    responseTime: 'Within 3-5 days'
  },
  maintenance_inspection: {
    name: 'Maintenance & Inspection',
    description: 'Preventive maintenance or inspection recommended',
    safetyInstructions: [
      'Ensure clear access to water shut-off valve',
      'Have a list of any concerns ready',
      'Take photos of any visible issues',
      'Be present during the inspection',
      'Ask questions about recommendations'
    ],
    responseTime: 'Within 5-7 days'
  },
  outdoor_drainage: {
    name: 'Outdoor Drainage',
    description: 'Outdoor drainage or grading issue',
    safetyInstructions: [
      'Keep the area clear for assessment',
      'Document water pooling or drainage issues',
      'Note any foundation or structural concerns',
      'Keep children and pets away during work',
      'Ensure proper site access for equipment'
    ],
    responseTime: 'Within 5-7 days'
  }
}

const getCategoryName = (category) => {
  return CATEGORY_INFO[category]?.name || category
}

const getCategoryDescription = (category) => {
  return CATEGORY_INFO[category]?.description || 'Plumbing service needed'
}

const getSafetyInstructions = (category) => {
  return CATEGORY_INFO[category]?.safetyInstructions || []
}

const getResponseTime = (category) => {
  return CATEGORY_INFO[category]?.responseTime || 'Within 24 hours'
}

const analyzeIssue = () => {
  if (!customerDescription.value.trim()) {
    aiAnalysis.value = null
    return
  }
  aiAnalysis.value = suggestJobType(customerDescription.value)
}

const submitForm = () => {
  if (!customerDescription.value.trim() || !customerName.value.trim() || !customerPhone.value.trim()) {
    alert('Please fill in all fields')
    return
  }
  
  alert(`Thank you, ${customerName.value}! Your request has been submitted. A dispatcher will call you shortly at ${customerPhone.value}.`)
  
  // Reset form
  customerDescription.value = ''
  customerName.value = ''
  customerPhone.value = ''
  aiAnalysis.value = null
}
</script>

<style scoped>
.booking-form-with-ai {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}
</style>
