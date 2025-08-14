<script setup>
import { validateColor } from '../../utils/validators.js'

defineOptions({
  name: 'ColorPalettePicker'
})

const props = defineProps({
  modelValue: {
    type: [String, Object],
    default: '#3b82f6'
  },
  paletteType: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'surface', 'semantic'].includes(value)
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
  showPreview: {
    type: Boolean,
    default: true
  },
  showCustom: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue', 'change', 'palette-generated'])

// Predefined color palettes
const predefinedPalettes = {
  // Tailwind-inspired palettes
  blue: {
    name: 'Blue',
    base: '#3b82f6',
    palette: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
      950: '#172554'
    }
  },
  indigo: {
    name: 'Indigo',
    base: '#6366f1',
    palette: {
      50: '#eef2ff',
      100: '#e0e7ff',
      200: '#c7d2fe',
      300: '#a5b4fc',
      400: '#818cf8',
      500: '#6366f1',
      600: '#4f46e5',
      700: '#4338ca',
      800: '#3730a3',
      900: '#312e81',
      950: '#1e1b4b'
    }
  },
  purple: {
    name: 'Purple',
    base: '#8b5cf6',
    palette: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7',
      600: '#9333ea',
      700: '#7c3aed',
      800: '#6b21a8',
      900: '#581c87',
      950: '#3b0764'
    }
  },
  pink: {
    name: 'Pink',
    base: '#ec4899',
    palette: {
      50: '#fdf2f8',
      100: '#fce7f3',
      200: '#fbcfe8',
      300: '#f9a8d4',
      400: '#f472b6',
      500: '#ec4899',
      600: '#db2777',
      700: '#be185d',
      800: '#9d174d',
      900: '#831843',
      950: '#500724'
    }
  },
  green: {
    name: 'Green',
    base: '#10b981',
    palette: {
      50: '#ecfdf5',
      100: '#d1fae5',
      200: '#a7f3d0',
      300: '#6ee7b7',
      400: '#34d399',
      500: '#10b981',
      600: '#059669',
      700: '#047857',
      800: '#065f46',
      900: '#064e3b',
      950: '#022c22'
    }
  },
  orange: {
    name: 'Orange',
    base: '#f97316',
    palette: {
      50: '#fff7ed',
      100: '#ffedd5',
      200: '#fed7aa',
      300: '#fdba74',
      400: '#fb923c',
      500: '#f97316',
      600: '#ea580c',
      700: '#c2410c',
      800: '#9a3412',
      900: '#7c2d12',
      950: '#431407'
    }
  },
  red: {
    name: 'Red',
    base: '#ef4444',
    palette: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
      950: '#450a0a'
    }
  },
  gray: {
    name: 'Gray',
    base: '#6b7280',
    palette: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
      950: '#030712'
    }
  }
}

// Local state
const selectedPalette = ref('blue')
const customColor = ref(typeof props.modelValue === 'string' ? props.modelValue : '#3b82f6')
const showCustomPicker = ref(false)

// Computed properties
const currentValue = computed(() => {
  if (typeof props.modelValue === 'object') {
    return props.modelValue
  }
  return props.modelValue || customColor.value
})

const selectedPaletteData = computed(() => {
  return predefinedPalettes[selectedPalette.value] || predefinedPalettes.blue
})

const generatedPalette = computed(() => {
  if (typeof currentValue.value === 'object') {
    return currentValue.value
  }
  
  // Generate palette from base color
  return generatePaletteFromColor(currentValue.value)
})

const containerClasses = computed(() => [
  'color-palette-picker',
  {
    'color-palette-picker--invalid': props.invalid,
    'color-palette-picker--disabled': props.disabled,
    [`color-palette-picker--${props.size}`]: props.size !== 'normal'
  }
])

// Methods
const generatePaletteFromColor = (baseColor) => {
  if (!validateColor(baseColor)) {
    return predefinedPalettes.blue.palette
  }
  
  // Simple palette generation - in production, use a proper color library like chroma.js
  const palette = {}
  const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
  
  // Convert hex to RGB for manipulation
  const hex = baseColor.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  
  shades.forEach(shade => {
    if (shade === 500) {
      palette[shade] = baseColor
    } else if (shade < 500) {
      // Lighter shades - mix with white
      const factor = (500 - shade) / 500
      const newR = Math.round(r + (255 - r) * factor)
      const newG = Math.round(g + (255 - g) * factor)
      const newB = Math.round(b + (255 - b) * factor)
      palette[shade] = `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`
    } else {
      // Darker shades - mix with black
      const factor = (shade - 500) / 450
      const newR = Math.round(r * (1 - factor))
      const newG = Math.round(g * (1 - factor))
      const newB = Math.round(b * (1 - factor))
      palette[shade] = `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`
    }
  })
  
  return palette
}

const updateValue = (newValue) => {
  emit('update:modelValue', newValue)
  emit('change', newValue)
  
  // Emit generated palette for integration
  if (typeof newValue === 'string') {
    const palette = generatePaletteFromColor(newValue)
    emit('palette-generated', palette)
  }
}

const handlePaletteSelect = (paletteKey) => {
  selectedPalette.value = paletteKey
  const palette = predefinedPalettes[paletteKey]
  updateValue(palette.base)
}

const handleCustomColorChange = (color) => {
  customColor.value = color
  updateValue(color)
}

const toggleCustomPicker = () => {
  showCustomPicker.value = !showCustomPicker.value
}

// Initialize
onMounted(() => {
  // Find matching predefined palette
  const currentColor = typeof currentValue.value === 'string' ? currentValue.value : '#3b82f6'
  const matchingPalette = Object.entries(predefinedPalettes).find(([key, palette]) => 
    palette.base.toLowerCase() === currentColor.toLowerCase()
  )
  
  if (matchingPalette) {
    selectedPalette.value = matchingPalette[0]
  } else {
    customColor.value = currentColor
  }
})
</script>

<template>
  <div :class="containerClasses">
    <!-- Predefined palettes -->
    <div class="color-palette-picker__presets">
      <div class="color-palette-picker__presets-header">
        <h4 class="color-palette-picker__presets-title">Predefined Palettes</h4>
        <p class="color-palette-picker__presets-description">
          Choose from popular color palettes
        </p>
      </div>
      
      <div class="color-palette-picker__presets-grid">
        <button
          v-for="(palette, key) in predefinedPalettes"
          :key="key"
          type="button"
          class="color-palette-picker__preset"
          :class="{
            'color-palette-picker__preset--selected': selectedPalette === key,
            'color-palette-picker__preset--disabled': disabled
          }"
          :disabled="disabled"
          @click="handlePaletteSelect(key)"
        >
          <div class="color-palette-picker__preset-colors">
            <div 
              v-for="shade in [100, 300, 500, 700, 900]"
              :key="shade"
              class="color-palette-picker__preset-color"
              :style="{ backgroundColor: palette.palette[shade] }"
            />
          </div>
          <span class="color-palette-picker__preset-name">{{ palette.name }}</span>
        </button>
      </div>
    </div>
    
    <!-- Custom color picker -->
    <div 
      v-if="showCustom"
      class="color-palette-picker__custom"
    >
      <div class="color-palette-picker__custom-header">
        <h4 class="color-palette-picker__custom-title">Custom Color</h4>
        <Button
          :icon="showCustomPicker ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"
          text
          rounded
          size="small"
          :disabled="disabled"
          @click="toggleCustomPicker"
        />
      </div>
      
      <div 
        v-if="showCustomPicker"
        class="color-palette-picker__custom-content"
      >
        <div class="color-palette-picker__custom-input">
          <input
            type="color"
            :value="customColor"
            :disabled="disabled"
            class="color-palette-picker__native-picker"
            @input="handleCustomColorChange($event.target.value)"
          />
          <InputText
            :model-value="customColor"
            :disabled="disabled"
            :invalid="invalid || !validateColor(customColor)"
            placeholder="#000000"
            class="color-palette-picker__hex-input"
            @input="handleCustomColorChange($event.target.value)"
          />
        </div>
      </div>
    </div>
    
    <!-- Palette preview -->
    <div 
      v-if="showPreview"
      class="color-palette-picker__preview"
    >
      <div class="color-palette-picker__preview-header">
        <h4 class="color-palette-picker__preview-title">Generated Palette</h4>
        <p class="color-palette-picker__preview-description">
          Preview of the complete color palette
        </p>
      </div>
      
      <div class="color-palette-picker__preview-palette">
        <div
          v-for="(color, shade) in generatedPalette"
          :key="shade"
          class="color-palette-picker__preview-shade"
          :title="`${shade}: ${color}`"
        >
          <div 
            class="color-palette-picker__preview-color"
            :style="{ backgroundColor: color }"
          />
          <div class="color-palette-picker__preview-info">
            <span class="color-palette-picker__preview-shade-number">{{ shade }}</span>
            <span class="color-palette-picker__preview-hex">{{ color }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.color-palette-picker {
  @apply space-y-6;
}

.color-palette-picker__presets-header,
.color-palette-picker__custom-header,
.color-palette-picker__preview-header {
  @apply mb-3;
}

.color-palette-picker__presets-title,
.color-palette-picker__custom-title,
.color-palette-picker__preview-title {
  @apply text-sm font-medium text-gray-900 dark:text-white;
}

.color-palette-picker__presets-description,
.color-palette-picker__preview-description {
  @apply text-xs text-gray-500 dark:text-gray-400 mt-1;
}

.color-palette-picker__custom-header {
  @apply flex items-center justify-between;
}

.color-palette-picker__presets-grid {
  @apply grid grid-cols-2 gap-3;
}

.color-palette-picker__preset {
  @apply p-3 border border-gray-200 dark:border-gray-700 rounded-lg;
  @apply hover:border-gray-300 dark:hover:border-gray-600 transition-colors;
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500;
}

.color-palette-picker__preset--selected {
  @apply border-blue-500 bg-blue-50 dark:bg-blue-900/20;
}

.color-palette-picker__preset--disabled {
  @apply opacity-50 cursor-not-allowed;
}

.color-palette-picker__preset-colors {
  @apply flex rounded overflow-hidden mb-2 h-8;
}

.color-palette-picker__preset-color {
  @apply flex-1;
}

.color-palette-picker__preset-name {
  @apply text-xs font-medium text-gray-700 dark:text-gray-300;
}

.color-palette-picker__custom-content {
  @apply mt-3;
}

.color-palette-picker__custom-input {
  @apply flex items-center gap-3;
}

.color-palette-picker__native-picker {
  @apply w-12 h-10 border border-gray-300 dark:border-gray-600 rounded cursor-pointer;
}

.color-palette-picker__hex-input {
  @apply flex-1;
}

.color-palette-picker__preview-palette {
  @apply grid grid-cols-2 gap-2;
}

.color-palette-picker__preview-shade {
  @apply flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800 rounded;
}

.color-palette-picker__preview-color {
  @apply w-8 h-8 rounded border border-gray-300 dark:border-gray-600 flex-shrink-0;
}

.color-palette-picker__preview-info {
  @apply flex flex-col min-w-0;
}

.color-palette-picker__preview-shade-number {
  @apply text-xs font-medium text-gray-900 dark:text-white;
}

.color-palette-picker__preview-hex {
  @apply text-xs text-gray-500 dark:text-gray-400 font-mono;
}

/* Invalid state */
.color-palette-picker--invalid .color-palette-picker__preset {
  @apply border-red-300 dark:border-red-600;
}

/* Disabled state */
.color-palette-picker--disabled {
  @apply opacity-50 pointer-events-none;
}

/* Size variants */
.color-palette-picker--small .color-palette-picker__presets-grid {
  @apply grid-cols-1 gap-2;
}

.color-palette-picker--small .color-palette-picker__preset {
  @apply p-2;
}

.color-palette-picker--small .color-palette-picker__preset-colors {
  @apply h-6;
}

.color-palette-picker--large .color-palette-picker__presets-grid {
  @apply grid-cols-3 gap-4;
}

.color-palette-picker--large .color-palette-picker__preset {
  @apply p-4;
}

.color-palette-picker--large .color-palette-picker__preset-colors {
  @apply h-10;
}
</style>