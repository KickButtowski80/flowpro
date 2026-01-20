<template>
  <div class="base-input">
    <label v-if="label" :for="inputId" class="input-label">
      {{ label }}
      <span v-if="required" class="required-indicator">*</span>
    </label>
    
    <div class="input-wrapper">
      <slot name="prefix" />
      
      <input 
        :id="inputId"
        :value="modelValue"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :class="inputClasses"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />
      
      <slot name="suffix" />
    </div>
    
    <p v-if="helperText && !error" class="helper-text">
      {{ helperText }}
    </p>
    
    <p v-if="error" class="error-text">
      {{ error }}
    </p>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  label: String,
  type: {
    type: String,
    default: 'text'
  },
  placeholder: String,
  disabled: Boolean,
  readonly: Boolean,
  required: Boolean,
  error: String,
  helperText: String
})

const emit = defineEmits(['update:modelValue', 'blur', 'focus'])

const inputId = computed(() => {
  return `input-${Math.random().toString(36).substr(2, 9)}`
})

const inputClasses = computed(() => {
  const classes = ['input-field']

  if (props.error) classes.push('input-error')
  if (props.disabled) classes.push('input-disabled')
  if (props.readonly) classes.push('input-readonly')

  return classes
})

const handleInput = (event) => {
  emit('update:modelValue', event.target.value)
}

const handleBlur = (event) => {
  emit('blur', event)
}

const handleFocus = (event) => {
  emit('focus', event)
}
</script>

<style scoped>
.base-input {
  @apply space-y-2;
}

.input-label {
  @apply block text-sm font-medium text-gray-700;
}

.required-indicator {
  @apply text-red-500 ml-1;
}

.input-wrapper {
  @apply relative flex items-center;
}

.input-field {
  @apply w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-flowpro focus:border-flowpro transition-colors;
}

.input-error {
  @apply border-danger focus:ring-danger focus:border-danger;
}

.input-disabled {
  @apply bg-gray-100 cursor-not-allowed opacity-50;
}

.input-readonly {
  @apply bg-gray-50 cursor-default;
}

.helper-text {
  @apply text-sm text-gray-500;
}

.error-text {
  @apply text-sm text-red-600 font-medium;
}
</style>
