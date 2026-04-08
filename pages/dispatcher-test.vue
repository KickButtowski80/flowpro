<template>
  <div class="dispatcher-test-container">
    <div class="container mx-auto px-4 py-12">
      <!-- Header -->
      <div class="mb-12">
        <h1 class="text-4xl font-bold mb-4">👨‍💼 FlowPro Dispatcher Test</h1>
        <p class="text-lg text-gray-600">
          Test the dispatcher interface - see how customer issues are analyzed and presented
        </p>
      </div>

      <!-- Two Column Layout -->
      <div class="grid md:grid-cols-2 gap-8">
        <!-- Left: Customer Input -->
        <div class="bg-white rounded-lg shadow-lg p-6">
          <h2 class="text-2xl font-bold mb-4">📞 Customer Report</h2>
          <textarea
            v-model="customerText"
            @input="analyzeIssue"
            placeholder="Paste customer description here..."
            class="w-full h-40 p-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
          ></textarea>
          
          <div class="mt-4 space-y-2">
            <p class="text-sm font-semibold text-gray-700">Quick Load:</p>
            <button
              v-for="(example, idx) in testCases"
              :key="idx"
              @click="loadTestCase(example.text)"
              class="w-full text-left p-2 text-sm bg-gray-100 hover:bg-blue-100 rounded border border-gray-300 transition"
            >
              {{ example.name }}
            </button>
          </div>
        </div>

        <!-- Right: Dispatcher View -->
        <div v-if="aiResult && aiResult.category" class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-lg p-6">
          <h2 class="text-2xl font-bold mb-6">🎯 Dispatcher Alert</h2>

          <!-- Priority Badge -->
          <div class="mb-6">
            <span :class="getPriorityClass(aiResult.category)" class="px-4 py-2 rounded-full text-white font-bold text-lg">
              {{ getPriorityLabel(aiResult.category) }}
            </span>
          </div>

          <!-- Issue Details -->
          <div class="bg-white rounded-lg p-4 mb-6 border-l-4" :style="{ borderColor: getPriorityColor(aiResult.category) }">
            <h3 class="text-xl font-bold mb-2">{{ getCategoryName(aiResult.category) }}</h3>
            <p class="text-gray-600 mb-4">{{ getCategoryDescription(aiResult.category) }}</p>
            
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p class="text-gray-500">Category ID</p>
                <p class="font-mono font-bold">{{ aiResult.category }}</p>
              </div>
              <div>
                <p class="text-gray-500">Confidence</p>
                <p class="font-bold">{{ Math.round(aiResult.confidence * 100) }}%</p>
              </div>
            </div>
          </div>

          <!-- Recommended Actions -->
          <div class="bg-white rounded-lg p-4 border-t-4" :style="{ borderColor: getPriorityColor(aiResult.category) }">
            <h4 class="font-bold mb-3">📋 Recommended Actions:</h4>
            <ul class="space-y-2 text-sm">
              <li v-for="(action, idx) in getRecommendedActions(aiResult.category)" :key="idx" class="flex items-start gap-2">
                <span class="text-green-600 font-bold">✓</span>
                <span>{{ action }}</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- No Match State -->
        <div v-else class="bg-yellow-50 rounded-lg shadow-lg p-6 border-2 border-yellow-300">
          <p class="text-lg font-semibold mb-2">🤔 No Issue Detected</p>
          <p class="text-gray-600">Enter a customer description to see dispatcher recommendations.</p>
        </div>
      </div>

      <!-- Debug Section -->
      <div class="mt-12 bg-gray-900 text-gray-100 p-6 rounded-lg font-mono text-xs">
        <p class="font-bold mb-4">🔧 Debug: Raw AI Output</p>
        <pre class="overflow-x-auto">{{ JSON.stringify(aiResult, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { suggestJobType } from '~/utils/ai/aiBasicLearner.js'

const customerText = ref('')
const aiResult = ref(null)

const testCases = [
  {
    name: '🚨 Gas Leak (IMMEDIATE)',
    text: 'I smell gas in my living room and I am feeling dizzy'
  },
  {
    name: '💧 Burst Pipe (IMMEDIATE)',
    text: 'The pipe has burst in my basement and water is everywhere!'
  },
  {
    name: '🚽 Sewer Backup (SAME_DAY)',
    text: 'Sewage is backing up into my shower and multiple drains are clogged'
  },
  {
    name: '🔥 Water Heater (SAME_DAY)',
    text: 'My water heater is not working and there is no hot water'
  },
  {
    name: '🚰 Leaky Faucet (SCHEDULE)',
    text: 'My kitchen faucet has been dripping for days'
  },
  {
    name: '⚠️ Multi-Issue (COMPLEX)',
    text: 'I smell gas in my living room and have a leaky faucet. Oh, and the pipe burst in the basement!'
  }
]

const CATEGORY_INFO = {
  gas_line_services: {
    name: 'Gas Line Services',
    priority: 'IMMEDIATE',
    color: '#dc2626',
    description: 'Gas leak detected - potential safety hazard',
    actions: [
      'Evacuate building immediately',
      'Do not use electrical switches or open flames',
      'Call emergency services (911)',
      'Dispatch emergency gas technician',
      'Notify customer of arrival time'
    ]
  },
  emergency_plumbing: {
    name: 'Emergency Plumbing',
    priority: 'IMMEDIATE',
    color: '#ea580c',
    description: 'Burst pipe or major water emergency',
    actions: [
      'Dispatch emergency plumber immediately',
      'Advise customer to shut off main water valve',
      'Assess water damage potential',
      'Arrange for water extraction if needed',
      'Notify insurance company'
    ]
  },
  water_heater_services: {
    name: 'Water Heater Services',
    priority: 'SAME_DAY',
    color: '#f59e0b',
    description: 'Water heater malfunction or failure',
    actions: [
      'Schedule same-day appointment',
      'Assess if replacement or repair needed',
      'Check warranty status',
      'Prepare customer for cost estimate',
      'Arrange installation if needed'
    ]
  },
  drain_cleaning_sewer: {
    name: 'Drain Cleaning & Sewer',
    priority: 'SAME_DAY',
    color: '#f59e0b',
    description: 'Clogged drains or sewer backup',
    actions: [
      'Schedule same-day or next-day service',
      'Determine if main line or branch line',
      'Prepare hydro-jetting equipment',
      'Advise customer to avoid using drains',
      'Estimate service time and cost'
    ]
  },
  bathroom_kitchen_fixtures: {
    name: 'Bathroom & Kitchen Fixtures',
    priority: 'SCHEDULE',
    color: '#3b82f6',
    description: 'Faucet, toilet, or fixture repair',
    actions: [
      'Schedule appointment within 3-5 days',
      'Identify fixture type and issue',
      'Prepare replacement parts',
      'Provide cost estimate',
      'Confirm appointment with customer'
    ]
  },
  plumbing_repairs: {
    name: 'Plumbing Repairs',
    priority: 'SCHEDULE',
    color: '#3b82f6',
    description: 'General plumbing repair needed',
    actions: [
      'Schedule appointment within 3-5 days',
      'Assess repair scope',
      'Prepare tools and materials',
      'Provide cost estimate',
      'Confirm appointment details'
    ]
  },
  maintenance_inspection: {
    name: 'Maintenance & Inspection',
    priority: 'SCHEDULE',
    color: '#10b981',
    description: 'Preventive maintenance or inspection',
    actions: [
      'Schedule routine inspection',
      'Prepare inspection checklist',
      'Identify potential issues',
      'Provide maintenance recommendations',
      'Schedule follow-up if needed'
    ]
  },
  outdoor_drainage: {
    name: 'Outdoor Drainage',
    priority: 'SCHEDULE',
    color: '#10b981',
    description: 'Outdoor drainage or grading issue',
    actions: [
      'Schedule site assessment',
      'Evaluate drainage patterns',
      'Prepare drainage solution options',
      'Provide cost estimate',
      'Schedule installation if approved'
    ]
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

const getPriorityClass = (category) => {
  const priority = CATEGORY_INFO[category]?.priority
  const classes = {
    'IMMEDIATE': 'bg-red-600',
    'SAME_DAY': 'bg-amber-600',
    'SCHEDULE': 'bg-blue-600'
  }
  return classes[priority] || 'bg-gray-600'
}

const getPriorityColor = (category) => {
  return CATEGORY_INFO[category]?.color || '#6b7280'
}

const getRecommendedActions = (category) => {
  return CATEGORY_INFO[category]?.actions || ['Assess customer needs', 'Provide quote', 'Schedule appointment']
}

const analyzeIssue = () => {
  if (!customerText.value.trim()) {
    aiResult.value = null
    return
  }
  aiResult.value = suggestJobType(customerText.value)
}

const loadTestCase = (text) => {
  customerText.value = text
  analyzeIssue()
}
</script>

<style scoped>
.dispatcher-test-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f4f8 0%, #d9e2ec 100%);
}
</style>
