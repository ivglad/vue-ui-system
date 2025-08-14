# Theme Designer API Documentation

## Components

### ThemeDesigner

Main theme designer component that provides a complete theme customization interface.

#### Props

```typescript
interface ThemeDesignerProps {
  initialTheme?: Record<string, any>
  previewComponents?: string[]
  readonly?: boolean
  drawerPosition?: 'left' | 'right'
  showHeader?: boolean
  autoSave?: boolean
}
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialTheme` | `Object` | `{}` | Initial theme configuration to load |
| `previewComponents` | `Array<string>` | `['button', 'inputtext', 'select']` | List of components to show in preview |
| `readonly` | `Boolean` | `false` | Disable all editing capabilities |
| `drawerPosition` | `'left' \| 'right'` | `'right'` | Position of the settings drawer |
| `showHeader` | `Boolean` | `true` | Show/hide the header with title and actions |
| `autoSave` | `Boolean` | `true` | Automatically save changes to localStorage |

#### Events

```typescript
interface ThemeDesignerEvents {
  'theme-applied': (theme: Record<string, any>) => void
  'theme-reset': () => void
  'theme-exported': (theme: Record<string, any>) => void
  'theme-imported': (theme: Record<string, any>) => void
  'setting-changed': (change: SettingChange) => void
  'drawer-toggled': (isOpen: boolean) => void
}
```

#### Usage Examples

```vue
<!-- Basic usage -->
<ThemeDesigner @theme-applied="handleThemeApplied" />

<!-- With initial theme -->
<ThemeDesigner 
  :initial-theme="myTheme"
  :preview-components="['button', 'card', 'datatable']"
/>

<!-- Readonly mode -->
<ThemeDesigner 
  :initial-theme="currentTheme"
  readonly
  :show-header="false"
/>
```

### ThemeDesignerDrawer

Settings drawer component (used internally by ThemeDesigner).

#### Props

```typescript
interface ThemeDesignerDrawerProps {
  isOpen?: boolean
  position?: 'left' | 'right'
  title?: string
  showCloseButton?: boolean
}
```

### ThemePreview

Live preview component that shows theme changes in real-time.

#### Props

```typescript
interface ThemePreviewProps {
  components?: string[]
  theme?: Record<string, any>
  showComponentLabels?: boolean
}
```

## Composables

### useThemeDesigner

Main composable for theme state management.

```typescript
interface UseThemeDesigner {
  // State
  draft: Ref<Record<string, any>>
  applied: Ref<Record<string, any>>
  isDrawerOpen: Ref<boolean>
  activeSection: Ref<string>
  
  // Computed
  hasChanges: ComputedRef<boolean>
  currentTheme: ComputedRef<Record<string, any>>
  hasUnsavedChanges: ComputedRef<boolean>
  
  // Methods
  updateSetting: (path: string, value: any) => void
  applyChanges: () => Promise<void>
  resetChanges: () => void
  initialize: (theme?: Record<string, any>) => void
  toggleDrawer: () => void
  setActiveSection: (section: string) => void
}
```

#### Usage

```javascript
const {
  draft,
  applied,
  hasChanges,
  updateSetting,
  applyChanges,
  resetChanges
} = useThemeDesigner()

// Update a setting
updateSetting('colors.primary', '#ff6b6b')

// Apply changes
await applyChanges()

// Reset to last applied state
resetChanges()
```

### useThemeValidation

Validation utilities for theme settings.

```typescript
interface UseThemeValidation {
  validateValue: (value: any, validation: ValidationRule) => ValidationResult
  validateThemeConfig: (theme: Record<string, any>) => ValidationResult[]
  hasAnyErrors: ComputedRef<boolean>
  allSettingsValid: ComputedRef<boolean>
}
```

#### Usage

```javascript
const { validateValue, hasAnyErrors } = useThemeValidation()

// Validate a single value
const result = validateValue('#ff6b6b', { 
  required: true, 
  type: 'color' 
})

if (result.isValid) {
  console.log('Valid color')
} else {
  console.error('Validation errors:', result.errors)
}
```

### useThemeExport

Import/export functionality for themes.

```typescript
interface UseThemeExport {
  exportTheme: (theme: Record<string, any>) => Promise<ExportedTheme>
  importTheme: (data: any) => Promise<Record<string, any>>
  saveToLocalStorage: (theme: Record<string, any>, key?: string) => void
  loadFromLocalStorage: (key?: string) => Record<string, any> | null
}
```

#### Usage

```javascript
const { exportTheme, importTheme } = useThemeExport()

// Export current theme
const exported = await exportTheme(currentTheme.value)

// Import theme from file
const imported = await importTheme(fileData)
```

### useThemePreview

Preview management composable.

```typescript
interface UseThemePreview {
  previewTheme: Ref<Record<string, any>>
  isPreviewMode: Ref<boolean>
  updatePreview: (theme: Record<string, any>) => void
  resetPreview: () => void
  applyPreviewToMain: () => void
}
```

## Utilities

### Setting Types

```typescript
enum SettingTypes {
  COLOR = 'color',
  SIZE = 'size',
  BORDER_RADIUS = 'borderRadius',
  SPACING = 'spacing',
  RANGE = 'range',
  SELECT = 'select',
  BOOLEAN = 'boolean',
  FONT_SIZE = 'fontSize',
  FONT_WEIGHT = 'fontWeight',
  LINE_HEIGHT = 'lineHeight'
}
```

### Validation Rules

```typescript
interface ValidationRule {
  required?: boolean
  type?: string
  min?: number
  max?: number
  step?: number
  options?: string[]
  pattern?: RegExp
  custom?: (value: any) => boolean | string
}
```

### Setting Definition

```typescript
interface SettingDefinition {
  id: string
  type: SettingTypes
  label: string
  description?: string
  defaultValue: any
  validation?: ValidationRule
  group?: string
  dependencies?: string[]
  conditional?: (theme: Record<string, any>) => boolean
}
```

## Token Mapping

### Token Mapping Types

```typescript
interface TokenMapping {
  type: 'token' | 'css-var' | 'function'
  tokens?: string[]
  cssVars?: string[]
  converter?: (value: any) => any
  validator?: (value: any) => boolean
}
```

### Adding Custom Mappings

```javascript
// utils/tokenMapping.js
export const TokenMappings = {
  'mycomponent.color': {
    type: 'token',
    tokens: ['mycomponent.background'],
    converter: (value) => value
  },
  
  'mycomponent.size': {
    type: 'css-var',
    cssVars: ['--my-component-size'],
    converter: (value) => `${value.value}${value.unit}`
  }
}
```

## Component Definitions

### Component Definition Structure

```typescript
interface ComponentDefinition {
  id: string
  name: string
  group: string
  settings: string[]
  previewComponent?: string
  dependencies?: string[]
  description?: string
}
```

### Adding New Components

```javascript
// data/componentDefinitions.js
export const MyComponentSettings = {
  'mycomponent.background': {
    id: 'mycomponent.background',
    type: SettingTypes.COLOR,
    label: 'Background Color',
    defaultValue: '#ffffff',
    validation: { required: true }
  }
}

export const ComponentDefinitions = {
  mycomponent: {
    id: 'mycomponent',
    name: 'My Component',
    group: 'custom',
    settings: Object.keys(MyComponentSettings),
    previewComponent: 'MyComponent'
  }
}
```

## Error Handling

### Error Types

```typescript
interface ThemeError {
  type: 'validation' | 'import' | 'export' | 'api'
  message: string
  field?: string
  code?: string
}
```

### Error Recovery

```javascript
// Automatic error recovery
const { handleError, recoverFromError } = useErrorHandling()

try {
  await applyChanges()
} catch (error) {
  const recovery = await handleError(error)
  if (recovery.canRecover) {
    await recoverFromError(recovery.strategy)
  }
}
```

## Performance Considerations

### Optimization Tips

1. **Debounced Updates**: Setting changes are debounced to prevent excessive re-renders
2. **Lazy Loading**: Components are loaded only when needed
3. **Memoization**: Expensive computations are memoized
4. **Virtual Scrolling**: Large setting lists use virtual scrolling

### Memory Management

```javascript
// Cleanup when component unmounts
onUnmounted(() => {
  // Clear theme cache
  clearThemeCache()
  
  // Remove event listeners
  removeEventListeners()
  
  // Cancel pending operations
  cancelPendingOperations()
})
```

## Browser Compatibility

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

## TypeScript Support

The theme designer includes TypeScript definitions for all public APIs. Enable TypeScript support by:

1. Installing TypeScript dependencies
2. Adding type definitions to your project
3. Using the provided interfaces

```typescript
import type { ThemeDesignerProps, UseThemeDesigner } from '@/theme-designer/types'
```