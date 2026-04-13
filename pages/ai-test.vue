<template>
  <div class="ai-test-container">
    <!-- Animated Background -->
    <div class="animated-bg"></div>
    
    <!-- Main Content -->
    <div class="container mx-auto px-4 py-8 relative z-10">
      <!-- Compact Header -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center gap-3 mb-4">
          <div class="ai-pulse"></div>
          <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            FlowPro AI Test Lab
          </h1>
          <div class="ai-pulse"></div>
        </div>
        <p class="text-gray-600 max-w-2xl mx-auto">
          Experience the intelligence behind our plumbing detection system
        </p>
      </div>

      <!-- Compact Test Interface -->
      <div class="max-w-4xl mx-auto">
        <!-- Input Card -->
        <div class="glass-card mb-6">
          <div class="flex items-center gap-3 mb-4">
            <div class="icon-wrapper bg-gradient-to-r from-blue-500 to-purple-500">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <div class="flex-1">
              <h2 class="text-lg font-bold text-gray-800">Describe Your Plumbing Issue</h2>
              <p class="text-xs text-gray-500">Type naturally, like you would talk to a plumber</p>
            </div>
          </div>
          
          <textarea
            v-model="customerText"
            @input="analyzeText"
            placeholder="e.g., 'I smell gas in my living room and have a leaky faucet. Oh, and the pipe burst in the basement!'"
            class="w-full h-32 p-4 bg-white/70 backdrop-blur border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none resize-none transition-all"
          ></textarea>
          
          <div class="flex items-center justify-between mt-3">
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full" :class="customerText.length > 0 ? 'bg-green-500 animate-pulse' : 'bg-gray-300'"></div>
              <span class="text-xs text-gray-600">{{ customerText.length }} characters</span>
            </div>
            <button
              v-if="customerText"
              @click="clearInput"
              class="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full transition"
            >
              Clear
            </button>
          </div>
        </div>

        <!-- Quick Examples - Horizontal Scroll -->
        <div class="glass-card mb-6">
          <div class="flex items-center gap-3 mb-4">
            <div class="icon-wrapper bg-gradient-to-r from-green-500 to-teal-500">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h2 class="text-lg font-bold text-gray-800">Quick Test Scenarios</h2>
          </div>
          
          <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide flex-wrap">
            <button
              v-for="(example, idx) in testExamples"
              :key="idx"
              @click="loadExample(example.text)"
              class="h-full p-2 bg-white/80 backdrop-blur border-2 border-gray-200 hover:border-purple-500 hover:bg-purple-50 rounded-lg transition-colors hover:scale-105 min-w-[180px] max-w-[200px]"
            >
              <div class="flex items-center gap-1 mb-1">
                <span class="text-sm">{{ example.icon }}</span>
                <span class="font-semibold text-xs text-gray-800">{{ example.name }}</span>
              </div>
              <p class="text-xs text-gray-600">{{ example.text }}</p>
            </button>
          </div>
        </div>

        <!-- AI Results - Animated Entry -->
        <transition name="slide-up" appear>
          <div v-if="aiResult" class="glass-card">
            <!-- Results Header -->
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-3">
                <div class="ai-pulse-lg"></div>
                <h2 class="text-xl font-bold text-gray-800">AI Analysis Complete</h2>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-xs text-gray-500">Issues Found</span>
                <span class="text-xs font-bold text-gray-700">{{ aiResult.totalIssues || 0 }}</span>
              </div>
            </div>

            <!-- Issues Detected -->
            <div v-if="aiResult.totalIssues > 0" class="space-y-4">
              <!-- Immediate Priority Card -->
              <div v-if="aiResult.groupedIssues?.IMMEDIATE?.length > 0" class="issue-card immediate">
                <div class="flex items-center gap-2 mb-3">
                  <div class="issue-icon-sm bg-gradient-to-r from-red-500 to-orange-500">
                    <span class="text-lg">🚨</span>
                  </div>
                  <h3 class="text-base font-bold text-red-700">IMMEDIATE ATTENTION REQUIRED</h3>
                  <span class="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full font-semibold">
                    {{ aiResult.groupedIssues.IMMEDIATE.length }} issue{{ aiResult.groupedIssues.IMMEDIATE.length > 1 ? 's' : '' }}
                  </span>
                </div>
                <div class="space-y-2">
                  <div 
                    v-for="(issue, index) in aiResult.groupedIssues.IMMEDIATE" 
                    :key="index"
                    class="flex items-start gap-2 p-2 bg-red-50 rounded-lg"
                  >
                    <span class="text-sm font-bold text-gray-800">{{ getCategoryName(issue.category) }}</span>
                    <span class="text-xs text-gray-500">{{ issue.keyword }}</span>
                    <span class="text-xs text-gray-400">({{ Math.round(issue.confidence * 100) }}%)</span>
                  </div>
                </div>
              </div>

              <!-- Same Day Priority Card -->
              <div v-if="aiResult.groupedIssues?.SAME_DAY?.length > 0" class="issue-card same-day">
                <div class="flex items-center gap-2 mb-3">
                  <div class="issue-icon-sm bg-gradient-to-r from-amber-500 to-yellow-500">
                    <span class="text-lg">⚡</span>
                  </div>
                  <h3 class="text-base font-bold text-amber-700">SAME DAY SERVICE</h3>
                  <span class="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-full font-semibold">
                    {{ aiResult.groupedIssues.SAME_DAY.length }} issue{{ aiResult.groupedIssues.SAME_DAY.length > 1 ? 's' : '' }}
                  </span>
                </div>
                <div class="space-y-2">
                  <div 
                    v-for="(issue, index) in aiResult.groupedIssues.SAME_DAY" 
                    :key="index"
                    class="flex items-start gap-2 p-2 bg-amber-50 rounded-lg"
                  >
                    <span class="text-sm font-bold text-gray-800">{{ getCategoryName(issue.category) }}</span>
                    <span class="text-xs text-gray-500">{{ issue.keyword }}</span>
                    <span class="text-xs text-gray-400">({{ Math.round(issue.confidence * 100) }}%)</span>
                  </div>
                </div>
              </div>

              <!-- Schedule Priority Card -->
              <div v-if="aiResult.groupedIssues?.SCHEDULE?.length > 0" class="issue-card schedule">
                <div class="flex items-center gap-2 mb-3">
                  <div class="issue-icon-sm bg-gradient-to-r from-blue-500 to-indigo-500">
                    <span class="text-lg">📅</span>
                  </div>
                  <h3 class="text-base font-bold text-blue-700">SCHEDULED SERVICE</h3>
                  <span class="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">
                    {{ aiResult.groupedIssues.SCHEDULE.length }} issue{{ aiResult.groupedIssues.SCHEDULE.length > 1 ? 's' : '' }}
                  </span>
                </div>
                <div class="space-y-2">
                  <div 
                    v-for="(issue, index) in aiResult.groupedIssues.SCHEDULE" 
                    :key="index"
                    class="flex items-start gap-2 p-2 bg-blue-50 rounded-lg"
                  >
                    <span class="text-sm font-bold text-gray-800">{{ getCategoryName(issue.category) }}</span>
                    <span class="text-xs text-gray-500">{{ issue.keyword }}</span>
                    <span class="text-xs text-gray-400">({{ Math.round(issue.confidence * 100) }}%)</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- No Detection -->
            <div v-else class="text-center py-8">
              <div class="text-4xl mb-3">🤔</div>
              <p class="text-gray-600">No specific plumbing issues detected</p>
              <p class="text-sm text-gray-500 mt-2">Try providing more details about the problem</p>
            </div>
          </div>
        </transition>

        <!-- Debug Toggle -->
        <div class="text-center mt-6">
          <button
            @click="showDebug = !showDebug"
            class="text-xs px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition"
          >
            {{ showDebug ? 'Hide' : 'Show' }} Debug Info
          </button>
        </div>

        <!-- Debug Panel -->
        <transition name="slide-down">
          <div v-if="showDebug && aiResult" class="glass-card">
            <h3 class="text-sm font-bold text-gray-700 mb-3">🔧 Debug: Raw AI Output</h3>
            <pre class="text-xs bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">{{ JSON.stringify(aiResult, null, 2) }}</pre>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { suggestJobType } from '~/utils/ai/aiBasicLearner.js'

const customerText = ref('')
const aiResult = ref(null)
const showDebug = ref(false)

const testExamples = [
  {
    name: '🚨 Gas + Burst + Faucet',
    text: 'I smell gas in my living room and have a leaky faucet. Oh, and the pipe burst in the basement!',
    icon: '🚨'
  },
  {
    name: '🚨 Double Emergency',
    text: 'I smell gas in the kitchen and the main water pipe just burst in the garage! Water is flooding everywhere!',
    icon: '🚨'
  },
  {
    name: '🚨 Gas + Frozen Pipes',
    text: 'I smell gas near the furnace and my pipes are frozen. No water is coming out at all!',
    icon: '🚨'
  },
  {
    name: '💧 Burst Pipe Only',
    text: 'A pipe burst in the basement and water is everywhere. I already shut off the main valve.',
    icon: '💧'
  },
  {
    name: '💧 Water Damage Emergency',
    text: 'Water is pouring through the ceiling from an upstairs bathroom. The ceiling is sagging!',
    icon: '💧'
  },
  {
    name: '💧 Main Water Break',
    text: 'The main water line broke outside my house. Water is flooding the yard and basement.',
    icon: '�'
  },
  {
    name: '🔥 Water Heater Issue',
    text: 'My water heater is not working and there is no hot water. I think it might be leaking.',
    icon: '🔥'
  },
  {
    name: '🔥 Water Heater Emergency',
    text: 'My water heater exploded and hot water is flooding the garage. The pilot light went out too!',
    icon: '🔥'
  },
  {
    name: '🚰 Leaky Faucet Only',
    text: 'My kitchen has a leaky faucet that keeps dripping all night.',
    icon: '🚰'
  },
  {
    name: '🚰 Multiple Fixtures',
    text: 'Both my kitchen and bathroom faucets are leaking. Also the toilet keeps running.',
    icon: '🚰'
  },
  {
    name: '🚽 Sewer Backup',
    text: 'Sewage is backing up into my shower and multiple drains are clogged. The smell is terrible!',
    icon: '🚽'
  },
  {
    name: '🚽 Drain Emergency',
    text: 'All drains in the house are backing up. Water is coming up through the shower and tub!',
    icon: '🚽'
  },
  {
    name: '🔄 Running Toilet',
    text: 'My toilet keeps running and wont stop. I tried jiggling the handle but it still runs.',
    icon: '🔄'
  },
  {
    name: '🔄 Multiple Toilet Issues',
    text: 'Both toilets in my house are running and wont stop flushing. Water is overflowing!',
    icon: '🔄'
  },
  {
    name: '🔍 Low Water Pressure',
    text: 'I have very low water pressure in the whole house. Sometimes no water comes out at all.',
    icon: '🔍'
  },
  {
    name: '🔍 Multiple Issues',
    text: 'My water pressure is low, the faucet is dripping, and the toilet makes strange noises.',
    icon: '🔍'
  }
]

const CATEGORY_INFO = {
  gas_line_services: {
    name: 'Gas Line Services',
    description: 'Gas leak detected - this is a safety emergency',
    priority: 'IMMEDIATE'
  },
  emergency_plumbing: {
    name: 'Emergency Plumbing',
    description: 'Burst pipe or major water emergency detected',
    priority: 'IMMEDIATE'
  },
  water_heater_services: {
    name: 'Water Heater Services',
    description: 'Water heater issue detected',
    priority: 'SAME_DAY'
  },
  drain_cleaning_sewer: {
    name: 'Drain Cleaning & Sewer',
    description: 'Clogged drain or sewer backup detected',
    priority: 'SAME_DAY'
  },
  bathroom_kitchen_fixtures: {
    name: 'Bathroom & Kitchen Fixtures',
    description: 'Faucet or fixture repair needed',
    priority: 'SCHEDULE'
  },
  plumbing_repairs: {
    name: 'Plumbing Repairs',
    description: 'General plumbing repair needed',
    priority: 'SCHEDULE'
  },
  maintenance_inspection: {
    name: 'Maintenance & Inspection',
    description: 'Preventive maintenance or inspection recommended',
    priority: 'SCHEDULE'
  },
  outdoor_drainage: {
    name: 'Outdoor Drainage',
    description: 'Outdoor drainage or grading issue',
    priority: 'SCHEDULE'
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

const getPriorityBadgeClass = (category) => {
  const priority = getPriorityLabel(category)
  const classes = {
    'IMMEDIATE': 'bg-gradient-to-r from-red-600 to-orange-600',
    'SAME_DAY': 'bg-gradient-to-r from-amber-600 to-yellow-600',
    'SCHEDULE': 'bg-gradient-to-r from-blue-600 to-indigo-600'
  }
  return classes[priority] || 'bg-gray-600'
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

const clearInput = () => {
  customerText.value = ''
  aiResult.value = null
}
</script>

<style scoped>
.ai-test-container {
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

/* Animated Background */
.animated-bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #fecfef 75%, #fecfef 100%);
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
  z-index: 0;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Glass Card Effect */
.glass-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.glass-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

/* Icon Wrapper */
.icon-wrapper {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* AI Pulse Animation */
.ai-pulse {
  width: 12px;
  height: 12px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.ai-pulse-lg {
  width: 16px;
  height: 16px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.7; }
}

/* Issue Card */
.issue-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.issue-card.secondary {
  padding: 16px;
  border: 2px solid rgba(59, 130, 246, 0.3);
  background: linear-gradient(135deg, rgba(239, 246, 255, 0.9), rgba(219, 234, 254, 0.7));
}

.issue-card.immediate {
  border: 2px solid rgba(239, 68, 68, 0.4);
  background: linear-gradient(135deg, rgba(254, 226, 226, 0.95), rgba(252, 165, 165, 0.8));
}

.issue-card.same-day {
  border: 2px solid rgba(245, 158, 11, 0.4);
  background: linear-gradient(135deg, rgba(254, 243, 199, 0.95), rgba(253, 186, 116, 0.8));
}

.issue-card.schedule {
  border: 2px solid rgba(59, 130, 246, 0.4);
  background: linear-gradient(135deg, rgba(239, 246, 255, 0.95), rgba(191, 219, 254, 0.8));
}

.issue-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.issue-icon-sm {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
}

/* Priority Display */
.priority-display {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

/* Scrollbar Hide */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Line Clamp */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  line-clamp: 1;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-clamp: 2;
  overflow: hidden;
}

/* Transitions */
.slide-up-enter-active {
  transition: all 0.5s ease-out;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.slide-down-enter-active {
  transition: all 0.3s ease-out;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

/* Responsive */
@media (max-width: 768px) {
  .ai-test-container {
    padding: 1rem 0;
  }
  
  .glass-card {
    padding: 16px;
  }
  
  .icon-wrapper {
    width: 32px;
    height: 32px;
  }
}
</style>
