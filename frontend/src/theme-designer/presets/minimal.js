/**
 * Minimal theme preset
 * Clean minimal design with sharp edges and high contrast
 */

export const minimalTheme = {
  id: 'minimal',
  name: 'Minimal',
  description: 'Clean minimal design with sharp edges and high contrast',
  version: '1.0.0',
  created: '2024-01-01T00:00:00.000Z',
  
  // Preview colors for theme selector
  preview: {
    primary: '#000000',
    surface: '#ffffff',
    success: '#22c55e',
    warning: '#eab308',
    error: '#ef4444'
  },
  
  // Theme settings
  settings: {
    // Global colors
    'colors.primary': '#000000',
    'colors.surface': '#ffffff',
    'colors.success': '#22c55e',
    'colors.warning': '#eab308',
    'colors.error': '#ef4444',
    
    // Typography
    'typography.fontSize': { value: 16, unit: 'px' },
    'typography.fontWeight': 400,
    'typography.lineHeight': 1.5,
    
    // Spacing
    'spacing.base': { value: 1.25, unit: 'rem' },
    'spacing.component': { value: 1, unit: 'rem' },
    
    // Button settings
    'button.borderRadius': { value: 0, unit: 'px' },
    'button.padding': { value: 16, unit: 'px' },
    'button.fontSize': { value: 16, unit: 'px' },
    'button.fontWeight': 500,
    
    // Input settings
    'input.borderRadius': { value: 0, unit: 'px' },
    'input.padding': { value: 12, unit: 'px' },
    'input.fontSize': { value: 16, unit: 'px' },
    
    // Card settings
    'card.borderRadius': { value: 0, unit: 'px' },
    'card.padding': { value: 24, unit: 'px' },
    'card.shadow': '0 0 0 1px rgba(0,0,0,0.1)',
    
    // Message settings
    'message.borderRadius': { value: 0, unit: 'px' },
    'message.padding': { value: 16, unit: 'px' },
    
    // Tabs settings
    'tabs.borderRadius': { value: 0, unit: 'px' },
    'tabs.padding': { value: 16, unit: 'px' }
  }
}

export default minimalTheme