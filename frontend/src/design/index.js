import PrimeVue from 'primevue/config'
import Preset from './theme/preset'
import LocaleDefault from './locale/ru.json'
import ptDefault from './pt/index'
import './styles/preset.scss'
// Импорты сервисов и директив PrimeVue
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'
import DialogService from 'primevue/dialogservice'
// Импорты директив PrimeVue
import Tooltip from 'primevue/tooltip'
import KeyFilter from 'primevue/keyfilter'
import StyleClass from 'primevue/styleclass'
import AnimateOnScroll from 'primevue/animateonscroll'

// Опции темы PrimeVue
const optionsDefault = {
  darkModeSelector: '.dark-mode',
  cssLayer: {
    name: 'primevue',
    order: 'reset, theme, base, primevue',
  },
}

// Плагин дизайна на основе PrimeVue
export function DesignPlugin(userOptions = {}) {
  const {
    theme = { preset: Preset, options: optionsDefault },
    locale = LocaleDefault,
    pt = ptDefault,
    ripple = false,
  } = userOptions

  return {
    install(app) {
      app.use(PrimeVue, { theme, locale, pt, ripple })
      // Сервисы PrimeVue
      app.use(ToastService)
      app.use(ConfirmationService)
      app.use(DialogService)
      // Директивы PrimeVue
      app.directive('tooltip', Tooltip)
      app.directive('keyfilter', KeyFilter)
      app.directive('styleclass', StyleClass)
      app.directive('animateonscroll', AnimateOnScroll)
    },
  }
}

export default DesignPlugin

// Переэкспорт дефолтных зависимостей, если потребуется явная передача опций
export { Preset }
export const options = optionsDefault
export { LocaleDefault as Locale }
export { ptDefault as pt }
