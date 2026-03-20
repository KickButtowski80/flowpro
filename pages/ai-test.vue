<template>
  <div class="ai-test-container">
    <div class="container mx-auto px-4 py-12">
      <!-- Header -->
      <div class="mb-12">
        <h1 class="text-4xl font-bold mb-4">🤖 FlowPro Customer AI Test</h1>
        <p class="text-lg text-gray-600">
          Test how the AI detects plumbing issues from customer descriptions
        </p>
      </div>

      <!-- Test Input Section -->
      <div class="grid md:grid-cols-2 gap-8 mb-12">
        <!-- Input -->
        <div class="bg-white rounded-lg shadow-lg p-6">
          <h2 class="text-2xl font-bold mb-4">📝 Describe Your Issue</h2>
          <textarea
            v-model="customerText"
            @input="analyzeText"
            placeholder="Type your plumbing issue here... e.g., 'I smell gas in my living room and have a leaky faucet. Oh, and the pipe burst in the basement!'"
            class="w-full h-48 p-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
          ></textarea>
          <p class="text-sm text-gray-500 mt-2">{{ customerText.length }} characters</p>
        </div>

        <!-- Quick Examples -->
        <div class="bg-blue-50 rounded-lg shadow-lg p-6">
          <h2 class="text-2xl font-bold mb-4">⚡ Quick Examples</h2>
          <div class="space-y-2">
            <button
              v-for="(example, idx) in testExamples"
              :key="idx"
              @click="loadExample(example.text)"
              class="w-full text-left p-3 bg-white rounded border-2 border-blue-200 hover:border-blue-500 hover:bg-blue-100 transition"
            >
              <p class="font-semibold text-sm">{{ example.name }}</p>
              <p class="text-xs text-gray-600">{{ example.text.substring(0, 50) }}...</p>
            </button>
          </div>
        </div>
      </div>

      <!-- AI Analysis Results -->
      <div v-if="aiResult" class="bg-white rounded-lg shadow-lg p-8">
        <h2 class="text-2xl font-bold mb-6">🎯 AI Analysis Results</h2>

        <!-- Primary Issue -->
        <div v-if="aiResult.category" class="mb-8">
          <div class="flex items-center gap-4 mb-4">
            <div class="text-4xl">🚨</div>
            <div>
              <h3 class="text-xl font-bold">{{ getCategoryName(aiResult.category) }}</h3>
              <p class="text-gray-600">Primary Issue Detected</p>
            </div>
          </div>
          <div class="bg-gray-50 p-4 rounded border-l-4 border-red-500">
            <p class="text-sm"><strong>Category:</strong> {{ aiResult.category }}</p>
            <p class="text-sm"><strong>Confidence:</strong> {{ Math.round(aiResult.confidence * 100) }}%</p>
          </div>
        </div>

        <!-- No Match -->
        <div v-else class="bg-yellow-50 p-6 rounded border-2 border-yellow-300">
          <p class="text-lg">🤔 No specific plumbing issues detected. Please provide more details about the problem.</p>
        </div>
      </div>

      <!-- Debug Info -->
      <div class="mt-8 bg-gray-100 p-4 rounded text-xs font-mono text-gray-700">
        <p><strong>Debug:</strong> Raw AI Result</p>
        <pre>{{ JSON.stringify(aiResult, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { suggestJobType } from '~/utils/ai/aiBasicLearner.js'

const customerText = ref('')
const aiResult = ref(null)

const testExamples = [
  {
    name: 'Gas + Burst + Faucet',
    text: 'I smell gas in my living room and have a leaky faucet. Oh, and the pipe burst in the basement!'
  },
  {
    name: 'Burst Pipe Only',
    text: 'A pipe burst in the basement and water is everywhere'
  },
  {
    name: 'Leaky Faucet Only',
    text: 'My kitchen has a leaky faucet that keeps dripping'
  },
  {
    name: 'Water Heater Issue',
    text: 'My water heater is not working and there is no hot water'
  },
  {
    name: 'Sewer Backup',
    text: 'Sewage is backing up into my shower and multiple drains are clogged'
  },
  {
    name: 'Running Toilet',
    text: 'My toilet keeps running and wont stop'
  }
]

const CATEGORY_NAMES = {
  gas_line_services: 'Gas Line Services',
  emergency_plumbing: 'Emergency Plumbing',
  water_heater_services: 'Water Heater Services',
  bathroom_kitchen_fixtures: 'Bathroom & Kitchen Fixtures',
  drain_cleaning_sewer: 'Drain Cleaning & Sewer',
  plumbing_repairs: 'Plumbing Repairs',
  maintenance_inspection: 'Maintenance & Inspection',
  outdoor_drainage: 'Outdoor Drainage'
}

const getCategoryName = (category) => {
  return CATEGORY_NAMES[category] || category
}

const analyzeText = () => {
  if (!customerText.value.trim()) {
    aiResult.value = null
    return
  }

  aiResult.value = suggestJobType(customerText.value)
}

const loadExample = (text) => {
  customerText.value = text
  analyzeText()
}
</script>

<style scoped>
.ai-test-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}
</style>
