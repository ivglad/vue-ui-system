// Хранилище дизайнера темы (Pinia)
// - Держит черновик настроек (draft)
// - Применяет изменения только по кнопке "Применить"
// - Сохраняет черновик в localStorage
// - Экспортирует/импортирует JSON, генерирует JS-конфиг (минимально: primary palette)

import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { updatePrimaryPalette, palette } from '@primeuix/themes'

// Константы по умолчанию
const DEFAULT_PRIMARY = '#6366f1' // indigo-500
const DEFAULT_SURFACE = '#ffffff'
const DEFAULT_RADIUS = 8 // px
const DEFAULT_FOCUS = '#60a5fa' // sky-400
const DEFAULT_INPUTTEXT_PADDING_X = 12 // px
const DEFAULT_INPUTTEXT_PADDING_Y = 8 // px
const DEFAULT_INPUTTEXT_BORDER_RADIUS = 8 // px
const DEFAULT_INPUTTEXT_FOCUS_RING_WIDTH = 2 // px

export const useThemeDesignerStore = defineStore('themeDesigner', () => {
  // Черновик — редактируется в Drawer, не влияет на UI, пока не нажата "Применить"
  const draft = useStorage('theme-designer-draft', {
    primary: DEFAULT_PRIMARY,
    surface: DEFAULT_SURFACE,
    radius: DEFAULT_RADIUS,
    focus: DEFAULT_FOCUS,
    forms: {
      inputtext: {
        paddingX: DEFAULT_INPUTTEXT_PADDING_X,
        paddingY: DEFAULT_INPUTTEXT_PADDING_Y,
        borderRadius: DEFAULT_INPUTTEXT_BORDER_RADIUS,
        focusRingWidth: DEFAULT_INPUTTEXT_FOCUS_RING_WIDTH,
      },
    },
  })

  // Применённые значения — текущее состояние темы приложения
  const applied = useStorage('theme-designer-applied', {
    primary: DEFAULT_PRIMARY,
    surface: DEFAULT_SURFACE,
    radius: DEFAULT_RADIUS,
    focus: DEFAULT_FOCUS,
    forms: {
      inputtext: {
        paddingX: DEFAULT_INPUTTEXT_PADDING_X,
        paddingY: DEFAULT_INPUTTEXT_PADDING_Y,
        borderRadius: DEFAULT_INPUTTEXT_BORDER_RADIUS,
        focusRingWidth: DEFAULT_INPUTTEXT_FOCUS_RING_WIDTH,
      },
    },
  })

  // Применяет черновик к теме (рантайм) и фиксирует как applied
  const applyPreview = () => {
    try {
      if (draft.value?.primary) {
        updatePrimaryPalette(palette(draft.value.primary))
      }
      // Фиксируем применённое состояние
      applied.value = { ...applied.value, ...draft.value }
    } catch (e) {
      console.error('Не удалось применить тему:', e)
    }
  }

  // Возврат черновика к применённым значениям
  const resetDraft = () => {
    draft.value = { ...applied.value }
  }

  // Экспорт настроек как JSON-строку
  const exportJson = () => {
    try {
      const data = { schema: { ...draft.value } }
      return JSON.stringify(data, null, 2)
    } catch (e) {
      console.error('Ошибка экспорта JSON:', e)
      return '{}'
    }
  }

  // Импорт настроек из JSON-строки (в черновик)
  const importJson = (jsonText) => {
    try {
      const obj = JSON.parse(jsonText)
      if (obj && obj.schema && typeof obj.schema === 'object') {
        draft.value = { ...draft.value, ...obj.schema }
        return true
      }
      return false
    } catch (e) {
      console.error('Ошибка импорта JSON:', e)
      return false
    }
  }

  // Генерация JS-конфига темы (минимальная версия с primary палитрой)
  // Примечание: здесь мы вычисляем палитру и встраиваем значения статически
  const exportJsModule = () => {
    try {
      const hex = draft.value?.primary || DEFAULT_PRIMARY
      const shades = palette(hex)
      // Преобразование набора оттенков в объект вида { 50: '#...', 100: '#...', ... }
      const primaryObj = Object.fromEntries(
        Object.entries(shades).map(([k, v]) => [k, v])
      )

      // Формируем токены для форм (InputText)
      const it = (draft.value?.forms && draft.value.forms.inputtext) || {}
      const padX = `${it.paddingX ?? DEFAULT_INPUTTEXT_PADDING_X}px`
      const padY = `${it.paddingY ?? DEFAULT_INPUTTEXT_PADDING_Y}px`
      const br = `${it.borderRadius ?? DEFAULT_INPUTTEXT_BORDER_RADIUS}px`
      const frw = `${it.focusRingWidth ?? DEFAULT_INPUTTEXT_FOCUS_RING_WIDTH}px`

      const js = `// Автогенерированный файл темы PrimeVue
import { definePreset } from '@primeuix/themes'
import Base from '@primeuix/themes/aura'

const MyPreset = definePreset(Base, {
  semantic: {
    primary: ${JSON.stringify(primaryObj, null, 2)}
  },
  components: {
    inputtext: {
      padding: { x: '${padX}', y: '${padY}' },
      border: { radius: '${br}' },
      focus: { ring: { width: '${frw}' } }
    }
  }
})

export default {
  preset: MyPreset,
  options: { darkModeSelector: '.dark-mode', cssLayer: { name: 'default', order: 'reset, theme, base, default, preset, app' } }
}
`
      return js
    } catch (e) {
      console.error('Ошибка экспорта JS:', e)
      return ''
    }
  }

  return {
    draft,
    applied,
    applyPreview,
    resetDraft,
    exportJson,
    importJson,
    exportJsModule,
  }
})
