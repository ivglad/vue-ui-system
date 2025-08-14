/**
 * Corporate theme preset
 * Professional corporate theme with conservative styling
 */

export const corporateTheme = {
  id: 'corporate',
  name: 'Corporate',
  description: 'Professional corporate theme with conservative styling',
  version: '1.0.0',
  created: '2024-01-01T00:00:00.000Z',
  
  // Preview colors for theme selector
  preview: {
    primary: '#1e40af',
    surface: '#f8fafc',
    success: '#059669',
    warning: '#d97706',
    error: '#dc2626'
  },
  
  // Theme settings
  settings: {
    // Global colors
    'colors.primary': '#1e40af',
    'colors.surface': '#f8fafc',
    'colors.success': '#059669',
    'colors.warning': '#d97706',
    'colors.error': '#dc2626',
    
    // Typography
    'typography.fontSize': { value: 15, unit: 'px' },
    'typography.fontWeight': 500,
    'typography.lineHeight': 1.4,
    
    // Spacing
    'spacing.base': { value: 0.875, unit: 'rem' },
    'spacing.component': { value: 0.5, unit: 'rem' },
    
    // Button settings
    'button.borderRadius': { value: 4, unit: 'px' },
    'button.padding': { value: 16, unit: 'px' },
    'button.fontSize': { value: 15, unit: 'px' },
    'button.fontWeight': 600,
    
    // Input settings
    'input.borderRadius': { value: 4, unit: 'px' },
    'input.padding': { value: 12, unit: 'px' },
    'input.fontSize': { value: 15, unit: 'px' },
    
    // Card settings
    'card.borderRadius': { value: 6, unit: 'px' },
    'card.padding': { value: 24, unit: 'px' },
    'card.shadow': '0 1px 3px rgba(0,0,0,0.12)',
    
    // Message settings
    'message.borderRadius': { value: 4, unit: 'px' },
    'message.padding': { value: 16, unit: 'px' },
    
    // Tabs settings
    'tabs.borderRadius': { value: 4, unit: 'px' },
    'tabs.padding': { value: 16, unit: 'px' }
  }
}

export default corporateTheme