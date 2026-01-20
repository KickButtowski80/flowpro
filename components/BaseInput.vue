<template>
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

  if (props.error) classes.push('error')
  if (props.disabled) classes.push('disabled')
  if (props.readonly) classes.push('readonly')

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
/* Component-specific overrides only */
</style>
