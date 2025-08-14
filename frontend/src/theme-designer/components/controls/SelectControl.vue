<script setup>
defineOptions({
  name: 'SelectControl'
})

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean, Object],
    default: null
  },
  options: {
    type: Array,
    required: true
  },
  optionLabel: {
    type: String,
    default: 'label'
  },
  optionValue: {
    type: String,
    default: 'value'
  },
  placeholder: {
    type: String,
    default: 'Select an option'
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
  clearable: {
    type: Boolean,
    default: false
  },
  searchable: {
    type: Boolean,
    default: false
  },
  multiple: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'change', 'blur', 'focus'])

// Computed properties
const normalizedOptions = computed(() => {
  return props.options.map(option => {
    // Handle string/number options
    if (typeof option === 'string' || typeof option === 'number') {
      return {
        label: String(option),
        value: option
      }
    }
    
    // Handle object options
    if (typeof option === 'object' && option !== null) {
      return {
        label: option[props.optionLabel] || String(option.value || option),
        value: option[props.optionValue] !== undefined ? option[props.optionValue] : option
      }
    }
    
    return {
      label: String(option),
      value: option
    }
  })
})

const selectedOption = computed(() => {
  if (props.multiple) {
    if (!Array.isArray(props.modelValue)) return []
    return normalizedOptions.value.filter(option => 
      props.modelValue.includes(option.value)
    )
  }
  
  return normalizedOptions.value.find(option => option.value === props.modelValue) || null
})

const displayValue = computed(() => {
  if (props.multiple) {
    const selected = selectedOption.value
    if (selected.length === 0) return props.placeholder
    if (selected.length === 1) return selected[0].label
    return `${selected.length} items selected`
  }
  
  return selectedOption.value?.label || props.placeholder
})

const containerClasses = computed(() => [
  'select-control',
  {
    'select-control--invalid': props.invalid,
    'select-control--disabled': props.disabled,
    'select-control--multiple': props.multiple,
    [`select-control--${props.size}`]: props.size !== 'normal'
  }
])

// Methods
const updateValue = (newValue) => {
  emit('update:modelValue', newValue)
  emit('change', newValue)
}

const handleSelectChange = (event) => {
  const option = event.value
  
  if (props.multiple) {
    // Handle multiple selection
    const currentValues = Array.isArray(props.modelValue) ? [...props.modelValue] : []
    
    if (Array.isArray(option)) {
      // Multiple options selected at once
      const newValues = option.map(opt => opt.value)
      updateValue(newValues)
    } else if (option) {
      // Single option toggled
      const index = currentValues.indexOf(option.value)
      if (index > -1) {
        currentValues.splice(index, 1)
      } else {
        currentValues.push(option.value)
      }
      updateValue(currentValues)
    }
  } else {
    // Handle single selection
    updateValue(option?.value || null)
  }
}

const handleClear = () => {
  if (props.multiple) {
    updateValue([])
  } else {
    updateValue(null)
  }
}

const handleFocus = (event) => {
  emit('focus', event)
}

const handleBlur = (event) => {
  emit('blur', event)
}

// For searchable selects
const searchQuery = ref('')
const filteredOptions = computed(() => {
  if (!props.searchable || !searchQuery.value) {
    return normalizedOptions.value
  }
  
  const query = searchQuery.value.toLowerCase()
  return normalizedOptions.value.filter(option =>
    option.label.toLowerCase().includes(query)
  )
})

const handleSearch = (event) => {
  searchQuery.value = event.target.value
}
</script>

<template>
  <div :class="containerClasses">
    <!-- PrimeVue Select for single selection -->
    <Select
      v-if="!multiple && !searchable"
      :model-value="selectedOption"
      :options="normalizedOptions"
      :option-label="'label'"
      :option-value="'value'"
      :placeholder="placeholder"
      :disabled="disabled"
      :invalid="invalid"
      :clearable="clearable"
      class="select-control__select"
      @update:model-value="handleSelectChange"
      @focus="handleFocus"
      @blur="handleBlur"
    />
    
    <!-- PrimeVue MultiSelect for multiple selection -->
    <MultiSelect
      v-else-if="multiple"
      :model-value="modelValue"
      :options="normalizedOptions"
      :option-label="'label'"
      :option-value="'value'"
      :placeholder="placeholder"
      :disabled="disabled"
      :invalid="invalid"
      :filter="searchable"
      :max-selected-labels="2"
      class="select-control__multiselect"
      @update:model-value="updateValue"
      @focus="handleFocus"
      @blur="handleBlur"
    />
    
    <!-- Custom searchable select -->
    <div
      v-else
      class="select-control__custom"
    >
      <InputText
        :model-value="searchQuery"
        :placeholder="placeholder"
        :disabled="disabled"
        :invalid="invalid"
        class="select-control__search"
        @input="handleSearch"
        @focus="handleFocus"
        @blur="handleBlur"
      />
      
      <!-- Dropdown with filtered options -->
      <div 
        v-if="searchQuery && filteredOptions.length > 0"
        class="select-control__dropdown"
      >
        <div
          v-for="option in filteredOptions"
          :key="option.value"
          class="select-control__option"
          :class="{
            'select-control__option--selected': option.value === modelValue
          }"
          @click="handleSelectChange({ value: option })"
        >
          {{ option.label }}
        </div>
      </div>
    </div>
    
    <!-- Clear button -->
    <Button
      v-if="clearable && modelValue !== null && modelValue !== undefined && !disabled"
      icon="pi pi-times"
      text
      rounded
      size="small"
      class="select-control__clear"
      @click="handleClear"
    />
  </div>
</template>

<style scoped>
.select-control {
  @apply relative w-full;
}

.select-control__select,
.select-control__multiselect {
  @apply w-full;
}

.select-control__custom {
  @apply relative;
}

.select-control__search {
  @apply w-full;
}

.select-control__dropdown {
  @apply absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800;
  @apply border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50;
  @apply max-h-48 overflow-y-auto;
}

.select-control__option {
  @apply px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700;
  @apply text-gray-900 dark:text-gray-100 transition-colors duration-150;
}

.select-control__option--selected {
  @apply bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100;
}

.select-control__clear {
  @apply absolute right-2 top-1/2 transform -translate-y-1/2;
}

/* Invalid state */
.select-control--invalid .select-control__select,
.select-control--invalid .select-control__multiselect,
.select-control--invalid .select-control__search {
  @apply border-red-300 dark:border-red-600;
}

/* Disabled state */
.select-control--disabled {
  @apply opacity-50 pointer-events-none;
}

/* Size variants */
.select-control--small .select-control__select,
.select-control--small .select-control__multiselect,
.select-control--small .select-control__search {
  @apply text-sm;
}

.select-control--large .select-control__select,
.select-control--large .select-control__multiselect,
.select-control--large .select-control__search {
  @apply text-lg;
}

/* Multiple selection styling */
.select-control--multiple .select-control__multiselect {
  @apply min-h-10;
}
</style>