<!-- JobTypeSelector.vue -->
<template>
  <div class="job-type-selector">
    <h3>🔧 Job Type:</h3>
    <select v-model="selectedJobTypeId" @change="handleSelection">
      <option value="">Select Job Type</option>
      <option v-for="jobType in jobTypes" :key="jobType.id" :value="jobType.id">
        {{ jobType.name }} - {{ jobType.requiredTeamSize }} plumbers
      </option>
    </select>
    
    <div v-if="selectedJobTypeId" class="job-details">
      <h4>{{ getSelectedJobType().name }}</h4>
      <p>{{ getSelectedJobType().description }}</p>
      <p>⏱️ {{ getSelectedJobType().estimatedDuration }}</p>
      <p>💰 ${{ getSelectedJobType().basePrice }} base price</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 🎯 No props needed - component manages its own data
// 🎯 Emit event when job type is selected
const emit = defineEmits(['job-type-selected'])

// 🎯 Job type data - managed by this component
const jobTypes = ref([
  {
    id: 'emergency_repair',
    name: 'Emergency Repair',
    description: 'Urgent plumbing issues that need immediate attention',
    requiredTeamSize: 2,
    requiredLevels: ['master', 'journeyman'],
    emergencyRequired: true,
    estimatedDuration: '2-4 hours',
    basePrice: 200,
    icon: '🚨'
  },
  {
    id: 'water_heater_installation',
    name: 'Water Heater Installation',
    description: 'Install or replace water heater units',
    requiredTeamSize: 2,
    requiredLevels: ['master', 'journeyman'],
    emergencyRequired: false,
    estimatedDuration: '4-6 hours',
    basePrice: 250,
    icon: '🔥'
  },
  {
    id: 'repiping_project',
    name: 'Repiping Project',
    description: 'Complete pipe replacement for home or business',
    requiredTeamSize: 3,
    requiredLevels: ['master', 'journeyman', 'apprentice'],
    emergencyRequired: false,
    estimatedDuration: '1-3 days',
    basePrice: 400,
    icon: '🔧'
  },
  {
    id: 'routine_maintenance',
    name: 'Routine Maintenance',
    description: 'Regular plumbing maintenance and inspections',
    requiredTeamSize: 1,
    requiredLevels: ['apprentice', 'journeyman'],
    emergencyRequired: false,
    estimatedDuration: '1-2 hours',
    basePrice: 100,
    icon: '🔩'
  }
])

// 🎯 Selected job type ID state
const selectedJobTypeId = ref('')

// 🎯 Get selected job type details
const getSelectedJobType = () => {
  console.log('🎯 Selected job type ID:', selectedJobTypeId.value)
  if (!selectedJobTypeId.value) return null
  return jobTypes.value.find(job => job.id === selectedJobTypeId.value)
}

// 🎯 Handle job type selection - emit full object
const handleSelection = () => {
  const jobType = getSelectedJobType() // Get full object
  console.log('🎯 Job type selected:', jobType)

  emit('job-type-selected', jobType) // Emit full object
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