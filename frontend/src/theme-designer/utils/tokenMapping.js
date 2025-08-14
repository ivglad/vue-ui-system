/**
 * Token mapping utilities
 * Maps theme designer settings to PrimeVue tokens and handles theme application
 */

import { updatePreset, updatePrimaryPalette, updateSurfacePalette } from '@primevue/core/api'
import { generatePalette } from './colorPalettes.js'
import { sizeToCSS } from './converters.js'

/**
 * Token mapping definitions
 * Maps setting paths to PrimeVue token paths and conversion functions
 */
export const TokenMappings = {
  // Global color settings
  'colors.primary': {
    type: 'palette',
    handler: async (value) => {
      const palette = typeof value === 'object' ? value : generatePalette(value)
      await updatePrimaryPalette(palette)
    }
  },
  
  'colors.surface': {
    type: 'palette', 
    handler: async (value) => {
      const palette = typeof value === 'object' ? value : generatePalette(value)
      await updateSurfacePalette(palette)
    }
  },
  
  'colors.success': {
    type: 'semantic',
    tokens: ['green'],
    handler: async (value) => {
      const palette = generatePalette(value)
      await updatePreset({
        semantic: {
          colorScheme: {
            light: { green: palette },
            dark: { green: palette }
          }
        }
      })
    }
  },
  
  'colors.warning': {
    type: 'semantic',
    tokens: ['yellow'],
    handler: async (value) => {
      const palette = generatePalette(value)
      await updatePreset({
        semantic: {
          colorScheme: {
            light: { yellow: palette },
            dark: { yellow: palette }
          }
        }
      })
    }
  },
  
  'colors.error': {
    type: 'semantic',
    tokens: ['red'],
    handler: async (value) => {
      const palette = generatePalette(value)
      await updatePreset({
        semantic: {
          colorScheme: {
            light: { red: palette },
            dark: { red: palette }
          }
        }
      })
    }
  },
  
  // Typography settings
  'typography.fontSize': {
    type: 'token',
    tokens: ['root.font.size'],
    converter: (value) => sizeToCSS(value)
  },
  
  'typography.fontWeight': {
    type: 'token',
    tokens: ['root.font.weight'],
    converter: (value) => String(value)
  },
  
  'typography.lineHeight': {
    type: 'token',
    tokens: ['root.line.height'],
    converter: (value) => String(value)
  },
  
  // Spacing settings
  'spacing.base': {
    type: 'token',
    tokens: ['root.spacing'],
    converter: (value) => sizeToCSS(value)
  },
  
  'spacing.component': {
    type: 'token',
    tokens: ['component.gap'],
    converter: (value) => sizeToCSS(value)
  },
  
  // Button component settings
  'button.borderRadius': {
    type: 'token',
    tokens: [
      'button.border.radius',
      'button.rounded.border.radius'
    ],
    converter: (value) => sizeToCSS(value)
  },
  
  'button.padding': {
    type: 'token',
    tokens: [
      'button.padding.x',
      'button.padding.y'
    ],
    converter: (value) => sizeToCSS(value)
  },
  
  'button.fontSize': {
    type: 'token',
    tokens: ['button.font.size'],
    converter: (value) => sizeToCSS(value)
  },
  
  'button.fontWeight': {
    type: 'token',
    tokens: ['button.font.weight'],
    converter: (value) => String(value)
  },
  
  // Input component settings
  'input.borderRadius': {
    type: 'token',
    tokens: [
      'inputtext.border.radius',
      'select.border.radius',
      'textarea.border.radius'
    ],
    converter: (value) => sizeToCSS(value)
  },
  
  'input.padding': {
    type: 'token',
    tokens: [
      'inputtext.padding.x',
      'inputtext.padding.y',
      'select.padding.x',
      'select.padding.y'
    ],
    converter: (value) => sizeToCSS(value)
  },
  
  'input.fontSize': {
    type: 'token',
    tokens: [
      'inputtext.font.size',
      'select.font.size'
    ],
    converter: (value) => sizeToCSS(value)
  },
  
  // Tabs component settings
  'tabs.borderRadius': {
    type: 'token',
    tokens: ['tabview.nav.border.radius'],
    converter: (value) => sizeToCSS(value)
  },
  
  'tabs.padding': {
    type: 'token',
    tokens: ['tabview.nav.item.padding'],
    converter: (value) => sizeToCSS(value)
  },
  
  // Card component settings
  'card.borderRadius': {
    type: 'token',
    tokens: ['card.border.radius'],
    converter: (value) => sizeToCSS(value)
  },
  
  'card.padding': {
    type: 'token',
    tokens: ['card.body.padding'],
    converter: (value) => sizeToCSS(value)
  },
  
  'card.shadow': {
    type: 'token',
    tokens: ['card.shadow'],
    converter: (value) => String(value)
  },
  
  // Message component settings
  'message.borderRadius': {
    type: 'token',
    tokens: ['message.border.radius'],
    converter: (value) => sizeToCSS(value)
  },
  
  'message.padding': {
    type: 'token',
    tokens: ['message.padding'],
    converter: (value) => sizeToCSS(value)
  }
}

/**
 * Apply theme changes to PrimeVue
 * @param {Object} changes - Object with setting paths and values
 * @returns {Promise} Promise that resolves when all changes are applied
 */
export const applyThemeChanges = async (changes) => {
  const presetUpdates = {}
  const paletteUpdates = []
  const errors = []
  
  // Process each change
  for (const [path, value] of Object.entries(changes)) {
    try {
      const mapping = TokenMappings[path]
      
      if (!mapping) {
        console.warn(`No mapping found for setting: ${path}`)
        continue
      }
      
      if (mapping.type === 'palette' || mapping.type === 'semantic') {
        // Handle palette updates
        if (mapping.handler) {
          paletteUpdates.push(() => mapping.handler(value))
        }
      } else if (mapping.type === 'token') {
        // Handle regular token updates
        const tokenValue = mapping.converter ? mapping.converter(value) : value
        
        mapping.tokens.forEach(tokenPath => {
          setNestedProperty(presetUpdates, `components.${tokenPath}`, tokenValue)
        })
      }
    } catch (error) {
      console.error(`Error processing change for ${path}:`, error)
      errors.push({ path, error: error.message })
    }
  }
  
  // Apply preset updates
  if (Object.keys(presetUpdates).length > 0) {
    try {
      await updatePreset(presetUpdates)
    } catch (error) {
      console.error('Error applying preset updates:', error)
      errors.push({ type: 'preset', error: error.message })
    }
  }
  
  // Apply palette updates
  for (const update of paletteUpdates) {
    try {
      await update()
    } catch (error) {
      console.error('Error applying palette update:', error)
      errors.push({ type: 'palette', error: error.message })
    }
  }
  
  if (errors.length > 0) {
    throw new Error(`Failed to apply some changes: ${errors.map(e => e.error).join(', ')}`)
  }
}

/**
 * Get the PrimeVue tokens affected by a setting
 * @param {string} settingPath - Setting path
 * @returns {Array} Array of token paths
 */
export const getAffectedTokens = (settingPath) => {
  const mapping = TokenMappings[settingPath]
  if (!mapping) return []
  
  if (mapping.tokens) {
    return mapping.tokens
  }
  
  if (mapping.type === 'palette') {
    return [settingPath] // Return the setting path itself for palette mappings
  }
  
  return []
}

/**
 * Check if a setting affects PrimeVue tokens
 * @param {string} settingPath - Setting path
 * @returns {boolean} Whether the setting has token mappings
 */
export const hasTokenMapping = (settingPath) => {
  return settingPath in TokenMappings
}

/**
 * Get all settings that affect a specific token
 * @param {string} tokenPath - Token path
 * @returns {Array} Array of setting paths
 */
export const getSettingsForToken = (tokenPath) => {
  const settings = []
  
  for (const [settingPath, mapping] of Object.entries(TokenMappings)) {
    if (mapping.tokens && mapping.tokens.includes(tokenPath)) {
      settings.push(settingPath)
    }
  }
  
  return settings
}

/**
 * Convert a setting value to its token representation
 * @param {string} settingPath - Setting path
 * @param {any} value - Setting value
 * @returns {any} Converted token value
 */
export const convertSettingToToken = (settingPath, value) => {
  const mapping = TokenMappings[settingPath]
  if (!mapping || !mapping.converter) {
    return value
  }
  
  try {
    return mapping.converter(value)
  } catch (error) {
    console.warn(`Error converting value for ${settingPath}:`, error)
    return value
  }
}

/**
 * Helper function to set nested object property
 * @param {Object} obj - Target object
 * @param {string} path - Property path (dot notation)
 * @param {any} value - Value to set
 */
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

/**
 * Batch apply multiple theme changes efficiently
 * @param {Object} changes - Object with setting paths and values
 * @param {Object} options - Application options
 * @returns {Promise} Promise that resolves when all changes are applied
 */
export const batchApplyChanges = async (changes, options = {}) => {
  const {
    debounceMs = 300,
    maxBatchSize = 50
  } = options
  
  // Split changes into batches if needed
  const changeEntries = Object.entries(changes)
  const batches = []
  
  for (let i = 0; i < changeEntries.length; i += maxBatchSize) {
    batches.push(Object.fromEntries(changeEntries.slice(i, i + maxBatchSize)))
  }
  
  // Apply batches with debouncing
  for (let i = 0; i < batches.length; i++) {
    await applyThemeChanges(batches[i])
    
    // Add delay between batches to prevent overwhelming the system
    if (i < batches.length - 1 && debounceMs > 0) {
      await new Promise(resolve => setTimeout(resolve, debounceMs))
    }
  }
}

/**
 * Validate that all required PrimeVue APIs are available
 * @returns {Object} Validation result with available APIs
 */
export const validatePrimeVueIntegration = () => {
  const apis = {
    updatePreset: typeof updatePreset === 'function',
    updatePrimaryPalette: typeof updatePrimaryPalette === 'function',
    updateSurfacePalette: typeof updateSurfacePalette === 'function'
  }
  
  const allAvailable = Object.values(apis).every(Boolean)
  
  return {
    available: apis,
    allAvailable,
    missing: Object.keys(apis).filter(key => !apis[key])
  }
}

/**
 * Get current theme values from PrimeVue (if available)
 * This is a placeholder - actual implementation would depend on PrimeVue's API
 * @returns {Object} Current theme values
 */
export const getCurrentThemeValues = () => {
  // This would need to be implemented based on PrimeVue's actual API
  // for reading current theme values
  return {}
}

/**
 * Reset theme to default values
 * @returns {Promise} Promise that resolves when reset is complete
 */
export const resetThemeToDefault = async () => {
  const defaultChanges = {
    'colors.primary': '#3b82f6',
    'colors.surface': '#ffffff',
    'colors.success': '#10b981',
    'colors.warning': '#f59e0b',
    'colors.error': '#ef4444',
    'typography.fontSize': { value: 14, unit: 'px' },
    'typography.fontWeight': 400,
    'typography.lineHeight': 1.5,
    'button.borderRadius': { value: 6, unit: 'px' },
    'button.padding': { value: 12, unit: 'px' },
    'input.borderRadius': { value: 4, unit: 'px' },
    'input.padding': { value: 8, unit: 'px' }
  }
  
  await applyThemeChanges(defaultChanges)
}

/**
 * Export current theme configuration
 * @param {Object} currentTheme - Current theme settings
 * @returns {Object} Exportable theme configuration
 */
export const exportThemeConfiguration = (currentTheme) => {
  return {
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    settings: currentTheme,
    mappings: Object.keys(TokenMappings).reduce((acc, key) => {
      acc[key] = {
        tokens: getAffectedTokens(key),
        type: TokenMappings[key].type
      }
      return acc
    }, {})
  }
}

/**
 * Import and validate theme configuration
 * @param {Object} themeConfig - Imported theme configuration
 * @returns {Object} Validation result and processed settings
 */
export const importThemeConfiguration = (themeConfig) => {
  const errors = []
  const warnings = []
  const processedSettings = {}
  
  if (!themeConfig || typeof themeConfig !== 'object') {
    errors.push('Invalid theme configuration format')
    return { errors, warnings, settings: {} }
  }
  
  const { settings = {} } = themeConfig
  
  // Validate each setting
  for (const [key, value] of Object.entries(settings)) {
    if (!hasTokenMapping(key)) {
      warnings.push(`Unknown setting: ${key}`)
      continue
    }
    
    // Basic validation - could be enhanced with proper schema validation
    if (value === null || value === undefined) {
      warnings.push(`Empty value for setting: ${key}`)
      continue
    }
    
    processedSettings[key] = value
  }
  
  return {
    errors,
    warnings,
    settings: processedSettings,
    valid: errors.length === 0
  }
}