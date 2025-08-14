# Технологии и фреймворки

## Основной стек

### Vue 3 (^3.5.18)
- **Composition API**: Основной подход для написания компонентов
- **Script Setup**: Предпочтительный синтаксис для SFC
- **Reactivity**: Используйте ref() для примитивов, reactive() для объектов

### Vite (^7.1.2)
- **Dev Server**: Быстрая разработка с HMR
- **Build**: Оптимизированная сборка для продакшена
- **Plugins**: Расширенная функциональность через плагины

### Pinia (^3.0.3)
- **State Management**: Современная замена Vuex
- **Composition API**: Стиль написания хранилищ
- **DevTools**: Интеграция с Vue DevTools
- **HMR**: Поддержка горячей перезагрузки

## UI и стилизация

### Tailwind CSS 4 (^4.1.11)
- **Utility-First**: Основной подход к стилизации
- **CSS Layer**: Настроенные слои для правильного порядка стилей
- **Responsive**: Mobile-first подход
- **Dark Mode**: Поддержка темной темы через .dark-mode класс

### PrimeVue 4 (^4.3.7)
- **Component Library**: Богатый набор UI компонентов
- **Aura Theme**: Современная тема по умолчанию
- **Auto Import**: Автоматический импорт компонентов
- **Accessibility**: Встроенная поддержка доступности

### SCSS
- **Preprocessor**: Для сложных стилей и миксинов
- **Global Styles**: Базовые стили и переменные
- **Component Styles**: Scoped стили в компонентах

## Анимации и интерактивность

### Motion-v (^1.7.0)
- **Declarative Animations**: Декларативный подход к анимациям
- **Vue Integration**: Нативная интеграция с Vue
- **Performance**: Оптимизированные анимации
- **Presets**: Предустановленные анимации

## Валидация и формы

### Zod (^4.0.17)
- **Schema Validation**: Типобезопасная валидация
- **Form Integration**: Интеграция с PrimeVue Forms
- **TypeScript**: Автоматическая генерация типов

### PrimeVue Forms (^4.3.7)
- **Form Management**: Управление состоянием форм
- **Validation**: Интеграция с Zod
- **Field Components**: Готовые поля форм

## HTTP и состояние

### Axios (^1.11.0)
- **HTTP Client**: Для API запросов
- **Interceptors**: Обработка запросов и ответов
- **Error Handling**: Централизованная обработка ошибок

### TanStack Vue Query (^5.83.1)
- **Server State**: Управление серверным состоянием
- **Caching**: Кэширование запросов
- **Background Updates**: Фоновые обновления данных
- **Optimistic Updates**: Оптимистичные обновления

## Утилиты

### VueUse (^13.6.0)
- **Composition Utilities**: Набор композабл функций
- **Browser APIs**: Обертки для браузерных API
- **Reactive**: Реактивные утилиты

## Сборка и оптимизация

### Плагины Vite
- **unplugin-auto-import**: Автоматический импорт функций
- **unplugin-vue-components**: Автоматический импорт компонентов
- **unplugin-icons**: Система иконок
- **vite-plugin-image-optimizer**: Оптимизация изображений
- **vite-plugin-pwa**: PWA функциональность

## Версии Node.js
- **Минимальная версия**: Node.js >= 20
- **Рекомендуемая**: Последняя LTS версия