<!-- JobReport.vue -->
<template>
  <div class="space-y-3">
    <div v-for="jobType in jobTypes" :key="jobType.id" class="border-b border-blue-100 pb-3 last:border-b-0">
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <h6 class="font-medium text-blue-700">{{ jobType.icon }} {{ jobType.name }}</h6>
          <p class="text-sm text-gray-600 mt-1">{{ jobType.description }}</p>
          <div class="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
            <span>⏱️ {{ jobType.estimatedDuration }}</span>
            <span>💰 ${{ jobType.basePrice }} base</span>
            <span>👥 {{ jobType.requiredTeamSize }} plumber{{ jobType.requiredTeamSize > 1 ? 's' : '' }}</span>
          </div>
        </div>
        <button 
          @click="$emit('remove', jobType.id)"
          class="ml-3 text-red-500 hover:text-red-700 text-sm"
        >
          Remove
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  jobTypes: {
    type: Array,
    required: true
  }
})

defineEmits(['remove'])
</script>
