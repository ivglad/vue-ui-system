/**
 * Main theme designer composable
 * Manages the overall state and operations of the theme designer
 */

import { updatePreset, updatePrimaryPalette, updateSurfacePalette } from '@primevue/core/api'

// Helper function to set nested object property
const setNestedProperty = (obj, path, value) => {
  const keys = path.split('.')
  let current = obj
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    if (!(key in current) || typeof current[key] !== 'object') {
      current[key] = {}
    }
    current = current[key]
  }
  
  current[keys[keys.length - 1]] = value
}

// Helper function to get nested object property
const getNestedProperty = (obj, path) => {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined
  }, obj)
}

// Helper function to check if two objects are equal (shallow comparison for performance)
const isEqual = (obj1, obj2) => {
  const keys1 = Object.keys(obj1 || {})
  const keys2 = Object.keys(obj2 || {})
  
  if (keys1.length !== keys2.length) return false
  
  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) return false
  }
  
  return true
}

export const useThemeDesigner = (options = {}) => {
  // Configuration
  const config = {
    autoSave: true,
    storageKey: 'theme-designer-state',
    ...options
  }
  
  // Core state management using draft/applied pattern
  const draft = ref({})
  const applied = ref({})
  const original = ref({})
  
  // UI state
  const isDrawerOpen = ref(false)
  const activeSection = ref('global')
  const isLoading = ref(false)
  const error = ref(null)
  
  // Computed properties
  const hasChanges = computed(() => {
    return !isEqual(draft.value, applied.value)
  })
  
  const currentTheme = computed(() => {
    // Merge applied settings with draft changes
    return { ...applied.value, ...draft.value }
  })
  
  const hasUnsavedChanges = computed(() => {
    return Object.keys(draft.value).length > 0
  })
  
  const canReset = computed(() => {
    return hasChanges.value || hasUnsavedChanges.value
  })
  
  // Methods for managing settings
  const updateSetting = (path, value) => {
    try {
      // Validate the path
      if (!path || typeof path !== 'string') {
        throw new Error('Invalid setting path')
      }
      
      // Update draft state
      const newDraft = { ...draft.value }
      setNestedProperty(newDraft, path, value)
      draft.value = newDraft
      
      // Clear any previous errors
      error.value = null
      
      // Auto-save to localStorage if enabled
      if (config.autoSave) {
        saveToLocalStorage()
      }
      
      console.log(`Setting updated: ${path} =`, value)
    } catch (err) {
      error.value = `Failed to update setting: ${err.message}`
      console.error('Error updating setting:', err)
    }
  }
  
  const getSetting = (path) => {
    // First check draft, then applied, then original
    return getNestedProperty(draft.value, path) ?? 
           getNestedProperty(applied.value, path) ?? 
           getNestedProperty(original.value, path)
  }
  
  const applyChanges = async () => {
    if (!hasUnsavedChanges.value) {
      console.log('No changes to apply')
      return
    }
    
    isLoading.value = true
    error.value = null
    
    try {
      // Import the token mapping function
      const { applyThemeChanges } = await import('../utils/tokenMapping.js')
      
      // Apply changes to PrimeVue theme system
      await applyThemeChanges(draft.value)
      
      // Move draft changes to applied state
      applied.value = { ...applied.value, ...draft.value }
      draft.value = {}
      
      // Save to localStorage
      saveToLocalStorage()
      
      console.log('Theme changes applied successfully')
    } catch (err) {
      error.value = `Failed to apply changes: ${err.message}`
      console.error('Error applying changes:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  const resetChanges = () => {
    try {
      // Clear draft changes
      draft.value = {}
      
      // Clear any errors
      error.value = null
      
      // Save to localStorage
      if (config.autoSave) {
        saveToLocalStorage()
      }
      
      console.log('Changes reset')
    } catch (err) {
      error.value = `Failed to reset changes: ${err.message}`
      console.error('Error resetting changes:', err)
    }
  }
  
  const resetToOriginal = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      // Import the token mapping function
      const { resetThemeToDefault } = await import('../utils/tokenMapping.js')
      
      // Reset to default theme
      await resetThemeToDefault()
      
      // Clear all state
      draft.value = {}
      applied.value = {}
      
      // Save to localStorage
      saveToLocalStorage()
      
      console.log('Theme reset to original')
    } catch (err) {
      error.value = `Failed to reset to original: ${err.message}`
      console.error('Error resetting to original:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }
  

  
  // Storage management
  const saveToLocalStorage = () => {
    try {
      const state = {
        draft: draft.value,
        applied: applied.value,
        original: original.value,
        activeSection: activeSection.value,
        timestamp: Date.now()
      }
      
      localStorage.setItem(config.storageKey, JSON.stringify(state))
    } catch (err) {
      console.warn('Failed to save to localStorage:', err)
    }
  }
  
  const loadFromLocalStorage = () => {
    try {
      const stored = localStorage.getItem(config.storageKey)
      if (!stored) return false
      
      const state = JSON.parse(stored)
      
      // Validate stored state
      if (state && typeof state === 'object') {
        draft.value = state.draft || {}
        applied.value = state.applied || {}
        original.value = state.original || {}
        activeSection.value = state.activeSection || 'global'
        
        return true
      }
    } catch (err) {
      console.warn('Failed to load from localStorage:', err)
    }
    
    return false
  }
  
  // UI state management
  const openDrawer = () => {
    isDrawerOpen.value = true
  }
  
  const closeDrawer = () => {
    isDrawerOpen.value = false
  }
  
  const toggleDrawer = () => {
    isDrawerOpen.value = !isDrawerOpen.value
  }
  
  const setActiveSection = (section) => {
    activeSection.value = section
    if (config.autoSave) {
      saveToLocalStorage()
    }
  }
  
  // Initialization
  const initialize = (initialTheme = {}) => {
    // Set original theme
    original.value = { ...initialTheme }
    
    // Try to load from localStorage
    if (!loadFromLocalStorage()) {
      // If no stored state, use initial theme as applied
      applied.value = { ...initialTheme }
    }
    
    console.log('Theme designer initialized')
  }
  
  // Cleanup
  const cleanup = () => {
    // Save current state before cleanup
    if (config.autoSave) {
      saveToLocalStorage()
    }
  }
  
  // Auto-save on page unload
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', cleanup)
  }
  
  return {
    // State
    draft: readonly(draft),
    applied: readonly(applied),
    original: readonly(original),
    isDrawerOpen,
    activeSection,
    isLoading: readonly(isLoading),
    error: readonly(error),
    
    // Computed
    hasChanges,
    currentTheme,
    hasUnsavedChanges,
    canReset,
    
    // Setting management
    updateSetting,
    getSetting,
    applyChanges,
    resetChanges,
    resetToOriginal,
    
    // UI management
    openDrawer,
    closeDrawer,
    toggleDrawer,
    setActiveSection,
    
    // Lifecycle
    initialize,
    cleanup
  }
}