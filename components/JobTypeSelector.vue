<!-- JobTypeSelector.vue -->
<template>
  <div class="job-type-selector">
    <div class="flex items-center space-x-2 mb-3">
      <label for="job-type-selector" class="text-base sm:text-lg font-medium text-gray-700 cursor-pointer">🔧 Job Type:</label>
      <span class="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Optional</span>
    </div>
    
    <select v-model="selectedJobTypeId" @change="handleSelection"
            id="job-type-selector"
            name="job-type-selector"
            class="w-full px-3 sm:px-4 py-3 sm:py-4 text-base sm:text-lg border border-gray-300 bg-gray-50 text-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
      <option value="">Any Job Type (Show All Plumbers)</option>
      <option v-for="jobType in jobTypes" :key="jobType.id" :value="jobType.id">
        {{ jobType.name }}
      </option>
    </select>
    
    <!-- Helper text -->
    <p class="text-sm text-gray-500 mt-2">
      💡 Filter plumbers by specific job requirements, or leave empty to see all available plumbers
    </p>
    
    <div v-if="selectedJobTypeId" class="job-details mt-4 p-4 sm:p-5 bg-blue-50 rounded-lg border border-blue-200">
      <h4 class="text-lg sm:text-xl font-semibold text-blue-800">{{ getSelectedJobType().name }}</h4>
      <p class="text-base sm:text-lg text-gray-700 mt-2">{{ getSelectedJobType().description }}</p>
      <div class="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-3 text-sm sm:text-base text-gray-600 space-y-1 sm:space-y-0">
        <span>⏱️ {{ getSelectedJobType().estimatedDuration }}</span>
        <span>💰 ${{ getSelectedJobType().basePrice }} base price</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { JOB_TYPES } from '~/constants/jobTypes'

// 🎯 No props needed - component manages its own data
// 🎯 Emit event when job type is selected
const emit = defineEmits(['job-type-selected'])

// 🎯 Job type data - imported from constants
const jobTypes = ref(JOB_TYPES)

// 🎯 Selected job type ID state
const selectedJobTypeId = ref('')

// 🎯 Get selected job type details (flat structure - no variants)
const getSelectedJobType = () => {
  return jobTypes.value.find(jt => jt.id === selectedJobTypeId.value) || null
}

// 🎯 Handle job type selection - emit full object
const handleSelection = () => {
  emit('job-type-selected', getSelectedJobType())
}
</script>

<style scoped>
.job-type-selector {
  margin-bottom: 1rem;
  padding: 1rem;
  background-color: #f3f4f6;
  border-radius: 0.5rem;
  border: 2px solid #e5e7eb;
}

.job-type-selector h3 {
  margin-bottom: 0.5rem;
  color: #4b5563;
  font-size: 1rem;
  font-weight: 600;
}

.job-type-selector select {
  width: 100%;
  padding: 0.5rem;
  border: 2px solid #d1d5db;
  border-radius: 0.375rem;
  background-color: white;
  font-size: 0.875rem;
}

.job-details {
  margin-top: 0.5rem;
  padding: 0.5rem;
  background-color: #e0e7ff;
  border-radius: 0.375rem;
  border: 1px solid #c7d2fe;
}

.job-details h4 {
  margin: 0 0 0.25rem 0;
  color: #4338ca;
  font-size: 0.875rem;
  font-weight: 600;
}

.job-details p {
  margin: 0.25rem 0;
  color: #6b7280;
  font-size: 0.75rem;
}
</style>