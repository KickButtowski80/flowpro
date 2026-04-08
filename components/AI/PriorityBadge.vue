<template>
  <div class="priority-badge">
    <span :class="getPriorityClass()" class="px-4 py-2 rounded-full text-white font-bold text-sm">
      {{ getPriorityLabel() }}
    </span>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
  category: {
    type: String,
    required: true
  }
})

const PRIORITY_MAP = {
  gas_line_services: 'IMMEDIATE',
  emergency_plumbing: 'IMMEDIATE',
  water_heater_services: 'SAME_DAY',
  drain_cleaning_sewer: 'SAME_DAY',
  bathroom_kitchen_fixtures: 'SCHEDULE',
  plumbing_repairs: 'SCHEDULE',
  maintenance_inspection: 'SCHEDULE',
  outdoor_drainage: 'SCHEDULE'
}

const PRIORITY_CLASSES = {
  'IMMEDIATE': 'bg-red-600',
  'SAME_DAY': 'bg-amber-600',
  'SCHEDULE': 'bg-blue-600'
}

const getPriorityLabel = () => {
  return PRIORITY_MAP[props.category] || 'UNKNOWN'
}

const getPriorityClass = () => {
  const priority = getPriorityLabel()
  return PRIORITY_CLASSES[priority] || 'bg-gray-600'
}

const props = defineProps({
  category: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
.priority-badge {
  display: inline-block;
}
</style>
