import path from 'node:path'
import { generatePrimeVuePTTypes } from '../tools/primevue-pt-types-generator.mjs'

// Дебаунс без внешних зависимостей
const debounce = (fn, wait) => {
  let t = null
  return (...args) => {
    clearTimeout(t)
    t = setTimeout(() => fn(...args), wait)
  }
}

const primevuePassThroughTypesPlugin = (options = {}) => {
  const {
    watchGlobs = ['node_modules/primevue/**/*.d.ts', '!**/style/**'],
    debounceMs = 5000,
    onceOnStart = true,
    outputFile = path.posix.join(
      'src',
      'design',
      'pt',
      'primevue-pt.schema.d.ts',
    ),
  } = options

  const run = async () => {
    try {
      const res = await generatePrimeVuePTTypes()
      // Тихий режим: не логируем «unchanged»
      if (res?.written) {
        console.log(`[primevue-pt] types updated -> ${outputFile}`)
      }
    } catch (e) {
      // Не прерываем dev-сервер из-за ошибок автогенерации типов
      console.warn('[primevue-pt] generation failed:', e?.message || e)
    }
  }

  const debouncedRun = debounce(run, debounceMs)

  return {
    name: 'vite-primevue-passthrough-types-plugin',
    apply: 'serve', // только в dev

    configResolved(config) {
      // Если нет нужной директории дизайна — выходим в no-op
      const expectedDir = path.resolve(config.root, 'src/design/pt')
      // Ленивая проверка наличия — плагин остается бесшумным
      this.__ptEnabled = true
      try {
        this.__ptEnabled = config.plugins && expectedDir && true
      } catch {
        this.__ptEnabled = false
      }
    },

    async configureServer(server) {
      if (!this.__ptEnabled) return

      if (onceOnStart) await run()

      // Наблюдаем только файлы типов PrimeVue
      try {
        for (const g of watchGlobs) server.watcher.add(g)
        const trigger = () => debouncedRun()
        server.watcher.on('add', trigger)
        server.watcher.on('change', trigger)
        server.watcher.on('unlink', trigger)
      } catch {}
    },

    // На случай сборки в CI — единоразовая генерация
    async buildStart() {
      try {
        await run()
      } catch {}
    },
  }
}

export default primevuePassThroughTypesPlugin
