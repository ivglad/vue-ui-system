/**
 * Dark theme preset
 * Dark theme with high contrast and purple accents
 */

export const darkTheme = {
  id: 'dark',
  name: 'Dark',
  description: 'Dark theme with high contrast and purple accents',
  version: '1.0.0',
  created: '2024-01-01T00:00:00.000Z',
  
  // Preview colors for theme selector
  preview: {
    primary: '#6366f1',
    surface: '#1f2937',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444'
  },
  
  // Theme settings
  settings: {
    // Global colors
    'colors.primary': '#6366f1',
    'colors.surface': '#1f2937',
    'colors.success': '#10b981',
    'colors.warning': '#f59e0b',
    'colors.error': '#ef4444',
    
    // Typography
    'typography.fontSize': { value: 14, unit: 'px' },
    'typography.fontWeight': 400,
    'typography.lineHeight': 1.6,
    
    // Spacing
    'spacing.base': { value: 1, unit: 'rem' },
    'spacing.component': { value: 0.75, unit: 'rem' },
    
    // Button settings
    'button.borderRadius': { value: 8, unit: 'px' },
    'button.padding': { value: 14, unit: 'px' },
    'button.fontSize': { value: 14, unit: 'px' },
    'button.fontWeight': 500,
    
    // Input settings
    'input.borderRadius': { value: 6, unit: 'px' },
    'input.padding': { value: 10, unit: 'px' },
    'input.fontSize': { value: 14, unit: 'px' },
    
    // Card settings
    'card.borderRadius': { value: 12, unit: 'px' },
    'card.padding': { value: 20, unit: 'px' },
    'card.shadow': '0 4px 8px rgba(0,0,0,0.3)',
    
    // Message settings
    'message.borderRadius': { value: 8, unit: 'px' },
    'message.padding': { value: 14, unit: 'px' },
    
    // Tabs settings
    'tabs.borderRadius': { value: 8, unit: 'px' },
    'tabs.padding': { value: 14, unit: 'px' }
  }
}

export default darkTheme