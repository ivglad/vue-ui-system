# Theme Designer Examples

This document provides comprehensive examples of how to use the PrimeVue Theme Designer in various scenarios.

## Basic Examples

### 1. Simple Theme Designer

The most basic implementation with default settings:

```vue
<script setup>
import { ThemeDesigner } from '@/theme-designer'

const handleThemeApplied = (theme) => {
  console.log('New theme applied:', theme)
}
</script>

<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6">Theme Customization</h1>
    <ThemeDesigner @theme-applied="handleThemeApplied" />
  </div>
</template>
```

### 2. Theme Designer with Custom Preview Components

Show specific components in the preview:

```vue
<script setup>
import { ThemeDesigner } from '@/theme-designer'

const previewComponents = [
  'button',
  'inputtext', 
  'select',
  'card',
  'datatable',
  'dialog',
  'toast'
]
</script>

<template>
  <ThemeDesigner :preview-components="previewComponents" />
</template>
```

### 3. Theme Designer with Initial Theme

Load with a predefined theme:

```vue
<script setup>
import { ThemeDesigner } from '@/theme-designer'
import { THEME_PRESETS } from '@/theme-designer/presets'

const initialTheme = {
  'colors.primary': '#10b981',
  'colors.surface': '#ffffff',
  'button.borderRadius': { value: 8, unit: 'px' },
  'typography.fontSize': { value: 16, unit: 'px' }
}

// Or use a preset
const darkTheme = THEME_PRESETS.dark.settings
</script>

<template>
  <ThemeDesigner 
    :initial-theme="initialTheme"
    drawer-position="left"
  />
</template>
```

## Advanced Examples

### 4. Custom Theme Management

Build your own theme management system:

```vue
<script setup>
import { ref, computed, watch } from 'vue'
import { useThemeDesigner, useThemeExport } from '@/theme-designer'

// Custom state management
const themes = ref([
  { id: 1, name: 'Corporate Blue', settings: { 'colors.primary': '#1e40af' } },
  { id: 2, name: 'Nature Green', settings: { 'colors.primary': '#059669' } },
  { id: 3, name: 'Sunset Orange', settings: { 'colors.primary': '#ea580c' } }
])

const selectedThemeId = ref(1)
const customTheme = ref({})

// Composables
const {
  draft,
  applied,
  hasChanges,
  updateSetting,
  applyChanges,
  resetChanges,
  initialize
} = useThemeDesigner()

const { exportTheme, importTheme } = useThemeExport()

// Computed
const selectedTheme = computed(() => {
  return themes.value.find(t => t.id === selectedThemeId.value)
})

const currentThemeSettings = computed(() => {
  return selectedTheme.value?.settings || customTheme.value
})

// Methods
const loadTheme = (themeId) => {
  selectedThemeId.value = themeId
  const theme = themes.value.find(t => t.id === themeId)
  if (theme) {
    initialize(theme.settings)
  }
}

const saveAsNewTheme = async () => {
  const name = prompt('Enter theme name:')
  if (name && hasChanges.value) {
    await applyChanges()
    themes.value.push({
      id: Date.now(),
      name,
      settings: { ...applied.value }
    })
  }
}

const exportCurrentTheme = async () => {
  const exported = await exportTheme(applied.value)
  const blob = new Blob([JSON.stringify(exported, null, 2)], {
    type: 'application/json'
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${selectedTheme.value?.name || 'custom'}-theme.json`
  link.click()
  URL.revokeObjectURL(url)
}

const importThemeFile = async (event) => {
  const file = event.target.files[0]
  if (file) {
    try {
      const text = await file.text()
      const themeData = JSON.parse(text)
      const imported = await importTheme(themeData)
      customTheme.value = imported
      selectedThemeId.value = null
      initialize(imported)
    } catch (error) {
      alert('Failed to import theme: ' + error.message)
    }
  }
}

// Watch for theme changes
watch(selectedThemeId, (newId) => {
  if (newId) {
    loadTheme(newId)
  }
})
</script>

<template>
  <div class="theme-management-example">
    <!-- Theme Selection -->
    <div class="mb-6 p-4 bg-gray-50 rounded-lg">
      <h3 class="text-lg font-semibold mb-4">Theme Library</h3>
      <div class="flex flex-wrap gap-2 mb-4">
        <Button
          v-for="theme in themes"
          :key="theme.id"
          :label="theme.name"
          :severity="selectedThemeId === theme.id ? 'primary' : 'secondary'"
          :outlined="selectedThemeId !== theme.id"
          size="small"
          @click="loadTheme(theme.id)"
        />
        <Button
          label="Custom"
          :severity="!selectedThemeId ? 'primary' : 'secondary'"
          :outlined="!!selectedThemeId"
          size="small"
          @click="selectedThemeId = null"
        />
      </div>
      
      <!-- Actions -->
      <div class="flex gap-2">
        <Button
          label="Save as New"
          icon="pi pi-save"
          size="small"
          :disabled="!hasChanges"
          @click="saveAsNewTheme"
        />
        <Button
          label="Export"
          icon="pi pi-download"
          size="small"
          @click="exportCurrentTheme"
        />
        <input
          type="file"
          accept=".json"
          class="hidden"
          ref="fileInput"
          @change="importThemeFile"
        />
        <Button
          label="Import"
          icon="pi pi-upload"
          size="small"
          @click="$refs.fileInput.click()"
        />
      </div>
    </div>

    <!-- Theme Designer -->
    <ThemeDesigner
      :initial-theme="currentThemeSettings"
      :preview-components="['button', 'inputtext', 'card', 'datatable']"
      @theme-applied="() => console.log('Theme applied')"
    />
  </div>
</template>
```

### 5. Theme Designer with Custom Validation

Add custom validation rules:

```vue
<script setup>
import { ThemeDesigner } from '@/theme-designer'
import { useThemeValidation } from '@/theme-designer'

const { validateValue } = useThemeValidation()

// Custom validation function
const customValidation = (value, setting) => {
  // Example: Ensure primary color has sufficient contrast
  if (setting.id === 'colors.primary') {
    const brightness = getBrightness(value)
    if (brightness < 50) {
      return {
        isValid: false,
        errors: ['Primary color is too dark for accessibility']
      }
    }
  }
  
  return { isValid: true, errors: [] }
}

const getBrightness = (hexColor) => {
  const rgb = hexToRgb(hexColor)
  return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000
}

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}
</script>

<template>
  <ThemeDesigner
    :custom-validation="customValidation"
    @validation-error="handleValidationError"
  />
</template>
```

### 6. Readonly Theme Viewer

Display themes without editing capabilities:

```vue
<script setup>
import { ref } from 'vue'
import { ThemeDesigner } from '@/theme-designer'

const themes = ref([
  {
    name: 'Light Theme',
    settings: {
      'colors.primary': '#3b82f6',
      'colors.surface': '#ffffff',
      'button.borderRadius': { value: 6, unit: 'px' }
    }
  },
  {
    name: 'Dark Theme', 
    settings: {
      'colors.primary': '#8b5cf6',
      'colors.surface': '#1f2937',
      'button.borderRadius': { value: 8, unit: 'px' }
    }
  }
])

const selectedTheme = ref(0)
</script>

<template>
  <div class="theme-viewer">
    <!-- Theme Selector -->
    <div class="mb-4">
      <SelectButton
        v-model="selectedTheme"
        :options="themes.map((t, i) => ({ label: t.name, value: i }))"
        option-label="label"
        option-value="value"
      />
    </div>

    <!-- Readonly Theme Designer -->
    <ThemeDesigner
      :initial-theme="themes[selectedTheme].settings"
      readonly
      :show-header="false"
      :preview-components="['button', 'inputtext', 'card']"
    />
  </div>
</template>
```

## Integration Examples

### 7. Integration with Pinia Store

Integrate with a Pinia store for global theme management:

```javascript
// stores/themeStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  // State
  const currentTheme = ref({})
  const savedThemes = ref([])
  const isLoading = ref(false)

  // Getters
  const hasCustomTheme = computed(() => {
    return Object.keys(currentTheme.value).length > 0
  })

  // Actions
  const applyTheme = async (theme) => {
    isLoading.value = true
    try {
      currentTheme.value = { ...theme }
      // Apply to PrimeVue
      await applyThemeToPrimeVue(theme)
      // Save to localStorage
      localStorage.setItem('current-theme', JSON.stringify(theme))
    } finally {
      isLoading.value = false
    }
  }

  const saveTheme = (name, theme) => {
    const newTheme = {
      id: Date.now(),
      name,
      settings: { ...theme },
      createdAt: new Date().toISOString()
    }
    savedThemes.value.push(newTheme)
    localStorage.setItem('saved-themes', JSON.stringify(savedThemes.value))
  }

  const loadSavedThemes = () => {
    const saved = localStorage.getItem('saved-themes')
    if (saved) {
      savedThemes.value = JSON.parse(saved)
    }
  }

  const resetTheme = () => {
    currentTheme.value = {}
    localStorage.removeItem('current-theme')
  }

  return {
    currentTheme,
    savedThemes,
    isLoading,
    hasCustomTheme,
    applyTheme,
    saveTheme,
    loadSavedThemes,
    resetTheme
  }
})
```

```vue
<!-- Component using the store -->
<script setup>
import { ThemeDesigner } from '@/theme-designer'
import { useThemeStore } from '@/stores/themeStore'

const themeStore = useThemeStore()

const handleThemeApplied = async (theme) => {
  await themeStore.applyTheme(theme)
}

const handleSaveTheme = () => {
  const name = prompt('Enter theme name:')
  if (name) {
    themeStore.saveTheme(name, themeStore.currentTheme)
  }
}
</script>

<template>
  <div>
    <div class="mb-4 flex gap-2">
      <Button
        label="Save Current Theme"
        :disabled="!themeStore.hasCustomTheme"
        @click="handleSaveTheme"
      />
      <Button
        label="Reset to Default"
        severity="secondary"
        @click="themeStore.resetTheme"
      />
    </div>

    <ThemeDesigner
      :initial-theme="themeStore.currentTheme"
      @theme-applied="handleThemeApplied"
    />
  </div>
</template>
```

### 8. Theme Designer in Modal

Use the theme designer in a modal dialog:

```vue
<script setup>
import { ref } from 'vue'
import { ThemeDesigner } from '@/theme-designer'

const showThemeDesigner = ref(false)
const tempTheme = ref({})

const openThemeDesigner = () => {
  showThemeDesigner.value = true
}

const handleThemeApplied = (theme) => {
  tempTheme.value = theme
}

const confirmTheme = () => {
  // Apply the theme to the main application
  console.log('Applying theme:', tempTheme.value)
  showThemeDesigner.value = false
}

const cancelTheme = () => {
  tempTheme.value = {}
  showThemeDesigner.value = false
}
</script>

<template>
  <div>
    <Button
      label="Customize Theme"
      icon="pi pi-palette"
      @click="openThemeDesigner"
    />

    <Dialog
      v-model:visible="showThemeDesigner"
      header="Theme Designer"
      :style="{ width: '90vw', height: '90vh' }"
      :modal="true"
      :closable="false"
    >
      <ThemeDesigner
        :show-header="false"
        @theme-applied="handleThemeApplied"
      />

      <template #footer>
        <Button
          label="Cancel"
          severity="secondary"
          @click="cancelTheme"
        />
        <Button
          label="Apply Theme"
          @click="confirmTheme"
        />
      </template>
    </Dialog>
  </div>
</template>
```

## Composable Examples

### 9. Using Composables Directly

Build custom interfaces using the theme designer composables:

```vue
<script setup>
import { ref } from 'vue'
import { 
  useThemeDesigner, 
  useThemeValidation, 
  useThemeExport 
} from '@/theme-designer'

// Use composables directly
const {
  draft,
  applied,
  hasChanges,
  updateSetting,
  applyChanges,
  resetChanges
} = useThemeDesigner()

const { validateValue } = useThemeValidation()
const { exportTheme } = useThemeExport()

// Custom color picker
const primaryColor = ref('#3b82f6')
const secondaryColor = ref('#6b7280')

const updatePrimaryColor = (color) => {
  const validation = validateValue(color, { required: true, type: 'color' })
  if (validation.isValid) {
    updateSetting('colors.primary', color)
    primaryColor.value = color
  }
}

const updateSecondaryColor = (color) => {
  updateSetting('colors.secondary', color)
  secondaryColor.value = color
}

// Quick theme presets
const quickPresets = [
  { name: 'Blue', primary: '#3b82f6', secondary: '#6b7280' },
  { name: 'Green', primary: '#10b981', secondary: '#6b7280' },
  { name: 'Purple', primary: '#8b5cf6', secondary: '#6b7280' },
  { name: 'Red', primary: '#ef4444', secondary: '#6b7280' }
]

const applyQuickPreset = (preset) => {
  updatePrimaryColor(preset.primary)
  updateSecondaryColor(preset.secondary)
}
</script>

<template>
  <div class="custom-theme-interface">
    <Card>
      <template #title>Quick Theme Customization</template>
      <template #content>
        <!-- Quick Presets -->
        <div class="mb-6">
          <h4 class="text-lg font-medium mb-3">Quick Presets</h4>
          <div class="flex gap-2">
            <Button
              v-for="preset in quickPresets"
              :key="preset.name"
              :label="preset.name"
              size="small"
              @click="applyQuickPreset(preset)"
            />
          </div>
        </div>

        <!-- Color Pickers -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label class="block text-sm font-medium mb-2">Primary Color</label>
            <ColorPicker
              v-model="primaryColor"
              @change="updatePrimaryColor"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Secondary Color</label>
            <ColorPicker
              v-model="secondaryColor"
              @change="updateSecondaryColor"
            />
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-2">
          <Button
            label="Apply Changes"
            :disabled="!hasChanges"
            @click="applyChanges"
          />
          <Button
            label="Reset"
            severity="secondary"
            :disabled="!hasChanges"
            @click="resetChanges"
          />
          <Button
            label="Export"
            severity="secondary"
            @click="() => exportTheme(applied)"
          />
        </div>
      </template>
    </Card>
  </div>
</template>
```

## Error Handling Examples

### 10. Comprehensive Error Handling

Handle various error scenarios:

```vue
<script setup>
import { ref } from 'vue'
import { ThemeDesigner } from '@/theme-designer'
import { useToast } from 'primevue/usetoast'

const toast = useToast()
const errors = ref([])

const handleThemeError = (error) => {
  console.error('Theme error:', error)
  errors.value.push(error)
  
  toast.add({
    severity: 'error',
    summary: 'Theme Error',
    detail: error.message,
    life: 5000
  })
}

const handleValidationError = (error) => {
  toast.add({
    severity: 'warn',
    summary: 'Validation Error',
    detail: `${error.field}: ${error.message}`,
    life: 3000
  })
}

const handleImportError = (error) => {
  toast.add({
    severity: 'error',
    summary: 'Import Failed',
    detail: 'The theme file could not be imported. Please check the format.',
    life: 5000
  })
}

const clearErrors = () => {
  errors.value = []
}
</script>

<template>
  <div>
    <!-- Error Display -->
    <Message
      v-if="errors.length > 0"
      severity="error"
      class="mb-4"
    >
      <div class="flex justify-between items-center">
        <span>{{ errors.length }} error(s) occurred</span>
        <Button
          label="Clear"
          size="small"
          text
          @click="clearErrors"
        />
      </div>
    </Message>

    <!-- Theme Designer with Error Handling -->
    <ThemeDesigner
      @theme-error="handleThemeError"
      @validation-error="handleValidationError"
      @import-error="handleImportError"
    />

    <!-- Toast for notifications -->
    <Toast />
  </div>
</template>
```

These examples demonstrate the flexibility and power of the PrimeVue Theme Designer. You can adapt them to your specific needs and build custom theme management solutions for your applications.