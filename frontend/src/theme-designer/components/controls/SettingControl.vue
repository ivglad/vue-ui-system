<script setup>
import { SettingTypes } from '../../utils/settingTypes.js'
import { validateSetting } from '../../utils/validators.js'
import UnitInput from './UnitInput.vue'
import ColorPicker from './ColorPicker.vue'
import SliderControl from './SliderControl.vue'
import SelectControl from './SelectControl.vue'

defineOptions({
  name: 'SettingControl'
})

const props = defineProps({
  setting: {
    type: Object,
    required: true
  },
  modelValue: {
    type: [String, Number, Object, Boolean],
    default: null
  },
  disabled: {
    type: Boolean,
    default: false
  },
  showLabel: {
    type: Boolean,
    default: true
  },
  showDescription: {
    type: Boolean,
    default: true
  },
  size: {
    type: String,
    default: 'normal',
    validator: (value) => ['small', 'normal', 'large'].includes(value)
  }
})

const emit = defineEmits(['update:modelValue', 'change', 'blur'])

// Computed properties
const currentValue = computed({
  get: () => props.modelValue ?? props.setting.defaultValue,
  set: (value) => {
    emit('update:modelValue', value)
    emit('change', value)
  }
})

const validation = computed(() => {
  return validateSetting(currentValue.value, props.setting)
})

const hasError = computed(() => {
  return !validation.value.valid
})

const errorMessage = computed(() => {
  return validation.value.errors?.[0] || ''
})

const controlType = computed(() => {
  return props.setting.type || SettingTypes.SELECT
})

const controlProps = computed(() => {
  const baseProps = {
    modelValue: currentValue.value,
    disabled: props.disabled,
    invalid: hasError.value,
    size: props.size
  }
  
  // Add setting-specific props
  switch (controlType.value) {
    case SettingTypes.SIZE:
    case SettingTypes.SPACING:
    case SettingTypes.BORDER_RADIUS:
    case SettingTypes.FONT_SIZE:
      return {
        ...baseProps,
        units: props.setting.units || ['px'],
        min: props.setting.validation?.min,
        max: props.setting.validation?.max,
        step: props.setting.validation?.step || 1
      }
      
    case SettingTypes.RANGE:
      return {
        ...baseProps,
        min: props.setting.validation?.min || 0,
        max: props.setting.validation?.max || 100,
        step: props.setting.validation?.step || 1
      }
      
    case SettingTypes.SELECT:
      return {
        ...baseProps,
        options: props.setting.validation?.options || []
      }
      
    case SettingTypes.COLOR:
      return {
        ...baseProps,
        format: props.setting.format || 'hex'
      }
      
    default:
      return baseProps
  }
})

// Methods
const handleBlur = () => {
  emit('blur', currentValue.value)
}

const handleInput = (value) => {
  currentValue.value = value
}

// Component mapping
const getControlComponent = (type) => {
  switch (type) {
    case SettingTypes.COLOR:
      return ColorPicker
      
    case SettingTypes.SIZE:
    case SettingTypes.SPACING:
    case SettingTypes.BORDER_RADIUS:
    case SettingTypes.FONT_SIZE:
      return UnitInput
      
    case SettingTypes.RANGE:
    case SettingTypes.FONT_WEIGHT:
      return SliderControl
      
    case SettingTypes.SELECT:
      return SelectControl
      
    case SettingTypes.BOOLEAN:
      return 'ToggleSwitch'
      
    default:
      return 'InputText'
  }
}

const ControlComponent = computed(() => {
  return getControlComponent(controlType.value)
})
</script>

<template>
  <div 
    class="setting-control"
    :class="{
      'setting-control--error': hasError,
      'setting-control--disabled': disabled,
      [`setting-control--${size}`]: size !== 'normal'
    }"
  >
    <!-- Label -->
    <label 
      v-if="showLabel && setting.label"
      class="setting-control__label"
      :class="{ 'setting-control__label--required': setting.validation?.required }"
    >
      {{ setting.label }}
      <span v-if="setting.validation?.required" class="setting-control__required">*</span>
    </label>
    
    <!-- Description -->
    <p 
      v-if="showDescription && setting.description"
      class="setting-control__description"
    >
      {{ setting.description }}
    </p>
    
    <!-- Control -->
    <div class="setting-control__input">
      <component
        :is="ControlComponent"
        v-bind="controlProps"
        @update:modelValue="handleInput"
        @blur="handleBlur"
      />
    </div>
    
    <!-- Error message -->
    <div 
      v-if="hasError && errorMessage"
      class="setting-control__error"
    >
      <i class="pi pi-exclamation-triangle setting-control__error-icon" />
      <span class="setting-control__error-text">{{ errorMessage }}</span>
    </div>
    
    <!-- Help text -->
    <div 
      v-if="setting.help && !hasError"
      class="setting-control__help"
    >
      <i class="pi pi-info-circle setting-control__help-icon" />
      <span class="setting-control__help-text">{{ setting.help }}</span>
    </div>
  </div>
</template>

<style scoped>
.setting-control {
  @apply mb-4;
}

.setting-control__label {
  @apply block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1;
}

.setting-control__label--required {
  @apply font-semibold;
}

.setting-control__required {
  @apply text-red-500 ml-1;
}

.setting-control__description {
  @apply text-xs text-gray-500 dark:text-gray-400 mb-2 leading-relaxed;
}

.setting-control__input {
  @apply relative;
}

.setting-control__error {
  @apply flex items-center mt-1 text-xs text-red-600 dark:text-red-400;
}

.setting-control__error-icon {
  @apply mr-1 flex-shrink-0;
}

.setting-control__error-text {
  @apply flex-1;
}

.setting-control__help {
  @apply flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400;
}

.setting-control__help-icon {
  @apply mr-1 flex-shrink-0;
}

.setting-control__help-text {
  @apply flex-1;
}

/* Size variants */
.setting-control--small .setting-control__label {
  @apply text-xs;
}

.setting-control--small .setting-control__description {
  @apply text-xs;
}

.setting-control--large .setting-control__label {
  @apply text-base;
}

.setting-control--large .setting-control__description {
  @apply text-sm;
}

/* State variants */
.setting-control--error .setting-control__input {
  @apply ring-1 ring-red-300 rounded;
}

.setting-control--disabled {
  @apply opacity-50 pointer-events-none;
}
</style>