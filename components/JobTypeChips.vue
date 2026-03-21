<!-- JobTypeChips.vue -->
<template>
  <div class="flex flex-wrap gap-2">
    <span 
      v-for="jobType in jobTypes" 
      :key="jobType.id"
      class="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium border border-blue-200"
    >
      {{ jobType.icon }} {{ jobType.name }}
      <button 
        @click="$emit('remove', jobType.id)"
        class="ml-2 text-blue-600 hover:text-blue-800 font-bold"
      >
        ×
      </button>
    </span>
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
