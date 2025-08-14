/**
 * PrimeVue Theme Designer Module
 * 
 * A visual theme customization tool for PrimeVue 4 with Tailwind 4 integration.
 * Provides an intuitive interface for customizing themes without deep knowledge
 * of the PrimeVue token system.
 */

// Main components
export { default as ThemeDesigner } from './components/ThemeDesigner.vue'
export { default as ThemeDesignerDrawer } from './components/ThemeDesignerDrawer.vue'
export { default as ThemePreview } from './components/ThemePreview.vue'

// Section components
export { default as GlobalSection } from './components/sections/GlobalSection.vue'
export { default as ComponentGroupSection } from './components/sections/ComponentGroupSection.vue'
export { default as ComponentSection } from './components/sections/ComponentSection.vue'
export { default as PresetSection } from './components/sections/PresetSection.vue'

// Control components
export { default as SettingControl } from './components/controls/SettingControl.vue'
export { default as ColorPalettePicker } from './components/controls/ColorPalettePicker.vue'
export { default as UnitInput } from './components/controls/UnitInput.vue'
export { default as ColorPicker } from './components/controls/ColorPicker.vue'
export { default as SliderControl } from './components/controls/SliderControl.vue'
export { default as SelectControl } from './components/controls/SelectControl.vue'

// Composables
export { useThemeDesigner } from './composables/useThemeDesigner.js'
export { useThemeSettings } from './composables/useThemeSettings.js'
export { useThemePreview } from './composables/useThemePreview.js'
export { useThemeExport } from './composables/useThemeExport.js'
export { useThemeValidation } from './composables/useThemeValidation.js'

// Utilities
export * from './utils/settingTypes.js'
export * from './utils/validators.js'
export * from './utils/converters.js'
export * from './utils/tokenMapping.js'
export * from './utils/colorPalettes.js'

// Data
export * from './data/componentDefinitions.js'
export * from './data/settingGroups.js'

// Presets
export * from './presets/default.js'
export * from './presets/dark.js'
export * from './presets/corporate.js'
export * from './presets/minimal.js'

/**
 * Create and configure the theme designer module
 * @param {Object} options - Configuration options
 * @returns {Object} Module configuration
 */
export const createThemeDesigner = (options = {}) => {
  const defaultOptions = {
    // Default preview components
    previewComponents: ['button', 'inputtext', 'select', 'checkbox', 'tabs'],
    
    // Available presets
    presets: ['default', 'dark', 'corporate', 'minimal'],
    
    // Export settings
    export: {
      format: 'json',
      includeMetadata: true
    },
    
    // Validation settings
    validation: {
      strict: false,
      autoCorrect: true
    },
    
    // Storage settings
    storage: {
      key: 'primevue-theme-designer',
      persist: true
    }
  }
  
  const config = { ...defaultOptions, ...options }
  
  return {
    install(app) {
      // Make configuration available globally
      app.provide('themeDesignerConfig', config)
      
      // Register global properties if needed
      app.config.globalProperties.$themeDesigner = config
    },
    config
  }
}

// Default export
export default createThemeDesigner