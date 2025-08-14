<script setup>
import { ThemeDesigner } from '@/theme-designer'
import { THEME_PRESETS } from '@/theme-designer/presets'

defineOptions({
  name: 'Theme'
})

// Page metadata
const title = 'Theme Designer'
const description = 'Customize your PrimeVue theme with visual controls'

// Router and route
const router = useRouter()
const route = useRoute()

// Toast for notifications
const toast = useToast()

// Page state
const isLoading = ref(false)
const pageError = ref(null)

// Theme designer configuration
const themeDesignerConfig = {
  previewComponents: [
    'button', 'inputtext', 'select', 'checkbox', 'radiobutton',
    'tabs', 'card', 'message', 'datatable', 'dialog'
  ],
  autoSave: true,
  showHeader: true,
  drawerPosition: 'right'
}

// Initialize with preset if specified in route
const initialTheme = computed(() => {
  const presetId = route.query.preset
  if (presetId && THEME_PRESETS[presetId]) {
    return THEME_PRESETS[presetId].settings
  }
  return {}
})

// Event handlers
const handleThemeApplied = (theme) => {
  console.log('Theme applied:', theme)
  
  toast.add({
    severity: 'success',
    summary: 'Theme Applied',
    detail: 'Your theme changes have been applied successfully',
    life: 3000
  })
  
  // Update URL to reflect current state (optional)
  // router.replace({ query: { ...route.query, applied: Date.now() } })
}

const handleThemeReset = () => {
  console.log('Theme reset')
  
  toast.add({
    severity: 'info',
    summary: 'Theme Reset',
    detail: 'Theme has been reset to default settings',
    life: 3000
  })
}

const handleThemeExported = (theme) => {
  console.log('Theme exported:', theme)
  
  toast.add({
    severity: 'success',
    summary: 'Theme Exported',
    detail: 'Theme has been exported successfully',
    life: 3000
  })
}

const handleThemeImported = (theme) => {
  console.log('Theme imported:', theme)
  
  toast.add({
    severity: 'success',
    summary: 'Theme Imported',
    detail: 'Theme has been imported successfully',
    life: 3000
  })
}

const handleSettingChanged = (theme) => {
  // Optional: Update URL with current theme state
  // This could be useful for sharing theme configurations
  console.log('Settings changed:', Object.keys(theme).length, 'settings')
}

// Navigation helpers
const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/')
  }
}

const loadPreset = (presetId) => {
  router.push({ 
    name: 'Theme Designer', 
    query: { preset: presetId } 
  })
}

// Page lifecycle
onMounted(() => {
  // Set page title
  document.title = `${title} - PrimeVue Theme Designer`
  
  // Add meta description
  const metaDescription = document.querySelector('meta[name="description"]')
  if (metaDescription) {
    metaDescription.setAttribute('content', description)
  }
})

// Handle route changes
watch(() => route.query.preset, (newPreset) => {
  if (newPreset && !THEME_PRESETS[newPreset]) {
    toast.add({
      severity: 'warn',
      summary: 'Unknown Preset',
      detail: `Preset "${newPreset}" not found, using default theme`,
      life: 5000
    })
  }
})

// Error handling
const handleError = (error) => {
  console.error('Theme designer error:', error)
  pageError.value = error.message || 'An unexpected error occurred'
  
  toast.add({
    severity: 'error',
    summary: 'Error',
    detail: error.message || 'An unexpected error occurred',
    life: 5000
  })
}

// Keyboard shortcuts
const handleKeydown = (event) => {
  // Ctrl/Cmd + S to save (prevent default browser save)
  if ((event.ctrlKey || event.metaKey) && event.key === 's') {
    event.preventDefault()
    // Theme designer will handle the save internally
  }
  
  // Escape to go back
  if (event.key === 'Escape' && !event.target.closest('.theme-designer-drawer')) {
    goBack()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="theme-page">
    <!-- Loading overlay -->
    <div 
      v-if="isLoading"
      class="theme-page__loading"
    >
      <ProgressSpinner />
      <span class="theme-page__loading-text">Loading theme designer...</span>
    </div>
    
    <!-- Error state -->
    <div 
      v-else-if="pageError"
      class="theme-page__error"
    >
      <div class="theme-page__error-content">
        <i class="pi pi-exclamation-triangle theme-page__error-icon" />
        <h2 class="theme-page__error-title">Something went wrong</h2>
        <p class="theme-page__error-message">{{ pageError }}</p>
        <div class="theme-page__error-actions">
          <Button
            label="Go Back"
            icon="pi pi-arrow-left"
            @click="goBack"
          />
          <Button
            label="Reload Page"
            icon="pi pi-refresh"
            severity="secondary"
            @click="window.location.reload()"
          />
        </div>
      </div>
    </div>
    
    <!-- Theme designer -->
    <div 
      v-else
      class="theme-page__content"
    >
      <ThemeDesigner 
        v-bind="themeDesignerConfig"
        :initial-theme="initialTheme"
        @theme-applied="handleThemeApplied"
        @theme-reset="handleThemeReset"
        @theme-exported="handleThemeExported"
        @theme-imported="handleThemeImported"
        @setting-changed="handleSettingChanged"
        @error="handleError"
      />
    </div>
    
    <!-- Quick preset selector (floating) -->
    <div class="theme-page__quick-presets">
      <div class="theme-page__quick-presets-content">
        <span class="theme-page__quick-presets-label">Quick presets:</span>
        <div class="theme-page__quick-presets-buttons">
          <Button
            v-for="(preset, id) in THEME_PRESETS"
            :key="id"
            :label="preset.name"
            size="small"
            text
            :class="{ 'p-button-info': route.query.preset === id }"
            @click="loadPreset(id)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.theme-page {
  @apply min-h-screen bg-gray-50 dark:bg-gray-900 relative;
}

.theme-page__loading {
  @apply fixed inset-0 bg-white dark:bg-gray-900 flex flex-col items-center justify-center z-50;
}

.theme-page__loading-text {
  @apply mt-4 text-lg text-gray-600 dark:text-gray-400;
}

.theme-page__error {
  @apply min-h-screen flex items-center justify-center p-6;
}

.theme-page__error-content {
  @apply text-center max-w-md;
}

.theme-page__error-icon {
  @apply text-5xl text-red-500 mb-4;
}

.theme-page__error-title {
  @apply text-2xl font-bold text-gray-900 dark:text-white mb-2;
}

.theme-page__error-message {
  @apply text-gray-600 dark:text-gray-400 mb-6;
}

.theme-page__error-actions {
  @apply flex items-center justify-center gap-3;
}

.theme-page__content {
  @apply w-full h-full;
}

.theme-page__quick-presets {
  @apply fixed bottom-6 left-6 z-40;
  @apply bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700;
  @apply p-3;
}

.theme-page__quick-presets-content {
  @apply flex items-center gap-3;
}

.theme-page__quick-presets-label {
  @apply text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap;
}

.theme-page__quick-presets-buttons {
  @apply flex items-center gap-1;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .theme-page__quick-presets {
    @apply left-4 right-4 bottom-4;
  }
  
  .theme-page__quick-presets-content {
    @apply flex-col items-stretch gap-2;
  }
  
  .theme-page__quick-presets-buttons {
    @apply flex-wrap justify-center;
  }
}

/* Hide quick presets when drawer is open on mobile */
@media (max-width: 1024px) {
  .theme-designer--drawer-open ~ .theme-page__quick-presets {
    @apply hidden;
  }
}
</style>