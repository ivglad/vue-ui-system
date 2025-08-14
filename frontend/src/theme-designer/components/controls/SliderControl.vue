<script setup>
defineOptions({
  name: 'SliderControl'
})

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0
  },
  min: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 100
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
  showValue: {
    type: Boolean,
    default: true
  },
  showInput: {
    type: Boolean,
    default: true
  },
  unit: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'change', 'blur'])

// Local state
const sliderValue = ref(props.modelValue)
const inputValue = ref(props.modelValue)

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  sliderValue.value = newValue
  inputValue.value = newValue
}, { immediate: true })

// Computed properties
const displayValue = computed(() => {
  const value = sliderValue.value
  return props.unit ? `${value}${props.unit}` : String(value)
})

const percentage = computed(() => {
  const range = props.max - props.min
  const value = sliderValue.value - props.min
  return Math.max(0, Math.min(100, (value / range) * 100))
})

const containerClasses = computed(() => [
  'slider-control',
  {
    'slider-control--invalid': props.invalid,
    'slider-control--disabled': props.disabled,
    [`slider-control--${props.size}`]: props.size !== 'normal'
  }
])

// Methods
const updateValue = (newValue) => {
  const clampedValue = Math.max(props.min, Math.min(props.max, newValue))
  sliderValue.value = clampedValue
  inputValue.value = clampedValue
  
  emit('update:modelValue', clampedValue)
  emit('change', clampedValue)
}

const handleSliderChange = (event) => {
  const value = Number(event.target.value)
  updateValue(value)
}

const handleInputChange = (event) => {
  const value = Number(event.target.value)
  if (!isNaN(value)) {
    updateValue(value)
  }
}

const handleBlur = () => {
  // Ensure the input value is within bounds
  const value = Number(inputValue.value)
  if (!isNaN(value)) {
    updateValue(value)
  } else {
    // Reset to current slider value if input is invalid
    inputValue.value = sliderValue.value
  }
  
  emit('blur', sliderValue.value)
}

const handleKeydown = (event) => {
  if (event.key === 'ArrowUp' || event.key === 'ArrowRight') {
    event.preventDefault()
    updateValue(sliderValue.value + props.step)
  } else if (event.key === 'ArrowDown' || event.key === 'ArrowLeft') {
    event.preventDefault()
    updateValue(sliderValue.value - props.step)
  } else if (event.key === 'Home') {
    event.preventDefault()
    updateValue(props.min)
  } else if (event.key === 'End') {
    event.preventDefault()
    updateValue(props.max)
  }
}

// Calculate tick marks for better UX
const tickMarks = computed(() => {
  const range = props.max - props.min
  const stepCount = range / props.step
  
  // Only show ticks if there are reasonable number of steps
  if (stepCount <= 20 && stepCount > 1) {
    const ticks = []
    for (let i = 0; i <= stepCount; i++) {
      const value = props.min + (i * props.step)
      const position = (i / stepCount) * 100
      ticks.push({ value, position })
    }
    return ticks
  }
  
  return []
})
</script>

<template>
  <div :class="containerClasses">
    <div class="slider-control__container">
      <!-- Slider -->
      <div class="slider-control__slider-container">
        <div class="slider-control__track">
          <!-- Progress fill -->
          <div 
            class="slider-control__fill"
            :style="{ width: `${percentage}%` }"
          />
          
          <!-- Tick marks -->
          <div 
            v-for="tick in tickMarks"
            :key="tick.value"
            class="slider-control__tick"
            :style="{ left: `${tick.position}%` }"
          />
        </div>
        
        <!-- Native range input -->
        <input
          type="range"
          :value="sliderValue"
          :min="min"
          :max="max"
          :step="step"
          :disabled="disabled"
          class="slider-control__input"
          :class="{
            'slider-control__input--invalid': invalid,
            'slider-control__input--disabled': disabled
          }"
          @input="handleSliderChange"
          @keydown="handleKeydown"
        />
      </div>
      
      <!-- Value display and input -->
      <div 
        v-if="showValue || showInput"
        class="slider-control__value-container"
      >
        <!-- Value display -->
        <div 
          v-if="showValue && !showInput"
          class="slider-control__value-display"
        >
          {{ displayValue }}
        </div>
        
        <!-- Value input -->
        <InputNumber
          v-if="showInput"
          :model-value="inputValue"
          :min="min"
          :max="max"
          :step="step"
          :disabled="disabled"
          :invalid="invalid"
          :show-buttons="false"
          :use-grouping="false"
          class="slider-control__value-input"
          @input="handleInputChange"
          @blur="handleBlur"
        />
        
        <!-- Unit display -->
        <span 
          v-if="unit"
          class="slider-control__unit"
        >
          {{ unit }}
        </span>
      </div>
    </div>
    
    <!-- Min/Max labels -->
    <div class="slider-control__labels">
      <span class="slider-control__label slider-control__label--min">
        {{ min }}{{ unit }}
      </span>
      <span class="slider-control__label slider-control__label--max">
        {{ max }}{{ unit }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.slider-control {
  @apply w-full;
}

.slider-control__container {
  @apply flex items-center gap-3;
}

.slider-control__slider-container {
  @apply flex-1 relative;
}

.slider-control__track {
  @apply relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full;
}

.slider-control__fill {
  @apply absolute top-0 left-0 h-full bg-blue-500 rounded-full transition-all duration-150;
}

.slider-control__tick {
  @apply absolute top-1/2 w-0.5 h-3 bg-gray-400 dark:bg-gray-500 transform -translate-x-1/2 -translate-y-1/2;
}

.slider-control__input {
  @apply absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer;
  @apply focus:outline-none;
}

.slider-control__input::-webkit-slider-thumb {
  @apply appearance-none w-5 h-5 bg-blue-500 rounded-full cursor-pointer;
  @apply border-2 border-white shadow-md;
  @apply hover:bg-blue-600 transition-colors duration-150;
}

.slider-control__input::-moz-range-thumb {
  @apply w-5 h-5 bg-blue-500 rounded-full cursor-pointer border-0;
  @apply hover:bg-blue-600 transition-colors duration-150;
}

.slider-control__input--invalid::-webkit-slider-thumb {
  @apply bg-red-500 hover:bg-red-600;
}

.slider-control__input--invalid::-moz-range-thumb {
  @apply bg-red-500 hover:bg-red-600;
}

.slider-control__input--disabled {
  @apply cursor-not-allowed;
}

.slider-control__input--disabled::-webkit-slider-thumb {
  @apply bg-gray-400 cursor-not-allowed;
}

.slider-control__input--disabled::-moz-range-thumb {
  @apply bg-gray-400 cursor-not-allowed;
}

.slider-control__value-container {
  @apply flex items-center gap-1 min-w-16;
}

.slider-control__value-display {
  @apply text-sm font-medium text-gray-700 dark:text-gray-300 text-right;
}

.slider-control__value-input {
  @apply w-16 text-sm;
}

.slider-control__unit {
  @apply text-sm text-gray-500 dark:text-gray-400;
}

.slider-control__labels {
  @apply flex justify-between mt-1;
}

.slider-control__label {
  @apply text-xs text-gray-500 dark:text-gray-400;
}

/* Invalid state */
.slider-control--invalid .slider-control__track {
  @apply bg-red-100 dark:bg-red-900;
}

.slider-control--invalid .slider-control__fill {
  @apply bg-red-500;
}

/* Disabled state */
.slider-control--disabled {
  @apply opacity-50 pointer-events-none;
}

.slider-control--disabled .slider-control__track {
  @apply bg-gray-100 dark:bg-gray-800;
}

.slider-control--disabled .slider-control__fill {
  @apply bg-gray-400;
}

/* Size variants */
.slider-control--small .slider-control__track {
  @apply h-1;
}

.slider-control--small .slider-control__input::-webkit-slider-thumb {
  @apply w-4 h-4;
}

.slider-control--small .slider-control__input::-moz-range-thumb {
  @apply w-4 h-4;
}

.slider-control--small .slider-control__value-input {
  @apply w-12 text-xs;
}

.slider-control--large .slider-control__track {
  @apply h-3;
}

.slider-control--large .slider-control__input::-webkit-slider-thumb {
  @apply w-6 h-6;
}

.slider-control--large .slider-control__input::-moz-range-thumb {
  @apply w-6 h-6;
}

.slider-control--large .slider-control__value-input {
  @apply w-20 text-base;
}
</style>