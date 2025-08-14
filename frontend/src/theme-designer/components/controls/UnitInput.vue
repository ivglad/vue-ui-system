<script setup>
import { normalizeSize, convertSize, sizeToCSS } from '../../utils/converters.js'

defineOptions({
  name: 'UnitInput'
})

const props = defineProps({
  modelValue: {
    type: [Object, String, Number],
    default: () => ({ value: 0, unit: 'px' })
  },
  units: {
    type: Array,
    default: () => ['px', 'rem', 'em', '%']
  },
  min: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 1000
  },
  step: {
    type: Number,
    default: 1
  },
  disabled: {
    type: Boolean,
    default: false
  },
  invalid: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'normal'
  },
  placeholder: {
    type: String,
    default: '0'
  }
})

const emit = defineEmits(['update:modelValue', 'change', 'blur'])

// Normalize the model value to ensure it's always an object
const normalizedValue = computed(() => {
  return normalizeSize(props.modelValue)
})

// Local state for input value
const inputValue = ref(normalizedValue.value.value)
const selectedUnit = ref(normalizedValue.value.unit)

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  const normalized = normalizeSize(newValue)
  inputValue.value = normalized.value
  selectedUnit.value = normalized.unit
}, { immediate: true })

// Computed properties
const currentSizeValue = computed(() => ({
  value: inputValue.value,
  unit: selectedUnit.value
}))

const cssValue = computed(() => {
  return sizeToCSS(currentSizeValue.value)
})

const inputClasses = computed(() => [
  'unit-input__number',
  {
    'unit-input__number--invalid': props.invalid,
    'unit-input__number--disabled': props.disabled,
    [`unit-input__number--${props.size}`]: props.size !== 'normal'
  }
])

const selectClasses = computed(() => [
  'unit-input__unit',
  {
    'unit-input__unit--invalid': props.invalid,
    'unit-input__unit--disabled': props.disabled,
    [`unit-input__unit--${props.size}`]: props.size !== 'normal'
  }
])

// Methods
const updateValue = () => {
  const newValue = {
    value: Number(inputValue.value) || 0,
    unit: selectedUnit.value
  }
  
  emit('update:modelValue', newValue)
  emit('change', newValue)
}

const handleNumberInput = (event) => {
  const value = event.target.value
  inputValue.value = value === '' ? 0 : Number(value)
  updateValue()
}

const handleUnitChange = (event) => {
  const newUnit = event.target.value
  
  // Convert the current value to the new unit
  const converted = convertSize(currentSizeValue.value, newUnit)
  
  inputValue.value = converted.value
  selectedUnit.value = converted.unit
  
  updateValue()
}

const handleBlur = () => {
  // Ensure the value is within bounds
  if (inputValue.value < props.min) {
    inputValue.value = props.min
  } else if (inputValue.value > props.max) {
    inputValue.value = props.max
  }
  
  updateValue()
  emit('blur', currentSizeValue.value)
}

const handleKeydown = (event) => {
  // Allow arrow keys for increment/decrement
  if (event.key === 'ArrowUp') {
    event.preventDefault()
    inputValue.value = Math.min(inputValue.value + props.step, props.max)
    updateValue()
  } else if (event.key === 'ArrowDown') {
    event.preventDefault()
    inputValue.value = Math.max(inputValue.value - props.step, props.min)
    updateValue()
  }
}

// Increment/decrement methods
const increment = () => {
  if (!props.disabled) {
    inputValue.value = Math.min(inputValue.value + props.step, props.max)
    updateValue()
  }
}

const decrement = () => {
  if (!props.disabled) {
    inputValue.value = Math.max(inputValue.value - props.step, props.min)
    updateValue()
  }
}
</script>

<template>
  <div 
    class="unit-input"
    :class="{
      'unit-input--invalid': invalid,
      'unit-input--disabled': disabled,
      [`unit-input--${size}`]: size !== 'normal'
    }"
  >
    <div class="unit-input__container">
      <!-- Number input -->
      <div class="unit-input__number-container">
        <InputNumber
          :model-value="inputValue"
          :min="min"
          :max="max"
          :step="step"
          :disabled="disabled"
          :invalid="invalid"
          :placeholder="placeholder"
          :class="inputClasses"
          :show-buttons="false"
          :use-grouping="false"
          fluid
          @input="handleNumberInput"
          @blur="handleBlur"
          @keydown="handleKeydown"
        />
        
        <!-- Increment/Decrement buttons -->
        <div class="unit-input__buttons">
          <Button
            icon="pi pi-angle-up"
            :disabled="disabled || inputValue >= max"
            size="small"
            text
            rounded
            class="unit-input__button unit-input__button--up"
            @click="increment"
          />
          <Button
            icon="pi pi-angle-down"
            :disabled="disabled || inputValue <= min"
            size="small"
            text
            rounded
            class="unit-input__button unit-input__button--down"
            @click="decrement"
          />
        </div>
      </div>
      
      <!-- Unit selector -->
      <Select
        v-if="units.length > 1"
        :model-value="selectedUnit"
        :options="units"
        :disabled="disabled"
        :invalid="invalid"
        :class="selectClasses"
        @change="handleUnitChange"
      />
      
      <!-- Single unit display -->
      <div 
        v-else-if="units.length === 1"
        class="unit-input__unit-display"
        :class="{ 'unit-input__unit-display--disabled': disabled }"
      >
        {{ units[0] }}
      </div>
    </div>
    
    <!-- CSS value preview -->
    <div 
      v-if="cssValue && !disabled"
      class="unit-input__preview"
    >
      {{ cssValue }}
    </div>
  </div>
</template>

<style scoped>
.unit-input {
  @apply w-full;
}

.unit-input__container {
  @apply flex items-stretch border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-800;
  @apply focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500;
}

.unit-input__number-container {
  @apply flex-1 relative;
}

.unit-input__number {
  @apply border-0 rounded-none bg-transparent;
}

.unit-input__buttons {
  @apply absolute right-1 top-1/2 transform -translate-y-1/2 flex flex-col;
}

.unit-input__button {
  @apply w-5 h-4 p-0 text-xs;
}

.unit-input__button--up {
  @apply mb-0.5;
}

.unit-input__unit {
  @apply border-0 border-l border-gray-300 dark:border-gray-600 rounded-none bg-gray-50 dark:bg-gray-700;
  @apply min-w-16 text-center;
}

.unit-input__unit-display {
  @apply px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300;
  @apply border-l border-gray-300 dark:border-gray-600 text-sm font-medium;
  @apply min-w-16 text-center;
}

.unit-input__unit-display--disabled {
  @apply opacity-50;
}

.unit-input__preview {
  @apply text-xs text-gray-500 dark:text-gray-400 mt-1 font-mono;
}

/* Invalid state */
.unit-input--invalid .unit-input__container {
  @apply border-red-300 dark:border-red-600;
}

.unit-input--invalid .unit-input__container:focus-within {
  @apply ring-red-500 border-red-500;
}

/* Disabled state */
.unit-input--disabled .unit-input__container {
  @apply opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-700;
}

/* Size variants */
.unit-input--small .unit-input__container {
  @apply text-sm;
}

.unit-input--small .unit-input__unit-display {
  @apply px-2 py-1 text-xs min-w-12;
}

.unit-input--large .unit-input__container {
  @apply text-lg;
}

.unit-input--large .unit-input__unit-display {
  @apply px-4 py-3 text-base min-w-20;
}
</style>