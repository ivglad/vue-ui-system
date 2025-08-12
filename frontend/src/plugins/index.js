import { VueQueryPlugin } from '@tanstack/vue-query'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'
import DialogService from 'primevue/dialogservice'
import Tooltip from 'primevue/tooltip'
import KeyFilter from 'primevue/keyfilter'
import StyleClass from 'primevue/styleclass'
import AnimateOnScroll from 'primevue/animateonscroll'
import Preset from '@/styles/theme/presets/aura-brand.js'
import { useThemeStore } from '@/stores/theme'
import Locale from './primevue/locale.json'
import { watch } from 'vue'

const registerPlugins = (app, pinia) => {
  app.use(VueQueryPlugin)

  // Используем Pinia store (Composition API) для начальной конфигурации темы/PT
  const theme = useThemeStore(pinia)
  theme.init()

  app.use(PrimeVue, {
    theme: {
      preset: Preset,
      options: {
        darkModeSelector: '.dark-mode',
        cssLayer: {
          name: 'default',
          order: 'reset, theme, base, default, preset, app',
        },
      },
    },
    // Инициализируем PT из стора
    pt: theme.ptProfile.value,
    locale: Locale,
    ripple: false,
  })

  // Runtime-переключение PT при смене режима (tailwind/css)
  watch(theme.mode, () => {
    const primevue = app.config.globalProperties.$primevue
    if (primevue && primevue.config) {
      primevue.config.pt = theme.ptProfile.value
    }
  })
  app.use(ToastService)
  app.use(ConfirmationService)
  app.use(DialogService)
  app.directive('tooltip', Tooltip)
  app.directive('keyfilter', KeyFilter)
  app.directive('styleclass', StyleClass)
  app.directive('animateonscroll', AnimateOnScroll)
}

export default registerPlugins
