import DesignPlugin from '@/design'
import { VueQueryPlugin } from '@tanstack/vue-query'

const registerPlugins = (app) => {
  app.use(DesignPlugin())
  app.use(VueQueryPlugin)
}

export default registerPlugins
