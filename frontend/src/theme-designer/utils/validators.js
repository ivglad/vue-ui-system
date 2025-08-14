/**
 * Validation utilities
 * Functions for validating different types of theme settings
 */

/**
 * Validate a color value
 * @param {string} color - Color value to validate
 * @returns {boolean} - Whether the color is valid
 */
export const validateColor = (color) => {
  if (!color || typeof color !== 'string') return false
  
  // Hex color validation
  const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
  if (hexPattern.test(color)) return true
  
  // RGB/RGBA validation
  const rgbPattern = /^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*[\d.]+)?\s*\)$/
  if (rgbPattern.test(color)) return true
  
  // HSL/HSLA validation
  const hslPattern = /^hsla?\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*(,\s*[\d.]+)?\s*\)$/
  if (hslPattern.test(color)) return true
  
  // Named colors (basic validation)
  const namedColors = ['red', 'blue', 'green', 'yellow', 'black', 'white', 'transparent']
  if (namedColors.includes(color.toLowerCase())) return true
  
  return false
}

/**
 * Validate a size value with unit
 * @param {Object} sizeValue - Object with value and unit properties
 * @returns {boolean} - Whether the size is valid
 */
export const validateSize = (sizeValue) => {
  if (!sizeValue || typeof sizeValue !== 'object') return false
  
  const { value, unit } = sizeValue
  
  // Value must be a number
  if (typeof value !== 'number' || isNaN(value)) return false
  
  // Value should be non-negative for most cases
  if (value < 0) return false
  
  // Unit must be valid
  const validUnits = ['px', 'rem', 'em', '%', 'vw', 'vh', '']
  if (!validUnits.includes(unit)) return false
  
  return true
}

/**
 * Validate a numeric range value
 * @param {number} value - Numeric value to validate
 * @param {Object} constraints - Min/max constraints
 * @returns {boolean} - Whether the value is valid
 */
export const validateRange = (value, constraints = {}) => {
  if (typeof value !== 'number' || isNaN(value)) return false
  
  const { min, max } = constraints
  
  if (min !== undefined && value < min) return false
  if (max !== undefined && value > max) return false
  
  return true
}

/**
 * Validate a font weight value
 * @param {number|string} weight - Font weight to validate
 * @returns {boolean} - Whether the font weight is valid
 */
export const validateFontWeight = (weight) => {
  // Numeric weights
  if (typeof weight === 'number') {
    return weight >= 100 && weight <= 900 && weight % 100 === 0
  }
  
  // Named weights
  if (typeof weight === 'string') {
    const namedWeights = ['normal', 'bold', 'lighter', 'bolder']
    return namedWeights.includes(weight.toLowerCase())
  }
  
  return false
}

/**
 * Validate a shadow value
 * @param {string} shadow - CSS shadow value
 * @returns {boolean} - Whether the shadow is valid
 */
export const validateShadow = (shadow) => {
  if (!shadow || typeof shadow !== 'string') return false
  
  // Basic shadow pattern validation
  // This is a simplified validation - CSS shadows can be quite complex
  const shadowPattern = /^(\d+px\s+){2,4}(rgba?\([^)]+\)|#[A-Fa-f0-9]{3,6}|\w+)$/
  return shadowPattern.test(shadow.trim()) || shadow === 'none'
}

/**
 * Validate a setting value based on its definition
 * @param {any} value - Value to validate
 * @param {Object} settingDefinition - Setting definition with validation rules
 * @returns {Object} - Validation result with valid flag and errors
 */
export const validateSetting = (value, settingDefinition) => {
  if (!settingDefinition) {
    return { valid: true, errors: [] }
  }
  
  const { type, validation = {} } = settingDefinition
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
  switch (type) {
    case 'color':
      if (!validateColor(value)) {
        errors.push('Invalid color format')
      }
      break
      
    case 'size':
    case 'spacing':
    case 'borderRadius':
    case 'fontSize':
      if (!validateSize(value)) {
        errors.push('Invalid size format')
      } else if (validation.min !== undefined && value.value < validation.min) {
        errors.push(`Value must be at least ${validation.min}`)
      } else if (validation.max !== undefined && value.value > validation.max) {
        errors.push(`Value must be at most ${validation.max}`)
      }
      break
      
    case 'fontWeight':
      if (!validateFontWeight(value)) {
        errors.push('Invalid font weight')
      }
      break
      
    case 'shadow':
      if (!validateShadow(value)) {
        errors.push('Invalid shadow format')
      }
      break
      
    case 'range':
      if (!validateRange(value, { min: validation.min, max: validation.max })) {
        errors.push('Value is out of range')
      }
      break
      
    case 'select':
      if (validation.options && !validation.options.includes(value)) {
        errors.push('Invalid option selected')
      }
      break
      
    case 'boolean':
      if (typeof value !== 'boolean') {
        errors.push('Value must be true or false')
      }
      break
  }
  
  // Custom validation function
  if (validation.custom && typeof validation.custom === 'function') {
    const customResult = validation.custom(value)
    if (customResult !== true) {
      errors.push(typeof customResult === 'string' ? customResult : 'Invalid value')
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Validate multiple settings at once
 * @param {Object} values - Object with setting values
 * @param {Object} settingDefinitions - Object with setting definitions
 * @returns {Object} - Validation results for each setting
 */
export const validateSettings = (values, settingDefinitions) => {
  const results = {}
  
  for (const [key, value] of Object.entries(values)) {
    const definition = settingDefinitions[key]
    results[key] = validateSetting(value, definition)
  }
  
  return results
}

/**
 * Check if all validation results are valid
 * @param {Object} validationResults - Results from validateSettings
 * @returns {boolean} - Whether all validations passed
 */
export const areAllValid = (validationResults) => {
  return Object.values(validationResults).every(result => result.valid)
}