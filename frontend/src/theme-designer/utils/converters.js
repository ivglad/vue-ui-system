/**
 * Unit conversion utilities
 * Functions for converting between different CSS units
 */

// Base font size for rem calculations (typically 16px)
const BASE_FONT_SIZE = 16

/**
 * Convert a size value from one unit to another
 * @param {Object} sizeValue - Object with value and unit properties
 * @param {string} targetUnit - Target unit to convert to
 * @param {number} baseFontSize - Base font size for rem/em calculations
 * @returns {Object} - Converted size value
 */
export const convertSize = (sizeValue, targetUnit, baseFontSize = BASE_FONT_SIZE) => {
  if (!sizeValue || typeof sizeValue !== 'object') {
    return { value: 0, unit: targetUnit }
  }
  
  const { value, unit } = sizeValue
  
  if (unit === targetUnit) {
    return { value, unit }
  }
  
  // Convert to pixels first (common base)
  let pixelValue = value
  
  switch (unit) {
    case 'rem':
      pixelValue = value * baseFontSize
      break
    case 'em':
      pixelValue = value * baseFontSize // Simplified - assumes same as rem
      break
    case '%':
      // Percentage conversion depends on context, assume 100% = baseFontSize for now
      pixelValue = (value / 100) * baseFontSize
      break
    case 'vw':
      // Viewport width - simplified conversion
      pixelValue = (value / 100) * (window?.innerWidth || 1920)
      break
    case 'vh':
      // Viewport height - simplified conversion
      pixelValue = (value / 100) * (window?.innerHeight || 1080)
      break
    case 'px':
    default:
      pixelValue = value
      break
  }
  
  // Convert from pixels to target unit
  let convertedValue = pixelValue
  
  switch (targetUnit) {
    case 'rem':
      convertedValue = pixelValue / baseFontSize
      break
    case 'em':
      convertedValue = pixelValue / baseFontSize
      break
    case '%':
      convertedValue = (pixelValue / baseFontSize) * 100
      break
    case 'vw':
      convertedValue = (pixelValue / (window?.innerWidth || 1920)) * 100
      break
    case 'vh':
      convertedValue = (pixelValue / (window?.innerHeight || 1080)) * 100
      break
    case 'px':
    default:
      convertedValue = pixelValue
      break
  }
  
  // Round to reasonable precision
  convertedValue = Math.round(convertedValue * 100) / 100
  
  return {
    value: convertedValue,
    unit: targetUnit
  }
}

/**
 * Convert size value to CSS string
 * @param {Object} sizeValue - Object with value and unit properties
 * @returns {string} - CSS value string
 */
export const sizeToCSS = (sizeValue) => {
  if (!sizeValue || typeof sizeValue !== 'object') {
    return '0'
  }
  
  const { value, unit } = sizeValue
  
  if (unit === '' || unit === 'none') {
    return String(value)
  }
  
  return `${value}${unit}`
}

/**
 * Parse CSS size string to size value object
 * @param {string} cssValue - CSS size string (e.g., "16px", "1rem")
 * @returns {Object} - Size value object
 */
export const parseCSS = (cssValue) => {
  if (!cssValue || typeof cssValue !== 'string') {
    return { value: 0, unit: 'px' }
  }
  
  const trimmed = cssValue.trim()
  
  // Handle unitless values
  if (/^\d+(\.\d+)?$/.test(trimmed)) {
    return { value: parseFloat(trimmed), unit: '' }
  }
  
  // Extract value and unit
  const match = trimmed.match(/^(-?\d+(?:\.\d+)?)(.*?)$/)
  
  if (!match) {
    return { value: 0, unit: 'px' }
  }
  
  const value = parseFloat(match[1])
  const unit = match[2] || 'px'
  
  return { value, unit }
}

/**
 * Get appropriate default unit for a setting type
 * @param {string} settingType - Type of setting
 * @returns {string} - Default unit
 */
export const getDefaultUnit = (settingType) => {
  const defaultUnits = {
    size: 'px',
    spacing: 'rem',
    borderRadius: 'px',
    fontSize: 'rem',
    shadow: 'px',
    transition: 'ms'
  }
  
  return defaultUnits[settingType] || 'px'
}

/**
 * Get valid units for a setting type
 * @param {string} settingType - Type of setting
 * @returns {Array} - Array of valid units
 */
export const getValidUnits = (settingType) => {
  const validUnits = {
    size: ['px', 'rem', 'em', '%'],
    spacing: ['px', 'rem', 'em'],
    borderRadius: ['px', 'rem', '%'],
    fontSize: ['px', 'rem', 'em'],
    shadow: ['px'],
    transition: ['ms', 's'],
    fontWeight: [''],
    lineHeight: ['']
  }
  
  return validUnits[settingType] || ['px']
}

/**
 * Normalize size value to ensure it has valid unit
 * @param {Object|string|number} input - Input value
 * @param {string} settingType - Type of setting for default unit
 * @returns {Object} - Normalized size value object
 */
export const normalizeSize = (input, settingType = 'size') => {
  // Handle object input
  if (input && typeof input === 'object' && 'value' in input) {
    const unit = input.unit || getDefaultUnit(settingType)
    return {
      value: typeof input.value === 'number' ? input.value : 0,
      unit
    }
  }
  
  // Handle string input
  if (typeof input === 'string') {
    return parseCSS(input)
  }
  
  // Handle number input
  if (typeof input === 'number') {
    return {
      value: input,
      unit: getDefaultUnit(settingType)
    }
  }
  
  // Default fallback
  return {
    value: 0,
    unit: getDefaultUnit(settingType)
  }
}