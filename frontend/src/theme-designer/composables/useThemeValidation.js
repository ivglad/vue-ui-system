/**
 * Theme validation composable
 * Handles validation of theme settings and values
 */

import { validateSetting, validateSettings, areAllValid } from '../utils/validators.js'
import { AllSettings } from '../data/componentDefinitions.js'

export const useThemeValidation = () => {
  // Validation state
  const validationResults = ref({})
  const isValidating = ref(false)
  const validationErrors = ref([])
  
  // Validate a single value against validation rules
  const validateValue = (value, validation) => {
    if (!validation) return { valid: true, errors: [] }
    
    const errors = []
    
    // Required validation
    if (validation.required && (value === null || value === undefined || value === '')) {
      errors.push('This field is required')
      return { valid: false, errors }
    }
    
    // Skip further validation if value is empty and not required
    if (!validation.required && (value === null || value === undefined || value === '')) {
      return { valid: true, errors: [] }
    }
    
    // Type-specific validation
    if (typeof value === 'number') {
      // Min/max validation for numbers
      if (validation.min !== undefined && value < validation.min) {
        errors.push(`Value must be at least ${validation.min}`)
      }
      if (validation.max !== undefined && value > validation.max) {
        errors.push(`Value must be at most ${validation.max}`)
      }
      
      // Step validation
      if (validation.step !== undefined && validation.min !== undefined) {
        const steps = (value - validation.min) / validation.step
        if (Math.abs(steps - Math.round(steps)) > 0.001) {
          errors.push(`Value must be in steps of ${validation.step}`)
        }
      }
    }
    
    // Size value validation (objects with value and unit)
    if (value && typeof value === 'object' && 'value' in value && 'unit' in value) {
      const numValue = value.value
      if (typeof numValue === 'number') {
        if (validation.min !== undefined && numValue < validation.min) {
          errors.push(`Value must be at least ${validation.min}`)
        }
        if (validation.max !== undefined && numValue > validation.max) {
          errors.push(`Value must be at most ${validation.max}`)
        }
      }
      
      // Unit validation
      if (validation.units && !validation.units.includes(value.unit)) {
        errors.push(`Unit must be one of: ${validation.units.join(', ')}`)
      }
    }
    
    // String validation
    if (typeof value === 'string') {
      // Pattern validation
      if (validation.pattern && !validation.pattern.test(value)) {
        errors.push('Invalid format')
      }
      
      // Length validation
      if (validation.minLength !== undefined && value.length < validation.minLength) {
        errors.push(`Must be at least ${validation.minLength} characters`)
      }
      if (validation.maxLength !== undefined && value.length > validation.maxLength) {
        errors.push(`Must be at most ${validation.maxLength} characters`)
      }
    }
    
    // Array validation (for select options)
    if (Array.isArray(value)) {
      if (validation.minItems !== undefined && value.length < validation.minItems) {
        errors.push(`Must select at least ${validation.minItems} items`)
      }
      if (validation.maxItems !== undefined && value.length > validation.maxItems) {
        errors.push(`Must select at most ${validation.maxItems} items`)
      }
    }
    
    // Options validation (for select fields)
    if (validation.options && !validation.options.includes(value)) {
      errors.push(`Must be one of: ${validation.options.join(', ')}`)
    }
    
    // Custom validation function
    if (validation.custom && typeof validation.custom === 'function') {
      try {
        const customResult = validation.custom(value)
        if (customResult !== true) {
          errors.push(typeof customResult === 'string' ? customResult : 'Invalid value')
        }
      } catch (error) {
        errors.push('Validation error occurred')
        console.error('Custom validation error:', error)
      }
    }
    
    return {
      valid: errors.length === 0,
      errors
    }
  }
  
  // Validate a setting using its definition
  const validateSettingValue = (settingId, value) => {
    const settingDefinition = AllSettings[settingId]
    if (!settingDefinition) {
      return { valid: true, errors: [] }
    }
    
    return validateSetting(value, settingDefinition)
  }
  
  // Validate multiple settings at once
  const validateMultipleSettings = (settingsMap) => {
    isValidating.value = true
    validationErrors.value = []
    
    try {
      const results = {}
      const errors = []
      
      for (const [settingId, value] of Object.entries(settingsMap)) {
        const result = validateSettingValue(settingId, value)
        results[settingId] = result
        
        if (!result.valid) {
          errors.push({
            settingId,
            errors: result.errors
          })
        }
      }
      
      validationResults.value = results
      validationErrors.value = errors
      
      return {
        results,
        valid: errors.length === 0,
        errors
      }
    } finally {
      isValidating.value = false
    }
  }
  
  // Validate entire theme configuration
  const validateThemeConfig = (config) => {
    if (!config || typeof config !== 'object') {
      return {
        valid: false,
        errors: ['Invalid theme configuration format'],
        warnings: []
      }
    }
    
    const errors = []
    const warnings = []
    const validSettings = {}
    
    // Validate metadata if present
    if (config.metadata) {
      if (!config.metadata.name || typeof config.metadata.name !== 'string') {
        warnings.push('Theme name is missing or invalid')
      }
      if (!config.metadata.version || typeof config.metadata.version !== 'string') {
        warnings.push('Theme version is missing or invalid')
      }
    }
    
    // Validate settings
    if (config.settings && typeof config.settings === 'object') {
      for (const [settingId, value] of Object.entries(config.settings)) {
        const settingDefinition = AllSettings[settingId]
        
        if (!settingDefinition) {
          warnings.push(`Unknown setting: ${settingId}`)
          continue
        }
        
        const validation = validateSetting(value, settingDefinition)
        if (!validation.valid) {
          errors.push(`${settingDefinition.label}: ${validation.errors.join(', ')}`)
        } else {
          validSettings[settingId] = value
        }
      }
    } else {
      errors.push('No settings found in theme configuration')
    }
    
    return {
      valid: errors.length === 0,
      errors,
      warnings,
      validSettings,
      totalSettings: Object.keys(validSettings).length
    }
  }
  
  // Get validation result for a specific setting
  const getValidationResult = (settingId) => {
    return validationResults.value[settingId] || { valid: true, errors: [] }
  }
  
  // Check if a setting has validation errors
  const hasValidationErrors = (settingId) => {
    const result = getValidationResult(settingId)
    return !result.valid
  }
  
  // Get validation errors for a setting
  const getValidationErrors = (settingId) => {
    const result = getValidationResult(settingId)
    return result.errors || []
  }
  
  // Clear validation results
  const clearValidation = () => {
    validationResults.value = {}
    validationErrors.value = []
  }
  
  // Clear validation for a specific setting
  const clearSettingValidation = (settingId) => {
    if (validationResults.value[settingId]) {
      delete validationResults.value[settingId]
    }
    
    validationErrors.value = validationErrors.value.filter(
      error => error.settingId !== settingId
    )
  }
  
  // Computed properties
  const hasAnyErrors = computed(() => {
    return validationErrors.value.length > 0
  })
  
  const errorCount = computed(() => {
    return validationErrors.value.length
  })
  
  const allSettingsValid = computed(() => {
    return Object.values(validationResults.value).every(result => result.valid)
  })
  
  // Auto-validate when settings change
  const autoValidate = (settingsMap, debounceMs = 300) => {
    const debouncedValidate = useDebounceFn(() => {
      validateMultipleSettings(settingsMap)
    }, debounceMs)
    
    watch(
      () => settingsMap,
      () => {
        debouncedValidate()
      },
      { deep: true }
    )
  }
  
  return {
    // State
    validationResults: readonly(validationResults),
    isValidating: readonly(isValidating),
    validationErrors: readonly(validationErrors),
    
    // Computed
    hasAnyErrors,
    errorCount,
    allSettingsValid,
    
    // Methods
    validateValue,
    validateSettingValue,
    validateMultipleSettings,
    validateThemeConfig,
    getValidationResult,
    hasValidationErrors,
    getValidationErrors,
    clearValidation,
    clearSettingValidation,
    autoValidate
  }
}