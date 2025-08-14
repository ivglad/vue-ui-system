/**
 * Component definitions and settings
 * Defines available settings for each PrimeVue component
 */

import { SettingTypes } from '../utils/settingTypes.js'

// Button component settings
export const ButtonSettings = {
  'button.borderRadius': {
    id: 'button.borderRadius',
    type: SettingTypes.BORDER_RADIUS,
    label: 'Border Radius',
    description: 'Corner rounding for buttons',
    category: 'appearance',
    units: ['px', 'rem', '%'],
    defaultValue: { value: 6, unit: 'px' },
    validation: { min: 0, max: 50 },
    tokens: ['button.border.radius', 'button.rounded.border.radius']
  },
  'button.padding': {
    id: 'button.padding',
    type: SettingTypes.SPACING,
    label: 'Padding',
    description: 'Internal spacing of buttons',
    category: 'spacing',
    units: ['px', 'rem', 'em'],
    defaultValue: { value: 12, unit: 'px' },
    validation: { min: 0, max: 50 },
    tokens: ['button.padding.x', 'button.padding.y']
  },
  'button.fontSize': {
    id: 'button.fontSize',
    type: SettingTypes.FONT_SIZE,
    label: 'Font Size',
    description: 'Text size in buttons',
    category: 'typography',
    units: ['px', 'rem', 'em'],
    defaultValue: { value: 14, unit: 'px' },
    validation: { min: 8, max: 32 },
    tokens: ['button.font.size']
  },
  'button.fontWeight': {
    id: 'button.fontWeight',
    type: SettingTypes.FONT_WEIGHT,
    label: 'Font Weight',
    description: 'Text weight in buttons',
    category: 'typography',
    defaultValue: 500,
    validation: { min: 100, max: 900 },
    tokens: ['button.font.weight']
  }
}

// Input component settings
export const InputSettings = {
  'input.borderRadius': {
    id: 'input.borderRadius',
    type: SettingTypes.BORDER_RADIUS,
    label: 'Border Radius',
    description: 'Corner rounding for input fields',
    category: 'appearance',
    units: ['px', 'rem', '%'],
    defaultValue: { value: 4, unit: 'px' },
    validation: { min: 0, max: 25 },
    tokens: ['inputtext.border.radius']
  },
  'input.padding': {
    id: 'input.padding',
    type: SettingTypes.SPACING,
    label: 'Padding',
    description: 'Internal spacing of input fields',
    category: 'spacing',
    units: ['px', 'rem', 'em'],
    defaultValue: { value: 8, unit: 'px' },
    validation: { min: 0, max: 30 },
    tokens: ['inputtext.padding.x', 'inputtext.padding.y']
  },
  'input.fontSize': {
    id: 'input.fontSize',
    type: SettingTypes.FONT_SIZE,
    label: 'Font Size',
    description: 'Text size in input fields',
    category: 'typography',
    units: ['px', 'rem', 'em'],
    defaultValue: { value: 14, unit: 'px' },
    validation: { min: 10, max: 24 },
    tokens: ['inputtext.font.size']
  }
}

// Global color settings
export const GlobalColorSettings = {
  'colors.primary': {
    id: 'colors.primary',
    type: SettingTypes.COLOR,
    label: 'Primary Color',
    description: 'Main brand color used throughout the theme',
    category: 'colors',
    defaultValue: '#3b82f6',
    validation: { required: true },
    tokens: ['primary']
  },
  'colors.surface': {
    id: 'colors.surface',
    type: SettingTypes.COLOR,
    label: 'Surface Color',
    description: 'Background color for surfaces and cards',
    category: 'colors',
    defaultValue: '#ffffff',
    validation: { required: true },
    tokens: ['surface']
  },
  'colors.success': {
    id: 'colors.success',
    type: SettingTypes.COLOR,
    label: 'Success Color',
    description: 'Color for success states and messages',
    category: 'colors',
    defaultValue: '#10b981',
    validation: { required: true },
    tokens: ['green']
  },
  'colors.warning': {
    id: 'colors.warning',
    type: SettingTypes.COLOR,
    label: 'Warning Color',
    description: 'Color for warning states and messages',
    category: 'colors',
    defaultValue: '#f59e0b',
    validation: { required: true },
    tokens: ['yellow']
  },
  'colors.error': {
    id: 'colors.error',
    type: SettingTypes.COLOR,
    label: 'Error Color',
    description: 'Color for error states and messages',
    category: 'colors',
    defaultValue: '#ef4444',
    validation: { required: true },
    tokens: ['red']
  }
}

// Global typography settings
export const GlobalTypographySettings = {
  'typography.fontSize': {
    id: 'typography.fontSize',
    type: SettingTypes.FONT_SIZE,
    label: 'Base Font Size',
    description: 'Default font size for the theme',
    category: 'typography',
    units: ['px', 'rem'],
    defaultValue: { value: 14, unit: 'px' },
    validation: { min: 10, max: 24 },
    tokens: ['font.size']
  },
  'typography.fontWeight': {
    id: 'typography.fontWeight',
    type: SettingTypes.FONT_WEIGHT,
    label: 'Base Font Weight',
    description: 'Default font weight for the theme',
    category: 'typography',
    defaultValue: 400,
    validation: { min: 100, max: 900 },
    tokens: ['font.weight']
  },
  'typography.lineHeight': {
    id: 'typography.lineHeight',
    type: SettingTypes.RANGE,
    label: 'Line Height',
    description: 'Default line height for text',
    category: 'typography',
    defaultValue: 1.5,
    validation: { min: 1, max: 3, step: 0.1 },
    tokens: ['font.line.height']
  }
}

// Global spacing settings
export const GlobalSpacingSettings = {
  'spacing.base': {
    id: 'spacing.base',
    type: SettingTypes.SPACING,
    label: 'Base Spacing',
    description: 'Base unit for spacing calculations',
    category: 'spacing',
    units: ['px', 'rem'],
    defaultValue: { value: 1, unit: 'rem' },
    validation: { min: 0.25, max: 4 },
    tokens: ['spacing.base']
  },
  'spacing.component': {
    id: 'spacing.component',
    type: SettingTypes.SPACING,
    label: 'Component Spacing',
    description: 'Default spacing between components',
    category: 'spacing',
    units: ['px', 'rem'],
    defaultValue: { value: 0.5, unit: 'rem' },
    validation: { min: 0, max: 2 },
    tokens: ['spacing.component']
  }
}

// Additional component settings
export const TabsSettings = {
  'tabs.borderRadius': {
    id: 'tabs.borderRadius',
    type: SettingTypes.BORDER_RADIUS,
    label: 'Tab Border Radius',
    description: 'Corner rounding for tab headers',
    category: 'appearance',
    units: ['px', 'rem', '%'],
    defaultValue: { value: 6, unit: 'px' },
    validation: { min: 0, max: 25 },
    tokens: ['tabview.nav.border.radius']
  },
  'tabs.padding': {
    id: 'tabs.padding',
    type: SettingTypes.SPACING,
    label: 'Tab Padding',
    description: 'Internal spacing of tab headers',
    category: 'spacing',
    units: ['px', 'rem', 'em'],
    defaultValue: { value: 12, unit: 'px' },
    validation: { min: 0, max: 30 },
    tokens: ['tabview.nav.item.padding']
  }
}

export const CardSettings = {
  'card.borderRadius': {
    id: 'card.borderRadius',
    type: SettingTypes.BORDER_RADIUS,
    label: 'Card Border Radius',
    description: 'Corner rounding for cards',
    category: 'appearance',
    units: ['px', 'rem', '%'],
    defaultValue: { value: 8, unit: 'px' },
    validation: { min: 0, max: 50 },
    tokens: ['card.border.radius']
  },
  'card.padding': {
    id: 'card.padding',
    type: SettingTypes.SPACING,
    label: 'Card Padding',
    description: 'Internal spacing of cards',
    category: 'spacing',
    units: ['px', 'rem', 'em'],
    defaultValue: { value: 16, unit: 'px' },
    validation: { min: 0, max: 50 },
    tokens: ['card.body.padding']
  },
  'card.shadow': {
    id: 'card.shadow',
    type: SettingTypes.SHADOW,
    label: 'Card Shadow',
    description: 'Drop shadow for cards',
    category: 'appearance',
    defaultValue: '0 2px 4px rgba(0,0,0,0.1)',
    validation: { required: false },
    tokens: ['card.shadow']
  }
}

export const MessageSettings = {
  'message.borderRadius': {
    id: 'message.borderRadius',
    type: SettingTypes.BORDER_RADIUS,
    label: 'Message Border Radius',
    description: 'Corner rounding for messages',
    category: 'appearance',
    units: ['px', 'rem', '%'],
    defaultValue: { value: 6, unit: 'px' },
    validation: { min: 0, max: 25 },
    tokens: ['message.border.radius']
  },
  'message.padding': {
    id: 'message.padding',
    type: SettingTypes.SPACING,
    label: 'Message Padding',
    description: 'Internal spacing of messages',
    category: 'spacing',
    units: ['px', 'rem', 'em'],
    defaultValue: { value: 12, unit: 'px' },
    validation: { min: 0, max: 30 },
    tokens: ['message.padding']
  }
}

// Component definitions
export const ComponentDefinitions = {
  button: {
    id: 'button',
    name: 'Button',
    group: 'forms',
    description: 'Interactive button component for actions and navigation',
    settings: Object.keys(ButtonSettings),
    previewComponent: 'Button',
    dependencies: ['colors.primary'],
    category: 'forms'
  },
  inputtext: {
    id: 'inputtext',
    name: 'Input Text',
    group: 'forms',
    description: 'Text input field for user data entry',
    settings: Object.keys(InputSettings),
    previewComponent: 'InputText',
    dependencies: [],
    category: 'forms'
  },
  select: {
    id: 'select',
    name: 'Select',
    group: 'forms',
    description: 'Dropdown selection component',
    settings: ['input.borderRadius', 'input.padding', 'input.fontSize'],
    previewComponent: 'Select',
    dependencies: ['colors.primary'],
    category: 'forms'
  },
  checkbox: {
    id: 'checkbox',
    name: 'Checkbox',
    group: 'forms',
    description: 'Boolean input component for selections',
    settings: ['input.borderRadius'],
    previewComponent: 'Checkbox',
    dependencies: ['colors.primary'],
    category: 'forms'
  },
  radiobutton: {
    id: 'radiobutton',
    name: 'Radio Button',
    group: 'forms',
    description: 'Single selection from multiple options',
    settings: ['input.borderRadius'],
    previewComponent: 'RadioButton',
    dependencies: ['colors.primary'],
    category: 'forms'
  },
  textarea: {
    id: 'textarea',
    name: 'Textarea',
    group: 'forms',
    description: 'Multi-line text input component',
    settings: ['input.borderRadius', 'input.padding', 'input.fontSize'],
    previewComponent: 'Textarea',
    dependencies: [],
    category: 'forms'
  },
  inputnumber: {
    id: 'inputnumber',
    name: 'Input Number',
    group: 'forms',
    description: 'Numeric input with increment/decrement controls',
    settings: ['input.borderRadius', 'input.padding', 'input.fontSize'],
    previewComponent: 'InputNumber',
    dependencies: ['colors.primary'],
    category: 'forms'
  },
  tabs: {
    id: 'tabs',
    name: 'Tabs',
    group: 'navigation',
    description: 'Tabbed interface for organizing content',
    settings: Object.keys(TabsSettings),
    previewComponent: 'TabView',
    dependencies: ['colors.primary'],
    category: 'navigation'
  },
  menu: {
    id: 'menu',
    name: 'Menu',
    group: 'navigation',
    description: 'Navigation menu component',
    settings: ['input.borderRadius', 'input.padding'],
    previewComponent: 'Menu',
    dependencies: ['colors.primary'],
    category: 'navigation'
  },
  breadcrumb: {
    id: 'breadcrumb',
    name: 'Breadcrumb',
    group: 'navigation',
    description: 'Navigation breadcrumb trail',
    settings: ['input.fontSize'],
    previewComponent: 'Breadcrumb',
    dependencies: ['colors.primary'],
    category: 'navigation'
  },
  steps: {
    id: 'steps',
    name: 'Steps',
    group: 'navigation',
    description: 'Step-by-step navigation indicator',
    settings: ['input.borderRadius'],
    previewComponent: 'Steps',
    dependencies: ['colors.primary'],
    category: 'navigation'
  },
  menubar: {
    id: 'menubar',
    name: 'Menubar',
    group: 'navigation',
    description: 'Horizontal navigation menubar',
    settings: ['input.borderRadius', 'input.padding'],
    previewComponent: 'Menubar',
    dependencies: ['colors.primary'],
    category: 'navigation'
  },
  toast: {
    id: 'toast',
    name: 'Toast',
    group: 'feedback',
    description: 'Temporary notification messages',
    settings: Object.keys(MessageSettings),
    previewComponent: 'Toast',
    dependencies: ['colors.success', 'colors.warning', 'colors.error'],
    category: 'feedback'
  },
  message: {
    id: 'message',
    name: 'Message',
    group: 'feedback',
    description: 'Inline message component',
    settings: Object.keys(MessageSettings),
    previewComponent: 'Message',
    dependencies: ['colors.success', 'colors.warning', 'colors.error'],
    category: 'feedback'
  },
  confirmdialog: {
    id: 'confirmdialog',
    name: 'Confirm Dialog',
    group: 'feedback',
    description: 'Modal confirmation dialog',
    settings: ['card.borderRadius', 'card.padding', 'card.shadow'],
    previewComponent: 'ConfirmDialog',
    dependencies: ['colors.primary'],
    category: 'feedback'
  },
  dialog: {
    id: 'dialog',
    name: 'Dialog',
    group: 'feedback',
    description: 'Modal dialog component',
    settings: ['card.borderRadius', 'card.padding', 'card.shadow'],
    previewComponent: 'Dialog',
    dependencies: [],
    category: 'feedback'
  },
  progressbar: {
    id: 'progressbar',
    name: 'Progress Bar',
    group: 'feedback',
    description: 'Progress indication component',
    settings: ['input.borderRadius'],
    previewComponent: 'ProgressBar',
    dependencies: ['colors.primary'],
    category: 'feedback'
  },
  datatable: {
    id: 'datatable',
    name: 'Data Table',
    group: 'data',
    description: 'Advanced data table with sorting and filtering',
    settings: ['input.borderRadius', 'input.padding', 'input.fontSize'],
    previewComponent: 'DataTable',
    dependencies: ['colors.primary'],
    category: 'data'
  },
  card: {
    id: 'card',
    name: 'Card',
    group: 'data',
    description: 'Content container with header and footer',
    settings: Object.keys(CardSettings),
    previewComponent: 'Card',
    dependencies: [],
    category: 'data'
  },
  panel: {
    id: 'panel',
    name: 'Panel',
    group: 'data',
    description: 'Collapsible content panel',
    settings: ['card.borderRadius', 'card.padding'],
    previewComponent: 'Panel',
    dependencies: ['colors.primary'],
    category: 'data'
  },
  accordion: {
    id: 'accordion',
    name: 'Accordion',
    group: 'data',
    description: 'Vertically stacked collapsible panels',
    settings: ['card.borderRadius', 'card.padding'],
    previewComponent: 'Accordion',
    dependencies: ['colors.primary'],
    category: 'data'
  },
  fieldset: {
    id: 'fieldset',
    name: 'Fieldset',
    group: 'data',
    description: 'Grouped form fields with legend',
    settings: ['card.borderRadius', 'card.padding'],
    previewComponent: 'Fieldset',
    dependencies: [],
    category: 'data'
  }
}

// All settings combined
export const AllSettings = {
  ...GlobalColorSettings,
  ...GlobalTypographySettings,
  ...GlobalSpacingSettings,
  ...ButtonSettings,
  ...InputSettings,
  ...TabsSettings,
  ...CardSettings,
  ...MessageSettings
}

// Utility functions
export const getSettingById = (settingId) => {
  return AllSettings[settingId] || null
}

export const getSettingsForComponent = (componentId) => {
  const component = ComponentDefinitions[componentId]
  if (!component) return []
  
  return component.settings.map(settingId => AllSettings[settingId]).filter(Boolean)
}

export const getSettingsByCategory = (category) => {
  return Object.values(AllSettings).filter(setting => setting.category === category)
}

export const getSettingsByType = (type) => {
  return Object.values(AllSettings).filter(setting => setting.type === type)
}