/**
 * Error handling utilities
 * Centralized error handling and recovery mechanisms
 */

// Error types
export const ErrorTypes = {
  VALIDATION: 'validation',
  NETWORK: 'network',
  STORAGE: 'storage',
  THEME_APPLICATION: 'theme_application',
  IMPORT_EXPORT: 'import_export',
  COMPONENT: 'component',
  SYSTEM: 'system'
}

// Error severity levels
export const ErrorSeverity = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
}

/**
 * Custom error class for theme designer
 */
export class ThemeDesignerError extends Error {
  constructor(message, type = ErrorTypes.SYSTEM, severity = ErrorSeverity.MEDIUM, details = {}) {
    super(message)
    this.name = 'ThemeDesignerError'
    this.type = type
    this.severity = severity
    this.details = details
    this.timestamp = new Date().toISOString()
  }
}

/**
 * Error handler composable
 */
export const useErrorHandler = () => {
  const errors = ref([])
  const isHandlingError = ref(false)
  
  // Add error to the error list
  const addError = (error) => {
    const errorObj = normalizeError(error)
    errors.value.push(errorObj)
    
    // Auto-remove low severity errors after a delay
    if (errorObj.severity === ErrorSeverity.LOW) {
      setTimeout(() => {
        removeError(errorObj.id)
      }, 5000)
    }
    
    return errorObj
  }
  
  // Remove error by ID
  const removeError = (errorId) => {
    const index = errors.value.findIndex(error => error.id === errorId)
    if (index > -1) {
      errors.value.splice(index, 1)
    }
  }
  
  // Clear all errors
  const clearErrors = () => {
    errors.value = []
  }
  
  // Clear errors by type
  const clearErrorsByType = (type) => {
    errors.value = errors.value.filter(error => error.type !== type)
  }
  
  // Handle error with automatic recovery attempts
  const handleError = async (error, options = {}) => {
    const {
      showToast = true,
      attemptRecovery = true,
      logError = true
    } = options
    
    isHandlingError.value = true
    
    try {
      const errorObj = addError(error)
      
      if (logError) {
        console.error('Theme Designer Error:', errorObj)
      }
      
      if (showToast) {
        showErrorToast(errorObj)
      }
      
      if (attemptRecovery) {
        await attemptErrorRecovery(errorObj)
      }
      
      return errorObj
    } finally {
      isHandlingError.value = false
    }
  }
  
  // Normalize different error types to consistent format
  const normalizeError = (error) => {
    let errorObj
    
    if (error instanceof ThemeDesignerError) {
      errorObj = {
        id: generateErrorId(),
        message: error.message,
        type: error.type,
        severity: error.severity,
        details: error.details,
        timestamp: error.timestamp,
        stack: error.stack
      }
    } else if (error instanceof Error) {
      errorObj = {
        id: generateErrorId(),
        message: error.message,
        type: ErrorTypes.SYSTEM,
        severity: ErrorSeverity.MEDIUM,
        details: {},
        timestamp: new Date().toISOString(),
        stack: error.stack
      }
    } else if (typeof error === 'string') {
      errorObj = {
        id: generateErrorId(),
        message: error,
        type: ErrorTypes.SYSTEM,
        severity: ErrorSeverity.MEDIUM,
        details: {},
        timestamp: new Date().toISOString()
      }
    } else {
      errorObj = {
        id: generateErrorId(),
        message: 'Unknown error occurred',
        type: ErrorTypes.SYSTEM,
        severity: ErrorSeverity.MEDIUM,
        details: error || {},
        timestamp: new Date().toISOString()
      }
    }
    
    return errorObj
  }
  
  // Show error toast notification
  const showErrorToast = (errorObj) => {
    const toast = useToast()
    
    const severityMap = {
      [ErrorSeverity.LOW]: 'info',
      [ErrorSeverity.MEDIUM]: 'warn',
      [ErrorSeverity.HIGH]: 'error',
      [ErrorSeverity.CRITICAL]: 'error'
    }
    
    const lifeMap = {
      [ErrorSeverity.LOW]: 3000,
      [ErrorSeverity.MEDIUM]: 5000,
      [ErrorSeverity.HIGH]: 8000,
      [ErrorSeverity.CRITICAL]: 0 // Sticky
    }
    
    toast.add({
      severity: severityMap[errorObj.severity] || 'error',
      summary: getErrorTitle(errorObj.type),
      detail: errorObj.message,
      life: lifeMap[errorObj.severity] || 5000
    })
  }
  
  // Attempt automatic error recovery
  const attemptErrorRecovery = async (errorObj) => {
    switch (errorObj.type) {
      case ErrorTypes.STORAGE:
        return attemptStorageRecovery(errorObj)
      case ErrorTypes.VALIDATION:
        return attemptValidationRecovery(errorObj)
      case ErrorTypes.THEME_APPLICATION:
        return attemptThemeRecovery(errorObj)
      case ErrorTypes.NETWORK:
        return attemptNetworkRecovery(errorObj)
      default:
        return false
    }
  }
  
  // Storage error recovery
  const attemptStorageRecovery = async (errorObj) => {
    try {
      // Clear corrupted localStorage data
      if (errorObj.details.key) {
        localStorage.removeItem(errorObj.details.key)
      }
      
      // Try to save a minimal valid state
      const minimalState = { timestamp: Date.now() }
      localStorage.setItem('theme-designer-recovery', JSON.stringify(minimalState))
      
      return true
    } catch (error) {
      console.warn('Storage recovery failed:', error)
      return false
    }
  }
  
  // Validation error recovery
  const attemptValidationRecovery = async (errorObj) => {
    try {
      // For validation errors, we can try to provide default values
      if (errorObj.details.setting && errorObj.details.defaultValue) {
        // This would need to be integrated with the theme designer state
        console.log('Attempting validation recovery for:', errorObj.details.setting)
        return true
      }
      return false
    } catch (error) {
      console.warn('Validation recovery failed:', error)
      return false
    }
  }
  
  // Theme application error recovery
  const attemptThemeRecovery = async (errorObj) => {
    try {
      // Try to reset to a known good state
      const { resetThemeToDefault } = await import('./tokenMapping.js')
      await resetThemeToDefault()
      return true
    } catch (error) {
      console.warn('Theme recovery failed:', error)
      return false
    }
  }
  
  // Network error recovery
  const attemptNetworkRecovery = async (errorObj) => {
    // For network errors, we might retry the operation
    if (errorObj.details.retryable && errorObj.details.retryCount < 3) {
      try {
        // This would need to be implemented based on the specific operation
        console.log('Attempting network recovery')
        return true
      } catch (error) {
        console.warn('Network recovery failed:', error)
        return false
      }
    }
    return false
  }
  
  // Get user-friendly error title
  const getErrorTitle = (type) => {
    const titles = {
      [ErrorTypes.VALIDATION]: 'Validation Error',
      [ErrorTypes.NETWORK]: 'Network Error',
      [ErrorTypes.STORAGE]: 'Storage Error',
      [ErrorTypes.THEME_APPLICATION]: 'Theme Error',
      [ErrorTypes.IMPORT_EXPORT]: 'Import/Export Error',
      [ErrorTypes.COMPONENT]: 'Component Error',
      [ErrorTypes.SYSTEM]: 'System Error'
    }
    
    return titles[type] || 'Error'
  }
  
  // Generate unique error ID
  const generateErrorId = () => {
    return `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
  
  // Computed properties
  const hasErrors = computed(() => errors.value.length > 0)
  const criticalErrors = computed(() => 
    errors.value.filter(error => error.severity === ErrorSeverity.CRITICAL)
  )
  const hasCriticalErrors = computed(() => criticalErrors.value.length > 0)
  
  return {
    // State
    errors: readonly(errors),
    isHandlingError: readonly(isHandlingError),
    
    // Computed
    hasErrors,
    criticalErrors,
    hasCriticalErrors,
    
    // Methods
    addError,
    removeError,
    clearErrors,
    clearErrorsByType,
    handleError
  }
}

/**
 * Validation error helpers
 */
export const createValidationError = (message, settingId, value, details = {}) => {
  return new ThemeDesignerError(
    message,
    ErrorTypes.VALIDATION,
    ErrorSeverity.MEDIUM,
    {
      settingId,
      value,
      ...details
    }
  )
}

/**
 * Theme application error helpers
 */
export const createThemeError = (message, operation, details = {}) => {
  return new ThemeDesignerError(
    message,
    ErrorTypes.THEME_APPLICATION,
    ErrorSeverity.HIGH,
    {
      operation,
      ...details
    }
  )
}

/**
 * Storage error helpers
 */
export const createStorageError = (message, key, operation, details = {}) => {
  return new ThemeDesignerError(
    message,
    ErrorTypes.STORAGE,
    ErrorSeverity.MEDIUM,
    {
      key,
      operation,
      ...details
    }
  )
}

/**
 * Import/Export error helpers
 */
export const createImportExportError = (message, operation, format, details = {}) => {
  return new ThemeDesignerError(
    message,
    ErrorTypes.IMPORT_EXPORT,
    ErrorSeverity.MEDIUM,
    {
      operation,
      format,
      ...details
    }
  )
}

/**
 * Global error boundary for catching unhandled errors
 */
export const setupGlobalErrorHandler = () => {
  const { handleError } = useErrorHandler()
  
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    handleError(
      new ThemeDesignerError(
        `Unhandled promise rejection: ${event.reason}`,
        ErrorTypes.SYSTEM,
        ErrorSeverity.HIGH,
        { reason: event.reason }
      )
    )
  })
  
  // Handle general JavaScript errors
  window.addEventListener('error', (event) => {
    handleError(
      new ThemeDesignerError(
        `JavaScript error: ${event.message}`,
        ErrorTypes.SYSTEM,
        ErrorSeverity.HIGH,
        {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          error: event.error
        }
      )
    )
  })
}

/**
 * Error boundary component helper
 */
export const withErrorBoundary = (component, fallbackComponent = null) => {
  return {
    ...component,
    errorCaptured(error, instance, info) {
      const { handleError } = useErrorHandler()
      
      handleError(
        new ThemeDesignerError(
          `Component error: ${error.message}`,
          ErrorTypes.COMPONENT,
          ErrorSeverity.HIGH,
          {
            componentName: instance?.$options.name || 'Unknown',
            errorInfo: info,
            error
          }
        )
      )
      
      // Return true to prevent the error from propagating further
      return true
    },
    
    // Provide fallback rendering if needed
    ...(fallbackComponent && {
      renderError(h, error) {
        return h(fallbackComponent, { error })
      }
    })
  }
}