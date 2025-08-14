<script setup>
defineOptions({
  name: 'PresetSection'
})

const props = defineProps({
  currentTheme: {
    type: Object,
    default: () => ({})
  },
  readonly: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update-setting', 'export-theme', 'import-theme'])

// Local state
const selectedPreset = ref('default')
const customPresets = ref([])
const showCreatePreset = ref(false)
const newPresetName = ref('')

// Toast for notifications
const toast = useToast()

// Predefined presets
const predefinedPresets = [
  {
    id: 'default',
    name: 'Default',
    description: 'Clean and modern default theme',
    preview: {
      primary: '#3b82f6',
      surface: '#ffffff',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444'
    },
    settings: {
      'colors.primary': '#3b82f6',
      'colors.surface': '#ffffff',
      'colors.success': '#10b981',
      'colors.warning': '#f59e0b',
      'colors.error': '#ef4444',
      'typography.fontSize': { value: 14, unit: 'px' },
      'typography.fontWeight': 400,
      'button.borderRadius': { value: 6, unit: 'px' },
      'input.borderRadius': { value: 4, unit: 'px' }
    }
  },
  {
    id: 'dark',
    name: 'Dark',
    description: 'Dark theme with high contrast',
    preview: {
      primary: '#6366f1',
      surface: '#1f2937',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444'
    },
    settings: {
      'colors.primary': '#6366f1',
      'colors.surface': '#1f2937',
      'colors.success': '#10b981',
      'colors.warning': '#f59e0b',
      'colors.error': '#ef4444',
      'typography.fontSize': { value: 14, unit: 'px' },
      'typography.fontWeight': 400,
      'button.borderRadius': { value: 8, unit: 'px' },
      'input.borderRadius': { value: 6, unit: 'px' }
    }
  },
  {
    id: 'corporate',
    name: 'Corporate',
    description: 'Professional corporate theme',
    preview: {
      primary: '#1e40af',
      surface: '#f8fafc',
      success: '#059669',
      warning: '#d97706',
      error: '#dc2626'
    },
    settings: {
      'colors.primary': '#1e40af',
      'colors.surface': '#f8fafc',
      'colors.success': '#059669',
      'colors.warning': '#d97706',
      'colors.error': '#dc2626',
      'typography.fontSize': { value: 15, unit: 'px' },
      'typography.fontWeight': 500,
      'button.borderRadius': { value: 4, unit: 'px' },
      'input.borderRadius': { value: 4, unit: 'px' }
    }
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean minimal design',
    preview: {
      primary: '#000000',
      surface: '#ffffff',
      success: '#22c55e',
      warning: '#eab308',
      error: '#ef4444'
    },
    settings: {
      'colors.primary': '#000000',
      'colors.surface': '#ffffff',
      'colors.success': '#22c55e',
      'colors.warning': '#eab308',
      'colors.error': '#ef4444',
      'typography.fontSize': { value: 16, unit: 'px' },
      'typography.fontWeight': 400,
      'button.borderRadius': { value: 0, unit: 'px' },
      'input.borderRadius': { value: 0, unit: 'px' }
    }
  }
]

// Computed properties
const allPresets = computed(() => {
  return [...predefinedPresets, ...customPresets.value]
})

const currentPreset = computed(() => {
  return allPresets.value.find(preset => preset.id === selectedPreset.value)
})

// Methods
const applyPreset = (preset) => {
  if (props.readonly || props.loading) return
  
  // Apply all settings from the preset
  Object.entries(preset.settings).forEach(([settingId, value]) => {
    emit('update-setting', settingId, value)
  })
  
  selectedPreset.value = preset.id
  
  toast.add({
    severity: 'success',
    summary: 'Preset Applied',
    detail: `${preset.name} theme has been applied`,
    life: 3000
  })
}

const createCustomPreset = () => {
  if (!newPresetName.value.trim()) {
    toast.add({
      severity: 'warn',
      summary: 'Name Required',
      detail: 'Please enter a name for the preset',
      life: 3000
    })
    return
  }
  
  const customPreset = {
    id: `custom-${Date.now()}`,
    name: newPresetName.value.trim(),
    description: 'Custom theme preset',
    preview: {
      primary: props.currentTheme['colors.primary'] || '#3b82f6',
      surface: props.currentTheme['colors.surface'] || '#ffffff',
      success: props.currentTheme['colors.success'] || '#10b981',
      warning: props.currentTheme['colors.warning'] || '#f59e0b',
      error: props.currentTheme['colors.error'] || '#ef4444'
    },
    settings: { ...props.currentTheme },
    custom: true,
    created: new Date().toISOString()
  }
  
  customPresets.value.push(customPreset)
  
  // Save to localStorage
  saveCustomPresets()
  
  // Reset form
  newPresetName.value = ''
  showCreatePreset.value = false
  
  toast.add({
    severity: 'success',
    summary: 'Preset Created',
    detail: `Custom preset "${customPreset.name}" has been created`,
    life: 3000
  })
}

const deleteCustomPreset = (presetId) => {
  const index = customPresets.value.findIndex(preset => preset.id === presetId)
  if (index > -1) {
    const preset = customPresets.value[index]
    customPresets.value.splice(index, 1)
    saveCustomPresets()
    
    toast.add({
      severity: 'info',
      summary: 'Preset Deleted',
      detail: `Custom preset "${preset.name}" has been deleted`,
      life: 3000
    })
  }
}

const exportPreset = (preset) => {
  const exportData = {
    name: preset.name,
    description: preset.description,
    settings: preset.settings,
    metadata: {
      version: '1.0.0',
      created: preset.created || new Date().toISOString(),
      exported: new Date().toISOString()
    }
  }
  
  const blob = new Blob([JSON.stringify(exportData, null, 2)], {
    type: 'application/json'
  })
  
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${preset.name.toLowerCase().replace(/\s+/g, '-')}-preset.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  
  toast.add({
    severity: 'success',
    summary: 'Preset Exported',
    detail: `Preset "${preset.name}" has been exported`,
    life: 3000
  })
}

const handleExportTheme = () => {
  emit('export-theme')
}

const handleImportTheme = () => {
  emit('import-theme')
}

// Storage methods
const saveCustomPresets = () => {
  try {
    localStorage.setItem('theme-designer-custom-presets', JSON.stringify(customPresets.value))
  } catch (error) {
    console.warn('Failed to save custom presets:', error)
  }
}

const loadCustomPresets = () => {
  try {
    const stored = localStorage.getItem('theme-designer-custom-presets')
    if (stored) {
      customPresets.value = JSON.parse(stored)
    }
  } catch (error) {
    console.warn('Failed to load custom presets:', error)
  }
}

// Initialize
onMounted(() => {
  loadCustomPresets()
})
</script>

<template>
  <div class="preset-section">
    <!-- Section header -->
    <div class="preset-section__header">
      <div class="preset-section__header-content">
        <div class="preset-section__header-info">
          <h3 class="preset-section__title">
            <i class="pi pi-bookmark" />
            Theme Presets
          </h3>
          <p class="preset-section__description">
            Choose from predefined themes or create your own custom presets
          </p>
        </div>
        
        <div class="preset-section__header-actions">
          <Button
            label="Create Preset"
            icon="pi pi-plus"
            size="small"
            :disabled="readonly || loading"
            @click="showCreatePreset = true"
          />
        </div>
      </div>
    </div>

    <!-- Create preset dialog -->
    <Dialog
      v-model:visible="showCreatePreset"
      modal
      header="Create Custom Preset"
      :style="{ width: '400px' }"
    >
      <div class="preset-section__create-form">
        <div class="preset-section__form-field">
          <label for="preset-name" class="preset-section__form-label">
            Preset Name
          </label>
          <InputText
            id="preset-name"
            v-model="newPresetName"
            placeholder="Enter preset name"
            class="w-full"
            @keyup.enter="createCustomPreset"
          />
        </div>
        
        <div class="preset-section__form-field">
          <p class="preset-section__form-help">
            This will save your current theme settings as a reusable preset.
          </p>
        </div>
      </div>
      
      <template #footer>
        <Button
          label="Cancel"
          severity="secondary"
          @click="showCreatePreset = false"
        />
        <Button
          label="Create"
          @click="createCustomPreset"
        />
      </template>
    </Dialog>

    <!-- Presets grid -->
    <div class="preset-section__content">
      <!-- Predefined presets -->
      <div class="preset-section__group">
        <h4 class="preset-section__group-title">Predefined Themes</h4>
        <div class="preset-section__presets-grid">
          <div
            v-for="preset in predefinedPresets"
            :key="preset.id"
            class="preset-section__preset-card"
            :class="{
              'preset-section__preset-card--selected': selectedPreset === preset.id,
              'preset-section__preset-card--disabled': readonly || loading
            }"
            @click="applyPreset(preset)"
          >
            <!-- Preview colors -->
            <div class="preset-section__preset-preview">
              <div class="preset-section__preview-colors">
                <div
                  v-for="(color, key) in preset.preview"
                  :key="key"
                  class="preset-section__preview-color"
                  :style="{ backgroundColor: color }"
                  :title="`${key}: ${color}`"
                />
              </div>
            </div>
            
            <!-- Preset info -->
            <div class="preset-section__preset-info">
              <h5 class="preset-section__preset-name">
                {{ preset.name }}
                <i 
                  v-if="selectedPreset === preset.id"
                  class="pi pi-check preset-section__preset-selected-icon"
                />
              </h5>
              <p class="preset-section__preset-description">
                {{ preset.description }}
              </p>
            </div>
            
            <!-- Actions -->
            <div class="preset-section__preset-actions">
              <Button
                icon="pi pi-download"
                text
                rounded
                size="small"
                :disabled="readonly || loading"
                @click.stop="exportPreset(preset)"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Custom presets -->
      <div 
        v-if="customPresets.length > 0"
        class="preset-section__group"
      >
        <h4 class="preset-section__group-title">Custom Themes</h4>
        <div class="preset-section__presets-grid">
          <div
            v-for="preset in customPresets"
            :key="preset.id"
            class="preset-section__preset-card"
            :class="{
              'preset-section__preset-card--selected': selectedPreset === preset.id,
              'preset-section__preset-card--disabled': readonly || loading
            }"
            @click="applyPreset(preset)"
          >
            <!-- Preview colors -->
            <div class="preset-section__preset-preview">
              <div class="preset-section__preview-colors">
                <div
                  v-for="(color, key) in preset.preview"
                  :key="key"
                  class="preset-section__preview-color"
                  :style="{ backgroundColor: color }"
                  :title="`${key}: ${color}`"
                />
              </div>
            </div>
            
            <!-- Preset info -->
            <div class="preset-section__preset-info">
              <h5 class="preset-section__preset-name">
                {{ preset.name }}
                <i 
                  v-if="selectedPreset === preset.id"
                  class="pi pi-check preset-section__preset-selected-icon"
                />
              </h5>
              <p class="preset-section__preset-description">
                {{ preset.description }}
              </p>
              <small class="preset-section__preset-meta">
                Created {{ new Date(preset.created).toLocaleDateString() }}
              </small>
            </div>
            
            <!-- Actions -->
            <div class="preset-section__preset-actions">
              <Button
                icon="pi pi-download"
                text
                rounded
                size="small"
                :disabled="readonly || loading"
                @click.stop="exportPreset(preset)"
              />
              <Button
                icon="pi pi-trash"
                text
                rounded
                size="small"
                severity="danger"
                :disabled="readonly || loading"
                @click.stop="deleteCustomPreset(preset.id)"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Import/Export section -->
      <div class="preset-section__group">
        <h4 class="preset-section__group-title">Import & Export</h4>
        <div class="preset-section__import-export">
          <div class="preset-section__import-export-content">
            <div class="preset-section__import-export-item">
              <div class="preset-section__import-export-info">
                <h5 class="preset-section__import-export-name">
                  Export Current Theme
                </h5>
                <p class="preset-section__import-export-description">
                  Export your current theme settings as a JSON file
                </p>
              </div>
              <Button
                label="Export"
                icon="pi pi-download"
                size="small"
                outlined
                :disabled="loading"
                @click="handleExportTheme"
              />
            </div>
            
            <div class="preset-section__import-export-item">
              <div class="preset-section__import-export-info">
                <h5 class="preset-section__import-export-name">
                  Import Theme
                </h5>
                <p class="preset-section__import-export-description">
                  Import theme settings from a JSON file
                </p>
              </div>
              <Button
                label="Import"
                icon="pi pi-upload"
                size="small"
                outlined
                :disabled="readonly || loading"
                @click="handleImportTheme"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.preset-section {
  @apply space-y-6;
}

/* Header */
.preset-section__header {
  @apply pb-4 border-b border-gray-200 dark:border-gray-700;
}

.preset-section__header-content {
  @apply flex items-start justify-between gap-4;
}

.preset-section__header-info {
  @apply flex-1;
}

.preset-section__title {
  @apply text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-2;
}

.preset-section__description {
  @apply text-sm text-gray-600 dark:text-gray-400;
}

/* Create form */
.preset-section__create-form {
  @apply space-y-4;
}

.preset-section__form-field {
  @apply space-y-2;
}

.preset-section__form-label {
  @apply block text-sm font-medium text-gray-700 dark:text-gray-300;
}

.preset-section__form-help {
  @apply text-sm text-gray-500 dark:text-gray-400;
}

/* Content */
.preset-section__content {
  @apply space-y-8;
}

.preset-section__group {
  @apply space-y-4;
}

.preset-section__group-title {
  @apply text-base font-medium text-gray-900 dark:text-white;
}

/* Presets grid */
.preset-section__presets-grid {
  @apply grid grid-cols-1 sm:grid-cols-2 gap-4;
}

.preset-section__preset-card {
  @apply bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700;
  @apply rounded-lg p-4 cursor-pointer transition-all duration-200;
  @apply hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md;
}

.preset-section__preset-card--selected {
  @apply border-blue-500 bg-blue-50 dark:bg-blue-900/20;
}

.preset-section__preset-card--disabled {
  @apply opacity-50 cursor-not-allowed;
}

/* Preview */
.preset-section__preset-preview {
  @apply mb-3;
}

.preset-section__preview-colors {
  @apply flex rounded overflow-hidden h-8;
}

.preset-section__preview-color {
  @apply flex-1;
}

/* Preset info */
.preset-section__preset-info {
  @apply flex-1 space-y-1;
}

.preset-section__preset-name {
  @apply font-medium text-gray-900 dark:text-white flex items-center justify-between;
}

.preset-section__preset-selected-icon {
  @apply text-blue-500 text-sm;
}

.preset-section__preset-description {
  @apply text-sm text-gray-600 dark:text-gray-400;
}

.preset-section__preset-meta {
  @apply text-xs text-gray-500 dark:text-gray-400;
}

.preset-section__preset-actions {
  @apply flex items-center gap-1 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700;
}

/* Import/Export */
.preset-section__import-export {
  @apply bg-gray-50 dark:bg-gray-800 rounded-lg p-4;
}

.preset-section__import-export-content {
  @apply space-y-4;
}

.preset-section__import-export-item {
  @apply flex items-center justify-between gap-4;
}

.preset-section__import-export-info {
  @apply flex-1;
}

.preset-section__import-export-name {
  @apply font-medium text-gray-900 dark:text-white mb-1;
}

.preset-section__import-export-description {
  @apply text-sm text-gray-600 dark:text-gray-400;
}

/* Responsive */
@media (max-width: 640px) {
  .preset-section__header-content {
    @apply flex-col items-stretch;
  }
  
  .preset-section__presets-grid {
    @apply grid-cols-1;
  }
  
  .preset-section__import-export-item {
    @apply flex-col items-stretch gap-2;
  }
}
</style>