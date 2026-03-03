<!-- JobEstimateReport.vue -->
<template>
  <div class="mt-4 pt-3 border-t border-blue-200">
    <h5 class="text-sm font-medium text-blue-700 mb-2">Job Estimate:</h5>
    <div class="text-xs text-gray-600 space-y-1">
      <div>📊 Total Estimated Cost: ${{ totalCost }}</div>
      <div>⏱️ Total Duration: {{ totalDuration }}</div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  totalCost: {
    type: Number,
    required: true
  },
  totalDuration: {
    type: String,
    required: true
  }
})
</script>
