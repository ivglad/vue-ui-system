# Installation Guide

## Prerequisites

Before installing the PrimeVue Theme Designer, ensure you have:

- **Vue 3.5+** with Composition API
- **PrimeVue 4.3+** with Aura theme
- **Tailwind CSS 4+** with PrimeUI integration
- **Vite 7+** as build tool

## Installation Steps

### 1. Copy Theme Designer Module

Copy the entire `theme-designer` directory to your project:

```bash
cp -r theme-designer/ src/theme-designer/
```

### 2. Configure Auto-imports

Update your `vite.config.js` to include theme designer in auto-imports:

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'

export default defineConfig({
  plugins: [
    vue(),
    
    // Auto-import functions
    AutoImport({
      imports: ['vue', 'vue-router', '@vueuse/core'],
      dirs: [
        'src/composables/**',
        'src/theme-designer/composables/**',
        'src/theme-designer/utils/**',
      ],
      dts: true,
    }),
    
    // Auto-import components
    Components({
      dirs: [
        'src/components',
        'src/theme-designer/components',
      ],
      deep: true,
      dts: true,
    }),
  ],
})
```

### 3. Add Router Configuration

Add the theme designer route to your router:

```javascript
// src/router/index.js
const routes = [
  // ... your existing routes
  {
    path: '/theme',
    name: 'ThemeDesigner',
    component: () => import('@/views/Theme.vue'),
    meta: {
      title: 'Theme Designer'
    }
  }
]
```

### 4. Create Theme View

Create a view component for the theme designer:

```vue
<!-- src/views/Theme.vue -->
<script setup>
import { ThemeDesigner } from '@/theme-designer'

const handleThemeApplied = (theme) => {
  console.log('Theme applied:', theme)
}
</script>

<template>
  <div class="theme-view">
    <ThemeDesigner
      :preview-components="['button', 'inputtext', 'select', 'card', 'datatable']"
      @theme-applied="handleThemeApplied"
    />
  </div>
</template>

<style scoped>
.theme-view {
  min-height: 100vh;
  background: var(--p-surface-ground);
}
</style>
```

### 5. Configure PrimeVue (if not already done)

Ensure PrimeVue is properly configured with Aura theme:

```javascript
// src/main.js
import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'

const app = createApp(App)

app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: '.dark-mode',
      cssLayer: {
        name: 'default',
        order: 'reset, theme, base, default, preset, app',
      },
    },
  },
})
```

### 6. Add Required PrimeVue Components

Install the PrimeVue components used by the theme designer:

```bash
npm install primevue
```

The theme designer uses these PrimeVue components:
- Button
- InputText
- Select
- Slider
- ColorPicker
- Card
- Drawer
- Tabs
- TabPanel
- Message
- Toast
- Dialog

### 7. Configure Tailwind CSS

Ensure your `tailwind.config.js` includes PrimeUI:

```javascript
// tailwind.config.js
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  plugins: [
    require('tailwindcss-primeui')
  ],
}
```

## Optional Configuration

### Custom Theme Presets

Add your own theme presets:

```javascript
// src/theme-designer/presets/custom.js
export const CustomPreset = {
  name: 'Custom Theme',
  description: 'My custom theme preset',
  settings: {
    'colors.primary': '#your-color',
    'button.borderRadius': { value: 8, unit: 'px' },
    // ... other settings
  }
}
```

### Custom Components

Add support for custom components:

```javascript
// src/theme-designer/data/customComponents.js
export const CustomComponentSettings = {
  'mycomponent.background': {
    id: 'mycomponent.background',
    type: 'color',
    label: 'Background Color',
    defaultValue: '#ffffff'
  }
}

export const CustomComponentDefinitions = {
  mycomponent: {
    id: 'mycomponent',
    name: 'My Component',
    group: 'custom',
    settings: Object.keys(CustomComponentSettings)
  }
}
```

### Environment Variables

Configure optional environment variables:

```bash
# .env
VITE_THEME_DESIGNER_DEBUG=false
VITE_THEME_DESIGNER_AUTO_SAVE=true
VITE_THEME_DESIGNER_STORAGE_KEY=primevue-theme
```

## Verification

### 1. Check Installation

Navigate to `/theme` in your application to verify the theme designer loads correctly.

### 2. Test Basic Functionality

1. Open the theme designer
2. Change a color setting
3. Verify the preview updates
4. Apply changes
5. Check that the main application theme updates

### 3. Test Import/Export

1. Export a theme
2. Modify some settings
3. Import the exported theme
4. Verify settings are restored

## Troubleshooting

### Common Issues

1. **Components not auto-importing**
   - Check `vite.config.js` configuration
   - Verify file paths in `dirs` array
   - Restart dev server

2. **Theme changes not applying**
   - Ensure PrimeVue is configured correctly
   - Check browser console for errors
   - Verify token mappings are correct

3. **Styles not loading**
   - Check Tailwind CSS configuration
   - Verify PrimeUI plugin is installed
   - Check CSS layer order

4. **TypeScript errors**
   - Run `npm run build` to generate type definitions
   - Check `auto-imports.d.ts` and `components.d.ts`

### Debug Mode

Enable debug mode for troubleshooting:

```javascript
// In browser console
localStorage.setItem('theme-designer-debug', 'true')
```

This will enable:
- Detailed console logging
- Performance metrics
- State change tracking
- Error details

## Performance Optimization

### 1. Lazy Loading

Load the theme designer only when needed:

```javascript
// Lazy load in router
{
  path: '/theme',
  component: () => import('@/views/Theme.vue')
}
```

### 2. Component Chunking

Split large components into separate chunks:

```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'theme-designer': ['src/theme-designer/index.js']
        }
      }
    }
  }
})
```

### 3. Reduce Bundle Size

Import only needed utilities:

```javascript
// Instead of importing everything
import * from '@/theme-designer'

// Import only what you need
import { ThemeDesigner, useThemeDesigner } from '@/theme-designer'
```

## Next Steps

After installation:

1. Read the [API Documentation](./docs/API.md)
2. Check out the [examples](./examples/)
3. Customize the theme designer for your needs
4. Add your own components and presets

## Support

For issues and questions:

1. Check the troubleshooting section above
2. Review the API documentation
3. Look at the example implementations
4. Check browser console for errors