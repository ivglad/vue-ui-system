<script setup>
import { useThemeDesigner } from '../composables/useThemeDesigner.js'
import ThemeDesignerDrawer from './ThemeDesignerDrawer.vue'
import ThemePreview from './ThemePreview.vue'

defineOptions({
  name: 'ThemeDesigner'
})

const props = defineProps({
  initialTheme: {
    type: Object,
    default: () => ({})
  },
  previewComponents: {
    type: Array,
    default: () => ['button', 'inputtext', 'select']
  },
  readonly: {
    type: Boolean,
    default: false
  },
  drawerPosition: {
    type: String,
    default: 'right',
    validator: (value) => ['left', 'right'].includes(value)
  },
  showHeader: {
    type: Boolean,
    default: true
  },
  autoSave: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits([
  'theme-applied',
  'theme-reset', 
  'theme-exported',
  'theme-imported',
  'setting-changed'
])

// Initialize theme designer
const themeDesigner = useThemeDesigner({
  autoSave: props.autoSave,
  storageKey: 'theme-designer-state'
})

const {
  // State
  draft,
  applied,
  isDrawerOpen,
  activeSection,
  isLoading,
  error,
  
  // Computed
  hasChanges,
  currentTheme,
  hasUnsavedChanges,
  canReset,
  
  // Methods
  updateSetting,
  getSetting,
  applyChanges,
  resetChanges,
  resetToOriginal,
  openDrawer,
  closeDrawer,
  toggleDrawer,
  setActiveSection,
  initialize,
  cleanup
} = themeDesigner

// Toast for notifications
const toast = useToast()

// Initialize on mount
onMounted(() => {
  initialize(props.initialTheme)
})

// Cleanup on unmount
onUnmounted(() => {
  cleanup()
})

// Watch for changes and emit events
watch(hasUnsavedChanges, (hasChanges) => {
  if (hasChanges) {
    emit('setting-changed', currentTheme.value)
  }
})

// Methods
const handleApplyChanges = async () => {
  try {
    await applyChanges()
    
    toast.add({
      severity: 'success',
      summary: 'Theme Applied',
      detail: 'Your theme changes have been applied successfully',
      life: 3000
    })
    
    emit('theme-applied', currentTheme.value)
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: 'Apply Failed',
      detail: err.message || 'Failed to apply theme changes',
      life: 5000
    })
  }
}

const handleResetChanges = () => {
  resetChanges()
  
  toast.add({
    severity: 'info',
    summary: 'Changes Reset',
    detail: 'Your unsaved changes have been reset',
    life: 3000
  })
  
  emit('theme-reset')
}

const handleResetToOriginal = async () => {
  try {
    await resetToOriginal()
    
    toast.add({
      severity: 'info',
      summary: 'Theme Reset',
      detail: 'Theme has been reset to original settings',
      life: 3000
    })
    
    emit('theme-reset')
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: 'Reset Failed',
      detail: err.message || 'Failed to reset theme',
      life: 5000
    })
  }
}

const handleExportTheme = () => {
  try {
    const themeData = {
      ...currentTheme.value,
      metadata: {
        name: 'Custom Theme',
        version: '1.0.0',
        created: new Date().toISOString(),
        exported: new Date().toISOString()
      }
    }
    
    // Create and download JSON file
    const blob = new Blob([JSON.stringify(themeData, null, 2)], {
      type: 'application/json'
    })
    
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `theme-${Date.now()}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    toast.add({
      severity: 'success',
      summary: 'Theme Exported',
      detail: 'Theme has been exported successfully',
      life: 3000
    })
    
    emit('theme-exported', themeData)
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: 'Export Failed',
      detail: 'Failed to export theme',
      life: 5000
    })
  }
}

const handleImportTheme = (themeData) => {
  try {
    // Apply imported theme settings
    Object.entries(themeData).forEach(([key, value]) => {
      if (key !== 'metadata') {
        updateSetting(key, value)
      }
    })
    
    toast.add({
      severity: 'success',
      summary: 'Theme Imported',
      detail: 'Theme has been imported successfully',
      life: 3000
    })
    
    emit('theme-imported', themeData)
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: 'Import Failed',
      detail: 'Failed to import theme',
      life: 5000
    })
  }
}

// Computed properties
const containerClasses = computed(() => [
  'theme-designer',
  {
    'theme-designer--drawer-open': isDrawerOpen.value,
    'theme-designer--drawer-left': props.drawerPosition === 'left',
    'theme-designer--drawer-right': props.drawerPosition === 'right',
    'theme-designer--readonly': props.readonly,
    'theme-designer--loading': isLoading.value
  }
])

const previewClasses = computed(() => [
  'theme-designer__preview',
  {
    'theme-designer__preview--drawer-open': isDrawerOpen.value,
    [`theme-designer__preview--drawer-${props.drawerPosition}`]: isDrawerOpen.value
  }
])
</script>

<template>
  <div :class="containerClasses">
    <!-- Header -->
    <header 
      v-if="showHeader"
      class="theme-designer__header"
    >
      <div class="theme-designer__header-content">
        <div class="theme-designer__header-left">
          <h2 class="theme-designer__title">
            Theme Designer
          </h2>
          <div 
            v-if="hasUnsavedChanges"
            class="theme-designer__status"
          >
            <i class="pi pi-circle-fill theme-designer__status-icon" />
            <span class="theme-designer__status-text">Unsaved changes</span>
          </div>
        </div>
        
        <div class="theme-designer__header-right">
          <!-- Quick actions -->
          <div class="theme-designer__actions">
            <Button
              v-if="canReset"
              label="Reset"
              icon="pi pi-refresh"
              severity="secondary"
              size="small"
              outlined
              :disabled="isLoading || readonly"
              @click="handleResetChanges"
            />
            
            <Button
              v-if="hasUnsavedChanges"
              label="Apply"
              icon="pi pi-check"
              size="small"
              :loading="isLoading"
              :disabled="readonly"
              @click="handleApplyChanges"
            />
            
            <Button
              icon="pi pi-cog"
              size="small"
              text
              rounded
              :class="{ 'p-button-info': isDrawerOpen }"
              @click="toggleDrawer"
            />
          </div>
        </div>
      </div>
      
      <!-- Error display -->
      <Message
        v-if="error"
        severity="error"
        :closable="true"
        class="theme-designer__error"
        @close="error = null"
      >
        {{ error }}
      </Message>
    </header>
    
    <!-- Main content -->
    <div class="theme-designer__content">
      <!-- Theme preview -->
      <main :class="previewClasses">
        <ThemePreview
          :preview-components="previewComponents"
          :current-theme="currentTheme"
          :has-changes="hasUnsavedChanges"
          :loading="isLoading"
        />
      </main>
      
      <!-- Settings drawer -->
      <ThemeDesignerDrawer
        v-model:visible="isDrawerOpen"
        v-model:active-section="activeSection"
        :position="drawerPosition"
        :readonly="readonly"
        :loading="isLoading"
        :has-changes="hasUnsavedChanges"
        :can-reset="canReset"
        :current-theme="currentTheme"
        @update-setting="updateSetting"
        @apply-changes="handleApplyChanges"
        @reset-changes="handleResetChanges"
        @reset-to-original="handleResetToOriginal"
        @export-theme="handleExportTheme"
        @import-theme="handleImportTheme"
      />
    </div>
    
    <!-- Loading overlay -->
    <div 
      v-if="isLoading"
      class="theme-designer__loading"
    >
      <ProgressSpinner />
      <span class="theme-designer__loading-text">Applying changes...</span>
    </div>
  </div>
</template>

<style scoped>
.theme-designer {
  @apply relative w-full h-full min-h-screen bg-gray-50 dark:bg-gray-900;
  @apply flex flex-col overflow-hidden;
}

.theme-designer__header {
  @apply bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700;
  @apply px-6 py-4 flex-shrink-0;
}

.theme-designer__header-content {
  @apply flex items-center justify-between;
}

.theme-designer__header-left {
  @apply flex items-center gap-4;
}

.theme-designer__title {
  @apply text-xl font-semibold text-gray-900 dark:text-white;
}

.theme-designer__status {
  @apply flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400;
}

.theme-designer__status-icon {
  @apply text-xs;
}

.theme-designer__header-right {
  @apply flex items-center gap-4;
}

.theme-designer__actions {
  @apply flex items-center gap-2;
}

.theme-designer__error {
  @apply mt-4;
}

.theme-designer__content {
  @apply flex-1 flex overflow-hidden;
}

.theme-designer__preview {
  @apply flex-1 overflow-auto;
  @apply transition-all duration-300 ease-in-out;
}

.theme-designer__preview--drawer-open {
  @apply mr-96;
}

.theme-designer__preview--drawer-left.theme-designer__preview--drawer-open {
  @apply mr-0 ml-96;
}

.theme-designer__loading {
  @apply absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center;
  @apply text-white z-50;
}

.theme-designer__loading-text {
  @apply mt-4 text-lg;
}

/* Responsive design */
@media (max-width: 1024px) {
  .theme-designer__preview--drawer-open {
    @apply mr-0;
  }
  
  .theme-designer__preview--drawer-left.theme-designer__preview--drawer-open {
    @apply ml-0;
  }
}

/* Loading state */
.theme-designer--loading {
  @apply pointer-events-none;
}

/* Readonly state */
.theme-designer--readonly .theme-designer__actions {
  @apply opacity-50 pointer-events-none;
}
</style>