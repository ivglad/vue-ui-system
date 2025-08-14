<script setup>
import { validateColor } from '../../utils/validators.js'

defineOptions({
  name: 'ColorPicker'
})

const props = defineProps({
  modelValue: {
    type: String,
    default: '#000000'
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
  format: {
    type: String,
    default: 'hex',
    validator: (value) => ['hex', 'rgb', 'hsl'].includes(value)
  },
  showPreview: {
    type: Boolean,
    default: true
  },
  showInput: {
    type: Boolean,
    default: true
  },
  presetColors: {
    type: Array,
    default: () => [
      '#000000', '#ffffff', '#f3f4f6', '#9ca3af', '#374151',
      '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
      '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
      '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
      '#ec4899', '#f43f5e'
    ]
  }
})

const emit = defineEmits(['update:modelValue', 'change', 'blur'])

// Local state
const isOpen = ref(false)
const inputValue = ref(props.modelValue)
const colorPickerRef = ref(null)

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  inputValue.value = newValue
}, { immediate: true })

// Computed properties
const isValidColor = computed(() => {
  return validateColor(inputValue.value)
})

const previewStyle = computed(() => ({
  backgroundColor: isValidColor.value ? inputValue.value : '#transparent',
  backgroundImage: !isValidColor.value ? 
    'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)' : 
    'none',
  backgroundSize: !isValidColor.value ? '8px 8px' : 'auto',
  backgroundPosition: !isValidColor.value ? '0 0, 0 4px, 4px -4px, -4px 0px' : 'auto'
}))

const containerClasses = computed(() => [
  'color-picker',
  {
    'color-picker--invalid': props.invalid,
    'color-picker--disabled': props.disabled,
    'color-picker--open': isOpen.value,
    [`color-picker--${props.size}`]: props.size !== 'normal'
  }
])

// Methods
const updateValue = (newValue) => {
  inputValue.value = newValue
  emit('update:modelValue', newValue)
  emit('change', newValue)
}

const handleInputChange = (event) => {
  const value = event.target.value
  updateValue(value)
}

const handlePresetClick = (color) => {
  updateValue(color)
  closeDropdown()
}

const handleBlur = () => {
  emit('blur', inputValue.value)
}

const openDropdown = () => {
  if (!props.disabled) {
    isOpen.value = true
  }
}

const closeDropdown = () => {
  isOpen.value = false
}

const toggleDropdown = () => {
  if (isOpen.value) {
    closeDropdown()
  } else {
    openDropdown()
  }
}

// Click outside to close
onClickOutside(colorPickerRef, closeDropdown)

// Keyboard navigation
const handleKeydown = (event) => {
  if (event.key === 'Escape') {
    closeDropdown()
  } else if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    toggleDropdown()
  }
}

// Color format conversion helpers
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

const rgbToHex = (r, g, b) => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
}

const formatColor = (color, format) => {
  if (!validateColor(color)) return color
  
  switch (format) {
    case 'rgb': {
      const rgb = hexToRgb(color)
      return rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : color
    }
    case 'hsl':
      // Simplified HSL conversion - in real implementation use a color library
      return color
    case 'hex':
    default:
      return color
  }
}

const displayValue = computed(() => {
  return formatColor(inputValue.value, props.format)
})
</script>

<template>
  <div 
    ref="colorPickerRef"
    :class="containerClasses"
  >
    <div class="color-picker__container">
      <!-- Color preview button -->
      <button
        v-if="showPreview"
        type="button"
        class="color-picker__preview"
        :class="{
          'color-picker__preview--invalid': !isValidColor,
          'color-picker__preview--disabled': disabled
        }"
        :style="previewStyle"
        :disabled="disabled"
        @click="toggleDropdown"
        @keydown="handleKeydown"
      >
        <span v-if="!isValidColor" class="color-picker__invalid-icon">?</span>
      </button>
      
      <!-- Color input -->
      <InputText
        v-if="showInput"
        :model-value="displayValue"
        :disabled="disabled"
        :invalid="invalid || !isValidColor"
        :placeholder="format === 'hex' ? '#000000' : 'Color value'"
        class="color-picker__input"
        @input="handleInputChange"
        @blur="handleBlur"
        @focus="openDropdown"
      />
      
      <!-- Dropdown toggle button -->
      <Button
        icon="pi pi-chevron-down"
        :disabled="disabled"
        text
        rounded
        size="small"
        class="color-picker__toggle"
        :class="{ 'color-picker__toggle--open': isOpen }"
        @click="toggleDropdown"
      />
    </div>
    
    <!-- Color picker dropdown -->
    <div 
      v-if="isOpen"
      class="color-picker__dropdown"
    >
      <!-- Preset colors -->
      <div class="color-picker__presets">
        <div class="color-picker__presets-label">
          Preset Colors
        </div>
        <div class="color-picker__presets-grid">
          <button
            v-for="color in presetColors"
            :key="color"
            type="button"
            class="color-picker__preset"
            :class="{
              'color-picker__preset--selected': color === inputValue
            }"
            :style="{ backgroundColor: color }"
            :title="color"
            @click="handlePresetClick(color)"
          />
        </div>
      </div>
      
      <!-- Custom color input -->
      <div class="color-picker__custom">
        <div class="color-picker__custom-label">
          Custom Color
        </div>
        <div class="color-picker__custom-input">
          <input
            type="color"
            :value="inputValue"
            class="color-picker__native"
            @input="handleInputChange"
          />
          <InputText
            :model-value="inputValue"
            placeholder="#000000"
            class="color-picker__hex-input"
            @input="handleInputChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.color-picker {
  @apply relative w-full;
}

.color-picker__container {
  @apply flex items-stretch border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-800;
  @apply focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500;
}

.color-picker__preview {
  @apply w-10 h-10 border-0 border-r border-gray-300 dark:border-gray-600 cursor-pointer;
  @apply flex items-center justify-center transition-all duration-200;
  @apply hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset;
}

.color-picker__preview--invalid {
  @apply bg-gray-100 dark:bg-gray-700;
}

.color-picker__preview--disabled {
  @apply cursor-not-allowed opacity-50;
}

.color-picker__invalid-icon {
  @apply text-gray-400 font-bold;
}

.color-picker__input {
  @apply flex-1 border-0 rounded-none bg-transparent;
}

.color-picker__toggle {
  @apply border-l border-gray-300 dark:border-gray-600 rounded-none;
  @apply transition-transform duration-200;
}

.color-picker__toggle--open {
  @apply rotate-180;
}

.color-picker__dropdown {
  @apply absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600;
  @apply rounded-lg shadow-lg z-50 p-4;
}

.color-picker__presets-label,
.color-picker__custom-label {
  @apply text-sm font-medium text-gray-700 dark:text-gray-300 mb-2;
}

.color-picker__presets-grid {
  @apply grid grid-cols-11 gap-1 mb-4;
}

.color-picker__preset {
  @apply w-6 h-6 rounded border border-gray-300 dark:border-gray-600 cursor-pointer;
  @apply hover:scale-110 transition-transform duration-150;
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500;
}

.color-picker__preset--selected {
  @apply ring-2 ring-blue-500 scale-110;
}

.color-picker__custom-input {
  @apply flex items-center gap-2;
}

.color-picker__native {
  @apply w-8 h-8 border border-gray-300 dark:border-gray-600 rounded cursor-pointer;
}

.color-picker__hex-input {
  @apply flex-1;
}

/* Invalid state */
.color-picker--invalid .color-picker__container {
  @apply border-red-300 dark:border-red-600;
}

.color-picker--invalid .color-picker__container:focus-within {
  @apply ring-red-500 border-red-500;
}

/* Disabled state */
.color-picker--disabled .color-picker__container {
  @apply opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-700;
}

/* Size variants */
.color-picker--small .color-picker__preview {
  @apply w-8 h-8;
}

.color-picker--small .color-picker__container {
  @apply text-sm;
}

.color-picker--large .color-picker__preview {
  @apply w-12 h-12;
}

.color-picker--large .color-picker__container {
  @apply text-lg;
}
</style>