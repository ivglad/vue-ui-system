// Схема токенов темы и утилиты валидации/миграции
// ВАЖНО: это не стили, а данные. Стили находятся в CSS/SCSS или пресете PrimeVue.

export const SCHEMA_VERSION = 1

// Базовые значения по умолчанию (минимальный набор для каркаса)
export const defaultTokens = {
  version: SCHEMA_VERSION,
  color: {
    primary: {
      50: '#eef2ff',
      100: '#e0e7ff',
      200: '#c7d2fe',
      300: '#a5b4fc',
      400: '#818cf8',
      500: '#6366f1',
      600: '#4f46e5',
      700: '#4338ca',
      800: '#3730a3',
      900: '#312e81',
      contrast: '#ffffff',
      emphasis: '#4f46e5',
    },
    surface: {
      light: {
        0: '#ffffff',
        50: '#f9fafb',
        100: '#f3f4f6',
        200: '#e5e7eb',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937',
        900: '#111827',
      },
      dark: {
        0: '#0b0f19',
        50: '#0f172a',
        100: '#111827',
        200: '#1f2937',
        300: '#374151',
        400: '#4b5563',
        500: '#6b7280',
        600: '#9ca3af',
        700: '#d1d5db',
        800: '#e5e7eb',
        900: '#f3f4f6',
      },
    },
  },
  radius: {
    none: '0',
    xs: '0.125rem',
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },
  typography: {
    fontSize: '1rem',
    fontSizeSm: '0.875rem',
    fontSizeLg: '1.125rem',
    lineHeight: '1.5',
    fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", "Helvetica Neue", Arial, "Apple Color Emoji", "Segoe UI Emoji"',
  },
  density: {
    scale: 1,
  },
}

export function validateTokens(tokens) {
  const errors = []
  if (!tokens || typeof tokens !== 'object') {
    return { valid: false, errors: ['Tokens must be an object'], tokens: defaultTokens }
  }
  if (tokens.version != null && tokens.version !== SCHEMA_VERSION) {
    // Версия отличается — миграция выполнится отдельно
  }
  // Проверка наличия основных веток
  if (!tokens.color?.primary?.[500]) errors.push('color.primary.500 is required')
  if (!tokens.color?.surface?.light?.[0]) errors.push('color.surface.light.0 is required')
  if (!tokens.color?.surface?.dark?.[0]) errors.push('color.surface.dark.0 is required')

  return { valid: errors.length === 0, errors, tokens }
}

export function migrateTokens(tokens) {
  // На будущее: преобразование старых версий токенов в новую схему
  // Пока просто возвращаем то, что пришло
  return { ...tokens, version: SCHEMA_VERSION }
}
