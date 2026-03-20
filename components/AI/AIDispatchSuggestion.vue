<template>
  <div class="ai-dispatch-suggestion">
    <div v-if="suggestion && suggestion.category" class="bg-white rounded-lg shadow-lg p-8">
      <!-- Primary Issue Header -->
      <div class="mb-8 pb-8 border-b-2 border-gray-200">
        <div class="flex items-start justify-between mb-4">
          <div>
            <h2 class="text-3xl font-bold mb-2">{{ getCategoryName(suggestion.category) }}</h2>
            <p class="text-gray-600">{{ getCategoryDescription(suggestion.category) }}</p>
          </div>
          <PriorityBadge :category="suggestion.category" />
        </div>

        <!-- Confidence Meter -->
        <div class="flex items-center gap-4">
          <span class="text-sm font-semibold text-gray-600">Detection Confidence:</span>
          <div class="flex-1 bg-gray-200 rounded-full h-3">
            <div
              class="bg-blue-600 h-3 rounded-full transition-all"
              :style="{ width: (suggestion.confidence * 100) + '%' }"
            ></div>
          </div>
          <span class="text-sm font-bold">{{ Math.round(suggestion.confidence * 100) }}%</span>
        </div>
      </div>

      <!-- Safety Instructions -->
      <div v-if="getSafetyInstructions(suggestion.category).length > 0" class="mb-8 bg-yellow-50 rounded-lg p-6 border-l-4 border-yellow-500">
        <h3 class="font-bold text-lg mb-4 flex items-center gap-2">
          <span class="text-2xl">⚠️</span> Safety Instructions
        </h3>
        <ul class="space-y-3">
          <li v-for="instruction in getSafetyInstructions(suggestion.category)" :key="instruction" class="flex items-start gap-3">
            <span class="text-yellow-600 font-bold text-lg">•</span>
            <span class="text-gray-700">{{ instruction }}</span>
          </li>
        </ul>
      </div>

      <!-- Secondary Issues -->
      <div v-if="suggestion.secondary && suggestion.secondary.length > 0" class="mb-8">
        <h3 class="text-xl font-bold mb-4">Other Issues Found ({{ suggestion.secondary.length }})</h3>
        <div class="space-y-4">
          <div
            v-for="(issue, idx) in suggestion.secondary"
            :key="idx"
            class="bg-gray-50 rounded-lg p-4 border-l-4 border-gray-400"
          >
            <h4 class="font-bold text-lg mb-2">{{ getCategoryName(issue.category) }}</h4>
            <p class="text-gray-600 text-sm mb-2">{{ getCategoryDescription(issue.category) }}</p>
            <div class="flex items-center gap-2">
              <span class="text-xs font-semibold text-gray-500">Priority:</span>
              <span class="text-xs font-bold px-2 py-1 rounded bg-gray-200">{{ getPriorityLabel(issue.category) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Response Time & Next Steps -->
      <div class="bg-green-50 rounded-lg p-6 border-l-4 border-green-500">
        <h3 class="font-bold text-lg mb-4 flex items-center gap-2">
          <span class="text-2xl">✓</span> What Happens Next
        </h3>
        <div class="space-y-3">
          <p class="text-gray-700">
            A dispatcher will review your request and contact you to confirm details and schedule service.
          </p>
          <div class="bg-white rounded p-4 border border-green-300">
            <p class="text-sm text-gray-600 mb-1">Estimated Response Time:</p>
            <p class="text-lg font-bold text-green-700">{{ getResponseTime(suggestion.category) }}</p>
          </div>
          <p class="text-sm text-gray-600">
            Keep your phone nearby. Have your address and any additional details ready for the dispatcher.
          </p>
        </div>
      </div>
    </div>

    <!-- No Suggestion State -->
    <div v-else class="bg-gray-50 rounded-lg p-8 text-center">
      <p class="text-gray-500 text-lg">No plumbing issue detected yet</p>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import PriorityBadge from './PriorityBadge.vue'

defineProps({
  suggestion: {
    type: Object,
    default: null
  }
})

const CATEGORY_INFO = {
  gas_line_services: {
    name: 'Gas Line Services',
    description: 'Gas leak detected - this is a safety emergency',
    priority: 'IMMEDIATE',
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
    priority: 'IMMEDIATE',
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
    priority: 'SAME_DAY',
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
    priority: 'SAME_DAY',
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
    priority: 'SCHEDULE',
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
    priority: 'SCHEDULE',
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
    priority: 'SCHEDULE',
    safetyInstructions: [],
    responseTime: 'Within 5-7 days'
  },
  outdoor_drainage: {
    name: 'Outdoor Drainage',
    description: 'Outdoor drainage or grading issue',
    priority: 'SCHEDULE',
    safetyInstructions: [],
    responseTime: 'Within 5-7 days'
  }
}

const getCategoryName = (category) => {
  return CATEGORY_INFO[category]?.name || category
}

const getCategoryDescription = (category) => {
  return CATEGORY_INFO[category]?.description || 'Plumbing service needed'
}

const getPriorityLabel = (category) => {
  return CATEGORY_INFO[category]?.priority || 'UNKNOWN'
}

const getSafetyInstructions = (category) => {
  return CATEGORY_INFO[category]?.safetyInstructions || []
}

const getResponseTime = (category) => {
  return CATEGORY_INFO[category]?.responseTime || 'Within 24 hours'
}
</script>

<style scoped>
.ai-dispatch-suggestion {
  width: 100%;
}
</style>
