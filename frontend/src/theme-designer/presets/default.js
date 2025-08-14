/**
 * Default theme preset
 * Clean and modern default theme with blue primary color
 */

export const defaultTheme = {
  id: 'default',
  name: 'Default',
  description: 'Clean and modern default theme with blue accents',
  version: '1.0.0',
  created: '2024-01-01T00:00:00.000Z',
  
  // Preview colors for theme selector
  preview: {
    primary: '#3b82f6',
    surface: '#ffffff',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444'
  },
  
  // Theme settings
  settings: {
    // Global colors
    'colors.primary': '#3b82f6',
    'colors.surface': '#ffffff',
    'colors.success': '#10b981',
    'colors.warning': '#f59e0b',
    'colors.error': '#ef4444',
    
    // Typography
    'typography.fontSize': { value: 14, unit: 'px' },
    'typography.fontWeight': 400,
    'typography.lineHeight': 1.5,
    
    // Spacing
    'spacing.base': { value: 1, unit: 'rem' },
    'spacing.component': { value: 0.5, unit: 'rem' },
    
    // Button settings
    'button.borderRadius': { value: 6, unit: 'px' },
    'button.padding': { value: 12, unit: 'px' },
    'button.fontSize': { value: 14, unit: 'px' },
    'button.fontWeight': 500,
    
    // Input settings
    'input.borderRadius': { value: 4, unit: 'px' },
    'input.padding': { value: 8, unit: 'px' },
    'input.fontSize': { value: 14, unit: 'px' },
    
    // Card settings
    'card.borderRadius': { value: 8, unit: 'px' },
    'card.padding': { value: 16, unit: 'px' },
    'card.shadow': '0 2px 4px rgba(0,0,0,0.1)',
    
    // Message settings
    'message.borderRadius': { value: 6, unit: 'px' },
    'message.padding': { value: 12, unit: 'px' },
    
    // Tabs settings
    'tabs.borderRadius': { value: 6, unit: 'px' },
    'tabs.padding': { value: 12, unit: 'px' }
  }
}

export default defaultTheme