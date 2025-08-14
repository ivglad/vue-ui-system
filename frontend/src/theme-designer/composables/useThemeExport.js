/**
 * Theme export/import composable
 * Handles theme serialization, export, and import functionality
 */

import { useThemeValidation } from './useThemeValidation.js'
import { AllSettings } from '../data/componentDefinitions.js'

export const useThemeExport = () => {
  const { validateThemeConfig } = useThemeValidation()
  
  // Export state
  const isExporting = ref(false)
  const isImporting = ref(false)
  const exportError = ref(null)
  const importError = ref(null)
  const lastExportedTheme = ref(null)
  const lastImportedTheme = ref(null)
  
  // Export formats
  const ExportFormats = {
    JSON: 'json',
    CSS: 'css',
    SCSS: 'scss'
  }
  
  // Export theme configuration
  const exportTheme = async (themeConfig, options = {}) => {
    const {
      format = ExportFormats.JSON,
      includeMetadata = true,
      includePreview = true,
      filename = null,
      download = true
    } = options
    
    isExporting.value = true
    exportError.value = null
    
    try {
      let exportData
      let mimeType
      let fileExtension
      
      // Prepare base export data
      const baseData = {
        ...(includeMetadata && {
          metadata: {
            name: themeConfig.name || 'Custom Theme',
            description: themeConfig.description || 'Exported theme configuration',
            version: '1.0.0',
            created: themeConfig.created || new Date().toISOString(),
            exported: new Date().toISOString(),
            generator: 'PrimeVue Theme Designer',
            format: format
          }
        }),
        settings: themeConfig.settings || themeConfig,
        ...(includePreview && {
          preview: generatePreviewData(themeConfig.settings || themeConfig)
        })
      }
      
      switch (format) {
        case ExportFormats.JSON:
          exportData = JSON.stringify(baseData, null, 2)
          mimeType = 'application/json'
          fileExtension = 'json'
          break
          
        case ExportFormats.CSS:
          exportData = generateCSSExport(baseData)
          mimeType = 'text/css'
          fileExtension = 'css'
          break
          
        case ExportFormats.SCSS:
          exportData = generateSCSSExport(baseData)
          mimeType = 'text/scss'
          fileExtension = 'scss'
          break
          
        default:
          throw new Error(`Unsupported export format: ${format}`)
      }
      
      lastExportedTheme.value = {
        data: baseData,
        format,
        timestamp: new Date().toISOString()
      }
      
      if (download) {
        const finalFilename = filename || `theme-${Date.now()}.${fileExtension}`
        await downloadFile(exportData, finalFilename, mimeType)
      }
      
      return {
        data: exportData,
        metadata: baseData.metadata,
        success: true
      }
      
    } catch (error) {
      exportError.value = error.message
      console.error('Export error:', error)
      throw error
    } finally {
      isExporting.value = false
    }
  }
  
  // Import theme configuration
  const importTheme = async (source, options = {}) => {
    const {
      validate = true,
      merge = false,
      preserveMetadata = false
    } = options
    
    isImporting.value = true
    importError.value = null
    
    try {
      let themeData
      
      // Handle different source types
      if (typeof source === 'string') {
        // JSON string
        try {
          themeData = JSON.parse(source)
        } catch (parseError) {
          throw new Error('Invalid JSON format')
        }
      } else if (source instanceof File) {
        // File object
        themeData = await parseThemeFile(source)
      } else if (typeof source === 'object') {
        // Already parsed object
        themeData = source
      } else {
        throw new Error('Invalid import source')
      }
      
      // Validate theme data
      if (validate) {
        const validation = validateThemeConfig(themeData)
        if (!validation.valid) {
          throw new Error(`Invalid theme configuration: ${validation.errors.join(', ')}`)
        }
        
        // Use validated settings
        themeData.settings = validation.validSettings
      }
      
      // Process imported data
      const processedTheme = {
        settings: themeData.settings || {},
        metadata: preserveMetadata ? themeData.metadata : null,
        imported: new Date().toISOString()
      }
      
      lastImportedTheme.value = {
        data: processedTheme,
        source: typeof source === 'string' ? 'json' : source instanceof File ? 'file' : 'object',
        timestamp: new Date().toISOString()
      }
      
      return {
        theme: processedTheme,
        validation: validate ? validateThemeConfig(themeData) : null,
        success: true
      }
      
    } catch (error) {
      importError.value = error.message
      console.error('Import error:', error)
      throw error
    } finally {
      isImporting.value = false
    }
  }
  
  // Import from file
  const importFromFile = (file) => {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error('No file provided'))
        return
      }
      
      if (!file.name.endsWith('.json')) {
        reject(new Error('Only JSON files are supported'))
        return
      }
      
      const reader = new FileReader()
      
      reader.onload = async (event) => {
        try {
          const result = await importTheme(event.target.result)
          resolve(result)
        } catch (error) {
          reject(error)
        }
      }
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'))
      }
      
      reader.readAsText(file)
    })
  }
  
  // Save theme to localStorage
  const saveToLocalStorage = (theme, key = 'theme-designer-config') => {
    try {
      const dataToSave = {
        settings: theme.settings || theme,
        metadata: theme.metadata || {
          name: 'Saved Theme',
          saved: new Date().toISOString()
        },
        timestamp: Date.now()
      }
      
      localStorage.setItem(key, JSON.stringify(dataToSave))
      return true
    } catch (error) {
      console.error('Error saving to localStorage:', error)
      return false
    }
  }
  
  // Load theme from localStorage
  const loadFromLocalStorage = (key = 'theme-designer-config') => {
    try {
      const stored = localStorage.getItem(key)
      if (!stored) return null
      
      const parsed = JSON.parse(stored)
      
      // Validate stored data structure
      if (!parsed.settings && !parsed.timestamp) {
        // Old format, migrate
        return {
          settings: parsed,
          metadata: {
            name: 'Loaded Theme',
            loaded: new Date().toISOString()
          }
        }
      }
      
      return parsed
    } catch (error) {
      console.error('Error loading from localStorage:', error)
      return null
    }
  }
  
  // Get all saved themes from localStorage
  const getSavedThemes = () => {
    const themes = []
    const keys = Object.keys(localStorage).filter(key => 
      key.startsWith('theme-designer-') || key === 'theme-designer-config'
    )
    
    keys.forEach(key => {
      try {
        const theme = loadFromLocalStorage(key)
        if (theme) {
          themes.push({
            key,
            ...theme,
            id: key.replace('theme-designer-', '') || 'default'
          })
        }
      } catch (error) {
        console.warn(`Failed to load theme from key ${key}:`, error)
      }
    })
    
    return themes.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
  }
  
  // Delete saved theme
  const deleteSavedTheme = (key) => {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error('Error deleting saved theme:', error)
      return false
    }
  }
  
  // Helper functions
  const parseThemeFile = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result)
          resolve(data)
        } catch (error) {
          reject(new Error('Invalid JSON file'))
        }
      }
      
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsText(file)
    })
  }
  
  const generatePreviewData = (settings) => {
    const preview = {}
    
    // Extract key colors for preview
    if (settings['colors.primary']) {
      preview.primary = settings['colors.primary']
    }
    if (settings['colors.surface']) {
      preview.surface = settings['colors.surface']
    }
    if (settings['colors.success']) {
      preview.success = settings['colors.success']
    }
    if (settings['colors.warning']) {
      preview.warning = settings['colors.warning']
    }
    if (settings['colors.error']) {
      preview.error = settings['colors.error']
    }
    
    return preview
  }
  
  const generateCSSExport = (themeData) => {
    let css = '/* PrimeVue Theme Designer - Generated CSS */\n\n'
    
    if (themeData.metadata) {
      css += `/* Theme: ${themeData.metadata.name} */\n`
      css += `/* Generated: ${themeData.metadata.exported} */\n\n`
    }
    
    css += ':root {\n'
    
    // Convert settings to CSS custom properties
    Object.entries(themeData.settings).forEach(([key, value]) => {
      const cssVar = `--${key.replace(/\./g, '-')}`
      let cssValue = value
      
      // Handle size values
      if (value && typeof value === 'object' && 'value' in value && 'unit' in value) {
        cssValue = `${value.value}${value.unit}`
      }
      
      css += `  ${cssVar}: ${cssValue};\n`
    })
    
    css += '}\n'
    
    return css
  }
  
  const generateSCSSExport = (themeData) => {
    let scss = '// PrimeVue Theme Designer - Generated SCSS\n\n'
    
    if (themeData.metadata) {
      scss += `// Theme: ${themeData.metadata.name}\n`
      scss += `// Generated: ${themeData.metadata.exported}\n\n`
    }
    
    // Convert settings to SCSS variables
    Object.entries(themeData.settings).forEach(([key, value]) => {
      const scssVar = `$${key.replace(/\./g, '-')}`
      let scssValue = value
      
      // Handle size values
      if (value && typeof value === 'object' && 'value' in value && 'unit' in value) {
        scssValue = `${value.value}${value.unit}`
      }
      
      scss += `${scssVar}: ${scssValue};\n`
    })
    
    return scss
  }
  
  const downloadFile = async (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // Clean up
    setTimeout(() => URL.revokeObjectURL(url), 100)
  }
  
  // Computed properties
  const canExport = computed(() => !isExporting.value)
  const canImport = computed(() => !isImporting.value)
  const hasExportError = computed(() => !!exportError.value)
  const hasImportError = computed(() => !!importError.value)
  
  return {
    // State
    isExporting: readonly(isExporting),
    isImporting: readonly(isImporting),
    exportError: readonly(exportError),
    importError: readonly(importError),
    lastExportedTheme: readonly(lastExportedTheme),
    lastImportedTheme: readonly(lastImportedTheme),
    
    // Computed
    canExport,
    canImport,
    hasExportError,
    hasImportError,
    
    // Constants
    ExportFormats,
    
    // Methods
    exportTheme,
    importTheme,
    importFromFile,
    saveToLocalStorage,
    loadFromLocalStorage,
    getSavedThemes,
    deleteSavedTheme
  }
}