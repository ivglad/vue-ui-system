/**
 * Theme preview composable
 * Manages preview functionality and component showcase with live updates
 */

import { ComponentDefinitions } from '../data/componentDefinitions.js'
import { convertSettingToToken } from '../utils/tokenMapping.js'

export const useThemePreview = (options = {}) => {
  const {
    enableLivePreview = true,
    previewComponents = ['button', 'inputtext', 'select', 'checkbox', 'tabs'],
    updateDelay = 150
  } = options
  
  // Preview state
  const activeComponent = ref('button')
  const previewMode = ref('showcase') // 'showcase' | 'component' | 'comparison'
  const isPreviewEnabled = ref(enableLivePreview)
  const previewStyles = ref({})
  const previewErrors = ref([])
  
  // Component showcase data
  const showcaseData = reactive({
    inputValue: 'Sample text',
    selectValue: 'option1',
    checkboxValue: true,
    radioValue: 'option1',
    sliderValue: 50,
    activeTabIndex: 0,
    tableData: [
      { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive' },
      { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'Active' }
    ],
    selectOptions: [
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' },
      { label: 'Option 3', value: 'option3' }
    ]
  })
  
  // Computed properties
  const availableComponents = computed(() => {
    return previewComponents.filter(componentId => 
      ComponentDefinitions[componentId]
    ).map(componentId => ({
      id: componentId,
      name: ComponentDefinitions[componentId].name,
      group: ComponentDefinitions[componentId].group,
      category: ComponentDefinitions[componentId].category
    }))
  })
  
  const componentsByCategory = computed(() => {
    const categories = {}
    
    availableComponents.value.forEach(component => {
      const category = component.category || 'other'
      if (!categories[category]) {
        categories[category] = []
      }
      categories[category].push(component)
    })
    
    return categories
  })
  
  const currentComponent = computed(() => {
    return ComponentDefinitions[activeComponent.value]
  })
  
  const previewCSS = computed(() => {
    if (!isPreviewEnabled.value || Object.keys(previewStyles.value).length === 0) {
      return ''
    }
    
    return generatePreviewCSS(previewStyles.value)
  })
  
  // Methods
  const setActiveComponent = (componentId) => {
    if (ComponentDefinitions[componentId]) {
      activeComponent.value = componentId
    }
  }
  
  const setPreviewMode = (mode) => {
    if (['showcase', 'component', 'comparison'].includes(mode)) {
      previewMode.value = mode
    }
  }
  
  const togglePreview = () => {
    isPreviewEnabled.value = !isPreviewEnabled.value
  }
  
  const enablePreview = () => {
    isPreviewEnabled.value = true
  }
  
  const disablePreview = () => {
    isPreviewEnabled.value = false
  }
  
  // Update preview styles from theme changes
  const updatePreviewStyles = useDebounceFn((themeChanges) => {
    if (!isPreviewEnabled.value) return
    
    try {
      const newStyles = {}
      previewErrors.value = []
      
      // Convert theme settings to CSS custom properties
      Object.entries(themeChanges).forEach(([settingPath, value]) => {
        try {
          const cssVar = `--preview-${settingPath.replace(/\./g, '-')}`
          let cssValue = value
          
          // Convert setting value to CSS format
          const tokenValue = convertSettingToToken(settingPath, value)
          if (tokenValue !== value) {
            cssValue = tokenValue
          } else if (value && typeof value === 'object' && 'value' in value && 'unit' in value) {
            cssValue = `${value.value}${value.unit}`
          }
          
          newStyles[cssVar] = cssValue
        } catch (error) {
          previewErrors.value.push({
            setting: settingPath,
            error: error.message
          })
        }
      })
      
      previewStyles.value = newStyles
    } catch (error) {
      console.error('Error updating preview styles:', error)
      previewErrors.value.push({
        setting: 'global',
        error: error.message
      })
    }
  }, updateDelay)
  
  // Generate CSS for preview
  const generatePreviewCSS = (styles) => {
    let css = '/* Theme Designer Live Preview Styles */\n'
    css += '.theme-preview {\n'
    
    Object.entries(styles).forEach(([property, value]) => {
      css += `  ${property}: ${value};\n`
    })
    
    css += '}\n\n'
    
    // Add component-specific overrides
    css += generateComponentOverrides(styles)
    
    return css
  }
  
  const generateComponentOverrides = (styles) => {
    let css = ''
    
    // Button overrides
    if (styles['--preview-button-border-radius']) {
      css += `.theme-preview .p-button {\n`
      css += `  border-radius: var(--preview-button-border-radius);\n`
      css += `}\n\n`
    }
    
    if (styles['--preview-button-padding']) {
      css += `.theme-preview .p-button {\n`
      css += `  padding: var(--preview-button-padding);\n`
      css += `}\n\n`
    }
    
    // Input overrides
    if (styles['--preview-input-border-radius']) {
      css += `.theme-preview .p-inputtext,\n`
      css += `.theme-preview .p-select,\n`
      css += `.theme-preview .p-textarea {\n`
      css += `  border-radius: var(--preview-input-border-radius);\n`
      css += `}\n\n`
    }
    
    if (styles['--preview-input-padding']) {
      css += `.theme-preview .p-inputtext,\n`
      css += `.theme-preview .p-select .p-select-label,\n`
      css += `.theme-preview .p-textarea {\n`
      css += `  padding: var(--preview-input-padding);\n`
      css += `}\n\n`
    }
    
    // Card overrides
    if (styles['--preview-card-border-radius']) {
      css += `.theme-preview .p-card {\n`
      css += `  border-radius: var(--preview-card-border-radius);\n`
      css += `}\n\n`
    }
    
    if (styles['--preview-card-padding']) {
      css += `.theme-preview .p-card .p-card-body {\n`
      css += `  padding: var(--preview-card-padding);\n`
      css += `}\n\n`
    }
    
    return css
  }
  
  // Apply preview styles to DOM
  const applyPreviewStyles = () => {
    if (!isPreviewEnabled.value) return
    
    const styleId = 'theme-designer-preview-styles'
    let styleElement = document.getElementById(styleId)
    
    if (!styleElement) {
      styleElement = document.createElement('style')
      styleElement.id = styleId
      document.head.appendChild(styleElement)
    }
    
    styleElement.textContent = previewCSS.value
  }
  
  // Remove preview styles from DOM
  const removePreviewStyles = () => {
    const styleElement = document.getElementById('theme-designer-preview-styles')
    if (styleElement) {
      styleElement.remove()
    }
  }
  
  // Watch for preview changes
  watch(previewCSS, () => {
    if (isPreviewEnabled.value) {
      applyPreviewStyles()
    }
  })
  
  watch(isPreviewEnabled, (enabled) => {
    if (enabled) {
      applyPreviewStyles()
    } else {
      removePreviewStyles()
    }
  })
  
  // Component showcase helpers
  const getComponentPreviewData = (componentId) => {
    switch (componentId) {
      case 'button':
        return {
          variants: ['default', 'secondary', 'success', 'warning', 'danger'],
          sizes: ['small', 'normal', 'large'],
          states: ['default', 'loading', 'disabled']
        }
      case 'inputtext':
        return {
          variants: ['default', 'invalid'],
          sizes: ['small', 'normal', 'large'],
          states: ['default', 'focused', 'disabled']
        }
      case 'select':
        return {
          variants: ['default', 'invalid'],
          sizes: ['small', 'normal', 'large'],
          states: ['default', 'focused', 'disabled']
        }
      default:
        return {
          variants: ['default'],
          sizes: ['normal'],
          states: ['default']
        }
    }
  }
  
  const resetShowcaseData = () => {
    Object.assign(showcaseData, {
      inputValue: 'Sample text',
      selectValue: 'option1',
      checkboxValue: true,
      radioValue: 'option1',
      sliderValue: 50,
      activeTabIndex: 0
    })
  }
  
  // Cleanup
  const cleanup = () => {
    removePreviewStyles()
  }
  
  // Auto cleanup on unmount
  onUnmounted(() => {
    cleanup()
  })
  
  return {
    // State
    activeComponent,
    previewMode,
    isPreviewEnabled: readonly(isPreviewEnabled),
    previewStyles: readonly(previewStyles),
    previewErrors: readonly(previewErrors),
    showcaseData,
    
    // Computed
    availableComponents,
    componentsByCategory,
    currentComponent,
    previewCSS,
    
    // Methods
    setActiveComponent,
    setPreviewMode,
    togglePreview,
    enablePreview,
    disablePreview,
    updatePreviewStyles,
    getComponentPreviewData,
    resetShowcaseData,
    cleanup
  }
}