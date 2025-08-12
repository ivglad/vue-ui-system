import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import Icons from 'unplugin-icons/vite'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import IconsResolver from 'unplugin-icons/resolver'
import { PrimeVueResolver } from '@primevue/auto-import-resolver'
import MotionResolver from 'motion-v/resolver'
import { VitePWA } from 'vite-plugin-pwa'

// Загрузка переменных окружения для активации PWA
const enablePWA = process.env.VITE_ENABLE_PWA === 'true'

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    watch: {
      // В Docker/WSL2 события FS могут теряться — включаем polling по env
      usePolling:
        process.env.CHOKIDAR_USEPOLLING === '1' ||
        process.env.CHOKIDAR_USEPOLLING === 'true',
      interval: process.env.CHOKIDAR_INTERVAL
        ? Number(process.env.CHOKIDAR_INTERVAL)
        : 100,
    },
  },
  plugins: [
    Vue(),
    tailwindcss(),
    Icons({
      defaultClass: 'icon',
      compiler: 'vue3',
      customCollections: {
        custom: FileSystemIconLoader('src/assets/svg/icons'),
      },
      iconCustomizer(collection, icon, props) {
        if (collection === 'custom') {
          props.class = `icon icon-${icon}`
          props.width = '1em'
          props.height = '1em'
        }
      },
      transform(svg, collection, icon) {
        if (collection === 'custom' && !icon.includes('-original')) {
          svg = svg.replace(/(fill|stroke)=".+"/g, '$1="currentColor"')
        }
        return svg
      },
    }),
    AutoImport({
      include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/],
      dirs: [
        'src/composables/**',
        'src/helpers/**',
        'src/stores/**',
        'src/utils/**',
      ],
      imports: [
        'vue',
        'vue-router',
        {
          '@vueuse/core': [
            'onClickOutside',
            'useDebounceFn',
          ],
          axios: [['default', 'axios']],
        },
        {
          zod: ['z'],
        },
      ],
      packagePresets: [
        'primevue',
        '@primevue/core/api',
        '@primevue/forms/resolvers/zod',
        '@tanstack/vue-query',
      ],
      vueTemplate: true,
      vueDirectives: undefined,
      viteOptimizeDeps: true,
      injectAtEnd: true,
      dts: true,
    }),
    Components({
      dirs: ['src'],
      deep: true,
      directives: true,
      resolvers: [
        IconsResolver({
          customCollections: ['custom'],
        }),
        PrimeVueResolver(),
        MotionResolver(),
      ],
      dts: true,
    }),
    ViteImageOptimizer(),
    // Активация PWA на основе переменной окружения VITE_ENABLE_PWA
    ...(enablePWA
      ? [
          VitePWA({
            registerType: 'autoUpdate',
            workbox: {
              cleanupOutdatedCaches: true,
              skipWaiting: true,
              globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
            },
            // PWA в режиме разработки
            devOptions: {
              enabled: process.env.VITE_ENABLE_PWA_DEV === 'true',
            },
          }),
        ]
      : []),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        additionalData: `@use '@/assets/styles/index' as *;`,
      },
    },
  },
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, 'src'),
      },
    ],
  },
})
