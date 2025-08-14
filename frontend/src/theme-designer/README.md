# PrimeVue Theme Designer

A visual theme customization tool for PrimeVue 4 with Tailwind 4 integration. This module provides an intuitive interface for customizing PrimeVue themes without requiring deep knowledge of the token system.

## Features

- 🎨 **Visual Theme Editor** - Intuitive interface for theme customization
- 🔄 **Live Preview** - Real-time preview of changes without affecting the main application
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile devices
- 🎯 **Component-Specific Settings** - Customize individual components or component groups
- 🎨 **Color Palette Management** - Easy color palette selection and generation
- 💾 **Import/Export** - Save and share themes as JSON files
- 🔧 **Extensible** - Easy to add new components and setting types
- ♿ **Accessible** - Full keyboard navigation and screen reader support

## Quick Start

### 1. Basic Usage

```vue
<script setup>
import { ThemeDesigner } from '@/theme-designer'

const handleThemeApplied = (theme) => {
  console.log('Theme applied:', theme)
  // Theme is automatically applied to PrimeVue
}
</script>

<template>
  <ThemeDesigner 
    :preview-components="['button', 'inputtext', 'select']"
    @theme-applied="handleThemeApplied"
  />
</template>
```

### 2. With Initial Theme

```vue
<script setup>
import { ThemeDesigner } from '@/theme-designer'
import { THEME_PRESETS } from '@/theme-designer/presets'

const initialTheme = THEME_PRESETS.dark.settings

const handleThemeChange = (change) => {
  console.log('Setting changed:', change.path, change.value)
}
</script>

<template>
  <ThemeDesigner 
    :initial-theme="initialTheme"
    :preview-components="['button', 'inputtext', 'card', 'datatable']"
    @setting-changed="handleThemeChange"
  />
</template>
```

### 3. Readonly Mode (Theme Viewer)

```vue
<script setup>
import { ThemeDesigner } from '@/theme-designer'

// Display an existing theme without editing capabilities
const currentTheme = ref({
  'colors.primary': '#10b981',
  'button.borderRadius': { value: 8, unit: 'px' },
  'typography.fontSize': { value: 14, unit: 'px' }
})
</script>

<template>
  <ThemeDesigner 
    :initial-theme="currentTheme"
    readonly
    :show-header="false"
    :preview-components="['button', 'inputtext', 'card']"
  />
</template>
```

### 4. Custom Integration

```vue
<script setup>
import { useThemeDesigner, useThemeExport } from '@/theme-designer'

// Use composables directly for custom integration
const {
  draft,
  applied,
  hasChanges,
  updateSetting,
  applyChanges,
  resetChanges
} = useThemeDesigner()

const { exportTheme, importTheme } = useThemeExport()

// Custom theme operations
const setCustomPrimary = () => {
  updateSetting('colors.primary', '#ff6b6b')
}

const saveTheme = async () => {
  if (hasChanges.value) {
    await applyChanges()
    const exported = await exportTheme(applied.value)
    // Save to your backend or local storage
  }
}
</script>

<template>
  <div class="custom-theme-controls">
    <Button @click="setCustomPrimary">Set Red Primary</Button>
    <Button @click="saveTheme" :disabled="!hasChanges">Save Theme</Button>
    <Button @click="resetChanges" :disabled="!hasChanges">Reset</Button>
  </div>
</template>
```

## API Reference

### ThemeDesigner Component

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialTheme` | `Object` | `{}` | Initial theme configuration |
| `previewComponents` | `Array` | `['button', 'inputtext', 'select']` | Components to show in preview |
| `readonly` | `Boolean` | `false` | Disable editing capabilities |
| `drawerPosition` | `String` | `'right'` | Position of settings drawer (`'left'` or `'right'`) |
| `showHeader` | `Boolean` | `true` | Show the header with title and actions |
| `autoSave` | `Boolean` | `true` | Automatically save changes to localStorage |

#### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `theme-applied` | `Object` | Emitted when theme changes are applied |
| `theme-reset` | `void` | Emitted when theme is reset |
| `theme-exported` | `Object` | Emitted when theme is exported |
| `theme-imported` | `Object` | Emitted when theme is imported |
| `setting-changed` | `Object` | Emitted when any setting changes (draft mode) |

### Composables

#### useThemeDesigner

Main composable for theme management:

```javascript
const {
  // State
  draft,
  applied,
  isDrawerOpen,
  activeSection,
  
  // Computed
  hasChanges,
  currentTheme,
  hasUnsavedChanges,
  
  // Methods
  updateSetting,
  applyChanges,
  resetChanges,
  initialize
} = useThemeDesigner()
```

#### useThemeValidation

Validation utilities:

```javascript
const {
  validateValue,
  validateThemeConfig,
  hasAnyErrors,
  allSettingsValid
} = useThemeValidation()
```

#### useThemeExport

Import/export functionality:

```javascript
const {
  exportTheme,
  importTheme,
  saveToLocalStorage,
  loadFromLocalStorage
} = useThemeExport()
```

## Setting Types

The theme designer supports various setting types:

### Color Settings
```javascript
{
  id: 'colors.primary',
  type: 'color',
  label: 'Primary Color',
  defaultValue: '#3b82f6',
  validation: { required: true }
}
```

### Size Settings
```javascript
{
  id: 'button.borderRadius',
  type: 'borderRadius',
  label: 'Border Radius',
  units: ['px', 'rem', '%'],
  defaultValue: { value: 6, unit: 'px' },
  validation: { min: 0, max: 50 }
}
```

### Range Settings
```javascript
{
  id: 'typography.lineHeight',
  type: 'range',
  label: 'Line Height',
  defaultValue: 1.5,
  validation: { min: 1, max: 3, step: 0.1 }
}
```

### Select Settings
```javascript
{
  id: 'button.variant',
  type: 'select',
  label: 'Button Variant',
  defaultValue: 'filled',
  validation: {
    options: ['filled', 'outlined', 'text', 'link']
  }
}
```

## Predefined Themes

The module includes several predefined themes:

- **Default** - Clean and modern blue theme
- **Dark** - Dark theme with purple accents
- **Corporate** - Professional conservative styling
- **Minimal** - Clean minimal design with sharp edges

```javascript
import { THEME_PRESETS } from '@/theme-designer/presets'

// Apply a preset
const applyDarkTheme = () => {
  const darkSettings = THEME_PRESETS.dark.settings
  // Apply settings...
}
```

## Extending the Theme Designer

### Adding New Setting Types

1. Add the type to `utils/settingTypes.js`:
```javascript
export const SettingTypes = {
  // ... existing types
  CUSTOM_TYPE: 'customType'
}
```

2. Create a control component in `components/controls/`:
```vue
<!-- CustomTypeControl.vue -->
<script setup>
// Your custom control implementation
</script>
```

3. Update `SettingControl.vue` to handle the new type:
```javascript
const getControlComponent = (type) => {
  switch (type) {
    // ... existing cases
    case SettingTypes.CUSTOM_TYPE:
      return CustomTypeControl
  }
}
```

### Adding New Components

1. Define the component in `data/componentDefinitions.js`:
```javascript
export const MyComponentSettings = {
  'mycomponent.setting': {
    id: 'mycomponent.setting',
    type: SettingTypes.COLOR,
    label: 'My Setting',
    // ... other properties
  }
}

export const ComponentDefinitions = {
  // ... existing components
  mycomponent: {
    id: 'mycomponent',
    name: 'My Component',
    group: 'forms',
    settings: Object.keys(MyComponentSettings),
    previewComponent: 'MyComponent'
  }
}
```

2. Add token mapping in `utils/tokenMapping.js`:
```javascript
export const TokenMappings = {
  // ... existing mappings
  'mycomponent.setting': {
    type: 'token',
    tokens: ['mycomponent.token.path'],
    converter: (value) => convertValue(value)
  }
}
```

## Configuration

### Vite Configuration

Ensure your `vite.config.js` includes the theme designer in auto-imports:

```javascript
AutoImport({
  dirs: [
    'src/composables/**',
    'src/theme-designer/composables/**',
    'src/theme-designer/utils/**',
  ],
}),

Components({
  dirs: ['src', 'src/theme-designer/components'],
  deep: true,
})
```

### Router Configuration

Add the theme designer route:

```javascript
const routes = [
  {
    path: '/theme',
    name: 'Theme Designer',
    component: () => import('@/views/Theme.vue')
  }
]
```

## Troubleshooting

### Common Issues

1. **Theme changes not applying**
   - Check that PrimeVue APIs are properly imported
   - Verify token mappings are correct
   - Check browser console for errors

2. **Settings not saving**
   - Ensure localStorage is available
   - Check for storage quota limits
   - Verify auto-save is enabled

3. **Components not showing in preview**
   - Check that components are included in `previewComponents` prop
   - Verify component definitions exist
   - Check for import errors

### Debug Mode

Enable debug logging:

```javascript
// In browser console
localStorage.setItem('theme-designer-debug', 'true')
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## File Structure

```
theme-designer/
├── components/           # Vue components
│   ├── ThemeDesigner.vue        # Main component
│   ├── ThemeDesignerDrawer.vue  # Settings drawer
│   ├── ThemePreview.vue         # Live preview
│   ├── controls/               # Setting controls
│   │   ├── SettingControl.vue
│   │   ├── ColorPicker.vue
│   │   ├── UnitInput.vue
│   │   └── ...
│   └── sections/              # Setting sections
│       ├── GlobalSection.vue
│       ├── ComponentSection.vue
│       └── ...
├── composables/         # Vue composables
│   ├── useThemeDesigner.js     # Main state management
│   ├── useThemeValidation.js   # Validation logic
│   ├── useThemeExport.js       # Import/export
│   └── useThemePreview.js      # Preview management
├── utils/              # Utility functions
│   ├── settingTypes.js         # Type definitions
│   ├── validators.js           # Validation functions
│   ├── converters.js           # Value converters
│   ├── tokenMapping.js         # PrimeVue integration
│   └── colorPalettes.js        # Color utilities
├── data/               # Configuration data
│   ├── componentDefinitions.js # Component settings
│   └── settingGroups.js        # Setting organization
├── presets/            # Theme presets
│   ├── default.js
│   ├── dark.js
│   ├── corporate.js
│   └── minimal.js
├── examples/           # Usage examples
├── docs/              # Documentation
└── README.md          # This file
```

## Development

### Adding New Setting Types

1. Define the type in `utils/settingTypes.js`
2. Create validation logic in `utils/validators.js`
3. Add converter functions in `utils/converters.js`
4. Create control component in `components/controls/`
5. Update `SettingControl.vue` to handle the new type

### Adding New Components

1. Define settings in `data/componentDefinitions.js`
2. Add token mappings in `utils/tokenMapping.js`
3. Include in appropriate setting group
4. Test with preview component

### Testing

The theme designer includes comprehensive validation and error handling:

- **Real-time validation** for all setting types
- **Automatic value correction** for out-of-range inputs
- **Error recovery** mechanisms
- **Graceful degradation** for unsupported features

### Performance

- **Debounced updates** prevent excessive re-renders
- **Lazy loading** for components and presets
- **Memoized computations** for expensive operations
- **Virtual scrolling** for large setting lists

## Dependencies

- **Vue 3.5+** with Composition API
- **PrimeVue 4.3+** with Aura theme
- **Tailwind CSS 4+** with PrimeUI integration
- **@primevue/core** for theme APIs
- **Vite 7+** as build tool

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Follow the existing code style and patterns
2. Add comprehensive JSDoc comments
3. Include validation for new setting types
4. Test on multiple browsers and devices
5. Update documentation for new features

## License

This module is part of the PrimeVue Theme Designer project and follows the same licensing terms as the main project.