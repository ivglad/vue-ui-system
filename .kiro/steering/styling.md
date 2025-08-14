# Стилизация с Tailwind CSS 4

## Конфигурация

Проект использует Tailwind CSS 4 с интеграцией через `@tailwindcss/vite`:
- **CSS Layers**: Настроенные слои для правильного порядка стилей
- **Dark Mode**: Поддержка через класс `.dark-mode`
- **PrimeUI Integration**: Интеграция с PrimeVue через `tailwindcss-primeui`

## CSS Layers

Порядок слоев стилей:
```css
@layer reset, theme, base, default, preset, app;
```

- **reset**: Сброс стилей браузера
- **theme**: Переменные темы
- **base**: Базовые стили
- **default**: Стили по умолчанию
- **preset**: Стили пресетов (PrimeVue)
- **app**: Кастомные стили приложения

## SCSS интеграция

### Глобальные стили
```scss
// src/assets/styles/index.scss
@use 'reset';
@forward 'main';
@forward '@/assets/styles/fonts';
@forward '@/assets/styles/viewport';
```

### Препроцессор настройки
```javascript
// vite.config.js
css: {
  preprocessorOptions: {
    scss: {
      api: 'modern-compiler',
      additionalData: `@use '@/assets/styles/index' as *;`,
    },
  },
}
```

## Utility-First подход

### Основные принципы
- Используйте Tailwind классы для большинства стилей
- Избегайте кастомного CSS где возможно
- Группируйте повторяющиеся стили в компоненты

### Примеры использования
```vue
<template>
  <!-- Layout -->
  <div class="flex flex-col items-center justify-center h-screen">
    
    <!-- Typography -->
    <h1 class="text-2xl font-semibold mb-6">
      Заголовок
    </h1>
    
    <!-- Spacing и sizing -->
    <div class="w-full max-w-[350px] p-4 gap-5">
      
      <!-- Colors и borders -->
      <button class="bg-blue-500 text-white rounded-xl px-4 py-2 hover:bg-blue-600">
        Кнопка
      </button>
    </div>
  </div>
</template>
```

## Responsive Design

### Mobile-First подход
```vue
<template>
  <div class="
    w-full 
    sm:w-1/2 
    md:w-1/3 
    lg:w-1/4 
    xl:w-1/5
  ">
    Responsive контент
  </div>
</template>
```

### Breakpoints
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

## Dark Mode

### Активация
```javascript
// Переключение темы
document.documentElement.classList.toggle('dark-mode')
```

### Использование
```vue
<template>
  <div class="bg-white dark:bg-gray-900 text-black dark:text-white">
    Контент с поддержкой темной темы
  </div>
</template>
```

## Кастомные стили

### Scoped стили в компонентах
```vue
<template>
  <div class="custom-component">
    Контент
  </div>
</template>

<style scoped>
.custom-component {
  /* Кастомные стили только для этого компонента */
  @apply bg-blue-50 p-4 rounded-lg;
}
</style>
```

### Глобальные кастомные классы
```scss
// src/assets/styles/main.css
.app-container {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
}

.app-button-primary {
  @apply bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors;
}
```

## Viewport и адаптивность

### CSS переменные для viewport
```scss
// src/assets/styles/viewport.scss
:root {
  --viewport-height: 100vh;
}

// Поддержка мобильных браузеров
@supports (height: 100dvh) {
  :root {
    --viewport-height: 100dvh;
  }
}
```

### Использование
```vue
<template>
  <div class="min-h-[var(--viewport-height)]">
    Полная высота экрана
  </div>
</template>
```

## Производительность

### Purging неиспользуемых стилей
Tailwind автоматически удаляет неиспользуемые стили в продакшене.

### Рекомендации
- Используйте стандартные Tailwind классы
- Избегайте произвольных значений где возможно
- Группируйте повторяющиеся стили в компоненты
- Используйте `@apply` для сложных комбинаций классов

## Интеграция с компонентами

### PrimeVue стили
```vue
<template>
  <!-- Tailwind классы работают с PrimeVue -->
  <Button class="rounded-xl text-base h-[3.25rem] p-4" />
  <InputText class="rounded-xl text-base" />
</template>
```

### Кастомные компоненты
```vue
<template>
  <div class="app-card">
    <slot />
  </div>
</template>

<style scoped>
.app-card {
  @apply bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700;
}
</style>
```