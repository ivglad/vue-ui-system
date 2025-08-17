import js from "@eslint/js"
import pluginVue from "eslint-plugin-vue"
import prettier from "eslint-config-prettier"
import fs from "node:fs"
import path from "node:path"

// ESLint flat config for Vue 3.5+ with Prettier integration
// Rules are intentionally not too strict.
// попытка подхватить auto-import глобали, если включена генерация eslintrc от unplugin-auto-import
const autoImportEslintrcPath = path.resolve(process.cwd(), ".eslintrc-auto-import.json")
let autoImportGlobals = {}
try {
  if (fs.existsSync(autoImportEslintrcPath)) {
    const json = JSON.parse(fs.readFileSync(autoImportEslintrcPath, "utf-8"))
    autoImportGlobals = json.globals ?? {}
  }
} catch {}

export default [
  {
    ignores: [
      "dist/",
      "node_modules/",
      "coverage/",
      "vite-dist/",
      ".output/",
      ".nuxt/",
      // временно исключаем файл с демонстрацией шрифтов, содержащий нестандартную разметку
      "src/layouts/ui/LayoutUiFonts.vue",
    ],
  },
  js.configs.recommended,
  // Vue's recommended rules for Vue 3 with flat config
  ...pluginVue.configs["flat/recommended"],
  // Turn off rules that might conflict with Prettier
  prettier,
  // Общие настройки и смягчение правил
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      // General
      "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
      "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
      "no-empty": ["warn", { allowEmptyCatch: true }],
      "no-unused-vars": [
        "warn",
        {
          vars: "all",
          args: "none",
          ignoreRestSiblings: true,
          caughtErrors: "none",
          caughtErrorsIgnorePattern: ".*",
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
          // игнорировать элементы массивной деструктуризации, начинающиеся с _
          destructuredArrayIgnorePattern: "^_",
        },
      ],

      // Vue — сделать правила мягче под UI-библиотеки
      "vue/multi-word-component-names": "off",
      "vue/no-v-html": "off",
      "vue/no-useless-template-attributes": "off",
      "vue/attribute-hyphenation": "off",
      "vue/attributes-order": [
        "warn",
        {
          order: [
            "DEFINITION",
            "LIST_RENDERING",
            "CONDITIONALS",
            "RENDER_MODIFIERS",
            "GLOBAL",
            ["UNIQUE", "SLOT"],
            "TWO_WAY_BINDING",
            "OTHER_DIRECTIVES",
            "OTHER_ATTR",
            "EVENTS",
            "CONTENT",
          ],
          alphabetical: false,
        },
      ],
      "vue/v-on-event-hyphenation": "off",
      // игнорировать переменные в шаблоне, начинающиеся с _ (напр. v-slot)
      "vue/no-unused-vars": ["warn", { ignorePattern: "^_" }],
    },
  },
  // Файлы исходников (браузерное окружение, auto-import; отключаем no-undef как несовместимый с auto-import)
  {
    files: ["src/**/*.{js,ts,vue}"],
    languageOptions: {
      globals: {
        window: "readonly",
        document: "readonly",
        localStorage: "readonly",
        ...autoImportGlobals,
      },
    },
    rules: {
      "no-undef": "off",
    },
  },
  // Node окружение для конфигов и скриптов
  {
    files: ["vite.config.{js,ts}", "eslint.config.js"],
    languageOptions: {
      globals: {
        process: "readonly",
        __dirname: "readonly",
        module: "readonly",
      },
    },
  },
  // Финальные мягкие переопределения (применяются ко всем файлам)
  {
    rules: {
      "no-empty": ["warn", { allowEmptyCatch: true }],
      "no-unused-vars": [
        "warn",
        { varsIgnorePattern: "^_", argsIgnorePattern: "^_", ignoreRestSiblings: true },
      ],
    },
  },
  // Папка дизайна: отключаем предупреждения no-unused-vars, т.к. файлы содержат декларативные PT-каркасы
  {
    files: ["src/design/**/*.{js,ts,vue}"],
    rules: {
      "no-unused-vars": "off",
      "vue/no-unused-vars": "off",
    },
  },
  // Специально для файла конфигурации, чтобы не падать на служебных конструкциях
  {
    files: ["eslint.config.js"],
    rules: {
      "no-empty": "off",
      "no-unused-vars": "off",
    },
  },
]
