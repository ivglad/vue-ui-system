/**
 * Color palette utilities
 * Functions for generating and manipulating color palettes
 */

import { validateColor } from './validators.js'

/**
 * Convert hex color to RGB
 * @param {string} hex - Hex color string
 * @returns {Object} RGB object with r, g, b properties
 */
export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

/**
 * Convert RGB to hex
 * @param {number} r - Red value (0-255)
 * @param {number} g - Green value (0-255)
 * @param {number} b - Blue value (0-255)
 * @returns {string} Hex color string
 */
export const rgbToHex = (r, g, b) => {
  const toHex = (n) => {
    const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

/**
 * Convert hex color to HSL
 * @param {string} hex - Hex color string
 * @returns {Object} HSL object with h, s, l properties
 */
export const hexToHsl = (hex) => {
  const rgb = hexToRgb(hex)
  if (!rgb) return null
  
  const r = rgb.r / 255
  const g = rgb.g / 255
  const b = rgb.b / 255
  
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h, s, l = (max + min) / 2
  
  if (max === min) {
    h = s = 0 // achromatic
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h /= 6
  }
  
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  }
}

/**
 * Convert HSL to hex
 * @param {number} h - Hue (0-360)
 * @param {number} s - Saturation (0-100)
 * @param {number} l - Lightness (0-100)
 * @returns {string} Hex color string
 */
export const hslToHex = (h, s, l) => {
  h = h / 360
  s = s / 100
  l = l / 100
  
  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1/6) return p + (q - p) * 6 * t
    if (t < 1/2) return q
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
    return p
  }
  
  let r, g, b
  
  if (s === 0) {
    r = g = b = l // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1/3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1/3)
  }
  
  return rgbToHex(r * 255, g * 255, b * 255)
}

/**
 * Lighten a color by a percentage
 * @param {string} hex - Hex color string
 * @param {number} percent - Percentage to lighten (0-100)
 * @returns {string} Lightened hex color
 */
export const lighten = (hex, percent) => {
  const hsl = hexToHsl(hex)
  if (!hsl) return hex
  
  const newL = Math.min(100, hsl.l + percent)
  return hslToHex(hsl.h, hsl.s, newL)
}

/**
 * Darken a color by a percentage
 * @param {string} hex - Hex color string
 * @param {number} percent - Percentage to darken (0-100)
 * @returns {string} Darkened hex color
 */
export const darken = (hex, percent) => {
  const hsl = hexToHsl(hex)
  if (!hsl) return hex
  
  const newL = Math.max(0, hsl.l - percent)
  return hslToHex(hsl.h, hsl.s, newL)
}

/**
 * Adjust saturation of a color
 * @param {string} hex - Hex color string
 * @param {number} percent - Percentage to adjust saturation (-100 to 100)
 * @returns {string} Adjusted hex color
 */
export const saturate = (hex, percent) => {
  const hsl = hexToHsl(hex)
  if (!hsl) return hex
  
  const newS = Math.max(0, Math.min(100, hsl.s + percent))
  return hslToHex(hsl.h, newS, hsl.l)
}

/**
 * Generate a complete color palette from a base color
 * @param {string} baseColor - Base hex color
 * @param {Object} options - Generation options
 * @returns {Object} Complete color palette with shades 50-950
 */
export const generatePalette = (baseColor, options = {}) => {
  if (!validateColor(baseColor)) {
    throw new Error('Invalid base color')
  }
  
  const {
    method = 'hsl', // 'hsl' or 'mix'
    curve = 'linear' // 'linear' or 'exponential'
  } = options
  
  const palette = {}
  const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
  
  // Base color is always 500
  palette[500] = baseColor.toUpperCase()
  
  if (method === 'hsl') {
    return generatePaletteHSL(baseColor, curve)
  } else {
    return generatePaletteMix(baseColor, curve)
  }
}

/**
 * Generate palette using HSL manipulation
 * @param {string} baseColor - Base hex color
 * @param {string} curve - Lightness curve type
 * @returns {Object} Color palette
 */
const generatePaletteHSL = (baseColor, curve = 'linear') => {
  const hsl = hexToHsl(baseColor)
  if (!hsl) return {}
  
  const palette = {}
  const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
  
  // Define lightness values for each shade
  const lightnessMap = {
    50: 97,
    100: 94,
    200: 86,
    300: 77,
    400: 65,
    500: hsl.l, // Keep original lightness
    600: Math.max(10, hsl.l - 15),
    700: Math.max(8, hsl.l - 25),
    800: Math.max(6, hsl.l - 35),
    900: Math.max(4, hsl.l - 45),
    950: Math.max(2, hsl.l - 55)
  }
  
  // Adjust saturation for lighter shades
  shades.forEach(shade => {
    let targetL = lightnessMap[shade]
    let targetS = hsl.s
    
    // Reduce saturation for very light shades
    if (shade <= 200) {
      targetS = Math.max(10, hsl.s - (200 - shade) * 0.3)
    }
    // Increase saturation slightly for darker shades
    else if (shade >= 700) {
      targetS = Math.min(100, hsl.s + (shade - 700) * 0.1)
    }
    
    palette[shade] = hslToHex(hsl.h, targetS, targetL)
  })
  
  return palette
}

/**
 * Generate palette using color mixing
 * @param {string} baseColor - Base hex color
 * @param {string} curve - Mixing curve type
 * @returns {Object} Color palette
 */
const generatePaletteMix = (baseColor, curve = 'linear') => {
  const palette = {}
  const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
  
  palette[500] = baseColor.toUpperCase()
  
  const rgb = hexToRgb(baseColor)
  if (!rgb) return palette
  
  shades.forEach(shade => {
    if (shade === 500) return
    
    let factor
    if (shade < 500) {
      // Lighter shades - mix with white
      factor = (500 - shade) / 500
      const white = { r: 255, g: 255, b: 255 }
      const mixed = mixColors(rgb, white, factor)
      palette[shade] = rgbToHex(mixed.r, mixed.g, mixed.b)
    } else {
      // Darker shades - mix with black
      factor = (shade - 500) / 450
      const black = { r: 0, g: 0, b: 0 }
      const mixed = mixColors(rgb, black, factor)
      palette[shade] = rgbToHex(mixed.r, mixed.g, mixed.b)
    }
  })
  
  return palette
}

/**
 * Mix two RGB colors
 * @param {Object} color1 - First RGB color
 * @param {Object} color2 - Second RGB color
 * @param {number} factor - Mix factor (0-1)
 * @returns {Object} Mixed RGB color
 */
const mixColors = (color1, color2, factor) => {
  return {
    r: Math.round(color1.r + (color2.r - color1.r) * factor),
    g: Math.round(color1.g + (color2.g - color1.g) * factor),
    b: Math.round(color1.b + (color2.b - color1.b) * factor)
  }
}

/**
 * Get contrast ratio between two colors
 * @param {string} color1 - First hex color
 * @param {string} color2 - Second hex color
 * @returns {number} Contrast ratio (1-21)
 */
export const getContrastRatio = (color1, color2) => {
  const getLuminance = (hex) => {
    const rgb = hexToRgb(hex)
    if (!rgb) return 0
    
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
      c = c / 255
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })
    
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }
  
  const lum1 = getLuminance(color1)
  const lum2 = getLuminance(color2)
  
  const brightest = Math.max(lum1, lum2)
  const darkest = Math.min(lum1, lum2)
  
  return (brightest + 0.05) / (darkest + 0.05)
}

/**
 * Check if a color meets WCAG contrast requirements
 * @param {string} foreground - Foreground hex color
 * @param {string} background - Background hex color
 * @param {string} level - WCAG level ('AA' or 'AAA')
 * @param {string} size - Text size ('normal' or 'large')
 * @returns {boolean} Whether contrast requirement is met
 */
export const meetsContrastRequirement = (foreground, background, level = 'AA', size = 'normal') => {
  const ratio = getContrastRatio(foreground, background)
  
  const requirements = {
    'AA': { normal: 4.5, large: 3 },
    'AAA': { normal: 7, large: 4.5 }
  }
  
  return ratio >= requirements[level][size]
}

/**
 * Find the best text color (black or white) for a background
 * @param {string} backgroundColor - Background hex color
 * @returns {string} Best text color ('#000000' or '#ffffff')
 */
export const getBestTextColor = (backgroundColor) => {
  const whiteContrast = getContrastRatio('#ffffff', backgroundColor)
  const blackContrast = getContrastRatio('#000000', backgroundColor)
  
  return whiteContrast > blackContrast ? '#ffffff' : '#000000'
}

/**
 * Predefined color palettes for common use cases
 */
export const PREDEFINED_PALETTES = {
  // Brand colors
  blue: generatePalette('#3b82f6'),
  indigo: generatePalette('#6366f1'),
  purple: generatePalette('#8b5cf6'),
  pink: generatePalette('#ec4899'),
  
  // Semantic colors
  green: generatePalette('#10b981'),
  yellow: generatePalette('#f59e0b'),
  orange: generatePalette('#f97316'),
  red: generatePalette('#ef4444'),
  
  // Neutral colors
  gray: generatePalette('#6b7280'),
  slate: generatePalette('#64748b'),
  zinc: generatePalette('#71717a'),
  stone: generatePalette('#78716c')
}

/**
 * Get a palette by name
 * @param {string} name - Palette name
 * @returns {Object|null} Color palette or null if not found
 */
export const getPaletteByName = (name) => {
  return PREDEFINED_PALETTES[name] || null
}

/**
 * Get all available palette names
 * @returns {Array} Array of palette names
 */
export const getAvailablePalettes = () => {
  return Object.keys(PREDEFINED_PALETTES)
}