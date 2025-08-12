// Построитель пресета PrimeVue на базе токенов.
// ВАЖНО: этот файл описывает пресет (данные для PrimeVue), а не содержит компонентных CSS.

import Aura from '@primeuix/themes/aura'
import { definePreset } from '@primeuix/themes'
import { tokens as currentTokens } from '../tokens'

// Создание пресета из произвольного набора токенов
export function createPresetFromTokens(t = currentTokens) {
  return definePreset(Aura, {
    primitive: {
      extend: {
        app: {
          color: {
            primary: { ...t.color.primary },
            surface: {
              light: { ...t.color.surface.light },
              dark: { ...t.color.surface.dark },
            },
          },
          fontSize: t.typography.fontSize,
          fontSizeSm: t.typography.fontSizeSm,
          fontSizeLg: t.typography.fontSizeLg,
          fontFamily: t.typography.fontFamily,
        },
      },
    },
    borderRadius: {
      none: t.radius.none,
      xs: t.radius.xs,
      sm: t.radius.sm,
      md: t.radius.md,
      lg: t.radius.lg,
      xl: t.radius.xl,
      full: t.radius.full,
    },
    css: ({ dt }) => `
      :root{
        /* Базовые переменные приложения */
        --app-primary-50: ${dt('primary.50')};
        --app-primary-100: ${dt('primary.100')};
        --app-primary-200: ${dt('primary.200')};
        --app-primary-300: ${dt('primary.300')};
        --app-primary-400: ${dt('primary.400')};
        --app-primary-500: ${dt('primary.500')};
        --app-primary-600: ${dt('primary.600')};
        --app-primary-700: ${dt('primary.700')};
        --app-primary-800: ${dt('primary.800')};
        --app-primary-900: ${dt('primary.900')};

        --app-radius-none: ${dt('border.radius.none')};
        --app-radius-xs: ${dt('border.radius.xs')};
        --app-radius-sm: ${dt('border.radius.sm')};
        --app-radius-md: ${dt('border.radius.md')};
        --app-radius-lg: ${dt('border.radius.lg')};
        --app-radius-xl: ${dt('border.radius.xl')};
        --app-radius-full: ${dt('border.radius.full')};

        --app-font-family: ${dt('app.fontFamily')};
        --app-font-size: ${dt('app.fontSize')};
        --app-font-size-sm: ${dt('app.fontSizeSm')};
        --app-font-size-lg: ${dt('app.fontSizeLg')};
      }
    `,
  })
}

// Пресет по умолчанию на базе текущих токенов
const Preset = createPresetFromTokens(currentTokens)
export default Preset
