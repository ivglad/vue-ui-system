/**
 * Theme presets index
 * Exports all available theme presets
 */

import { defaultTheme } from './default.js'
import { darkTheme } from './dark.js'
import { corporateTheme } from './corporate.js'
import { minimalTheme } from './minimal.js'

// All available presets
export const THEME_PRESETS = {
  default: defaultTheme,
  dark: darkTheme,
  corporate: corporateTheme,
  minimal: minimalTheme
}

// Preset categories
export const PRESET_CATEGORIES = {
  builtin: {
    id: 'builtin',
    name: 'Built-in Themes',
    description: 'Predefined themes included with the theme designer',
    presets: ['default', 'dark', 'corporate', 'minimal']
  }
}

// Utility functions
export const getPresetById = (id) => {
  return THEME_PRESETS[id] || null
}

export const getAllPresets = () => {
  return Object.values(THEME_PRESETS)
}

export const getPresetsByCategory = (categoryId) => {
  const category = PRESET_CATEGORIES[categoryId]
  if (!category) return []
  
  return category.presets.map(presetId => THEME_PRESETS[presetId]).filter(Boolean)
}

export const searchPresets = (query) => {
  const lowercaseQuery = query.toLowerCase()
  return getAllPresets().filter(preset => 
    preset.name.toLowerCase().includes(lowercaseQuery) ||
    preset.description.toLowerCase().includes(lowercaseQuery)
  )
}

export const validatePreset = (preset) => {
  const requiredFields = ['id', 'name', 'description', 'settings']
  const missingFields = requiredFields.filter(field => !preset[field])
  
  if (missingFields.length > 0) {
    return {
      valid: false,
      errors: [`Missing required fields: ${missingFields.join(', ')}`]
    }
  }
  
  if (typeof preset.settings !== 'object') {
    return {
      valid: false,
      errors: ['Settings must be an object']
    }
  }
  
  return {
    valid: true,
    errors: []
  }
}

// Export individual presets
export {
  defaultTheme,
  darkTheme,
  corporateTheme,
  minimalTheme
}

// Default export
export default THEME_PRESETS