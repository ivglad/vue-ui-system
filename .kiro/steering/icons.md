# Система иконок и конфигурация Vite

## Конфигурация unplugin-icons

### Настройка в vite.config.js
```javascript
import Icons from 'unplugin-icons/vite'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import IconsResolver from 'unplugin-icons/resolver'

export default defineConfig({
  plugins: [
    // Конфигурация Icons плагина
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
    
    // Резолвер для автоимпорта
    Components({
      resolvers: [
        IconsResolver({
          customCollections: ['custom'],
        }),
      ],
    }),
  ],
})
```

## Структура иконок

### Директория иконок
```
src/assets/svg/icons/
├── cross.svg
├── doc.svg
├── eye-close.svg
├── eye.svg
├── filter.svg
├── menu.svg
├── moon.svg
├── plus.svg
├── robot-original.svg
├── send.svg
└── sun.svg
```

### Формат SVG файлов
```xml
<!-- Стандартная иконка (будет обработана) -->
<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path fill="#000000" d="M12 2L2 7v10c0 5.55 3.84 9.95 9 11 5.16-1.05 9-5.45 9-11V7l-10-5z"/>
</svg>

<!-- Оригинальная иконка (не будет обработана) -->
<!-- Файл: robot-original.svg -->
<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path fill="#ff6b6b" d="..."/>
  <path fill="#4ecdc4" d="..."/>
</svg>
```

## Использование иконок

### Автоматический импорт
```vue
<template>
  <!-- Кастомные иконки с префиксом i-custom- -->
  <i-custom-menu />
  <i-custom-cross />
  <i-custom-send />
  <i-custom-eye />
  <i-custom-eye-close />
  
  <!-- Оригинальные иконки (сохраняют цвета) -->
  <i-custom-robot-original />
</template>
```

### С классами и стилями
```vue
<template>
  <!-- Размер через CSS -->
  <i-custom-menu class="w-6 h-6" />
  
  <!-- Цвет через currentColor -->
  <i-custom-cross class="text-red-500" />
  
  <!-- Комбинирование стилей -->
  <i-custom-send class="w-4 h-4 text-blue-600 hover:text-blue-800" />
</template>
```

### В PrimeVue компонентах
```vue
<template>
  <!-- В кнопках -->
  <Button>
    <template #icon>
      <i-custom-plus />
    </template>
    Добавить
  </Button>
  
  <!-- В Toast -->
  <Toast>
    <template #closeicon>
      <i-custom-cross />
    </template>
  </Toast>
  
  <!-- В меню -->
  <Menu>
    <template #item="{ item }">
      <i-custom-menu class="mr-2" />
      {{ item.label }}
    </template>
  </Menu>
</template>
```

## Обработка иконок

### Автоматическая замена цветов
```javascript
// В vite.config.js
transform(svg, collection, icon) {
  if (collection === 'custom' && !icon.includes('-original')) {
    // Заменяем fill и stroke на currentColor
    svg = svg.replace(/(fill|stroke)=".+"/g, '$1="currentColor"')
  }
  return svg
}
```

### Кастомизация свойств
```javascript
iconCustomizer(collection, icon, props) {
  if (collection === 'custom') {
    props.class = `icon icon-${icon}`
    props.width = '1em'
    props.height = '1em'
  }
}
```

## CSS стили для иконок

### Базовые стили
```css
.icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  vertical-align: middle;
  fill: currentColor;
  stroke: currentColor;
}
```

### Утилитарные классы
```vue
<template>
  <!-- Размеры -->
  <i-custom-menu class="icon-sm" />   <!-- 16px -->
  <i-custom-menu class="icon-md" />   <!-- 20px -->
  <i-custom-menu class="icon-lg" />   <!-- 24px -->
  <i-custom-menu class="icon-xl" />   <!-- 32px -->
  
  <!-- Состояния -->
  <i-custom-menu class="icon-interactive" />  <!-- hover эффекты -->
  <i-custom-menu class="icon-disabled" />     <!-- отключенное состояние -->
</template>

<style>
.icon-sm { width: 1rem; height: 1rem; }
.icon-md { width: 1.25rem; height: 1.25rem; }
.icon-lg { width: 1.5rem; height: 1.5rem; }
.icon-xl { width: 2rem; height: 2rem; }

.icon-interactive {
  @apply transition-colors duration-200 hover:opacity-80 cursor-pointer;
}

.icon-disabled {
  @apply opacity-50 cursor-not-allowed;
}
</style>
```

## Анимированные иконки

### CSS анимации
```vue
<template>
  <i-custom-menu class="icon-spin" />
  <i-custom-send class="icon-bounce" />
</template>

<style>
.icon-spin {
  animation: spin 1s linear infinite;
}

.icon-bounce {
  animation: bounce 0.5s ease-in-out;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}
</style>
```

### Motion-v анимации
```vue
<script setup>
import { motion } from 'motion-v'
</script>

<template>
  <motion.div
    :animate="{ rotate: isLoading ? 360 : 0 }"
    :transition="{ duration: 1, repeat: isLoading ? Infinity : 0 }"
  >
    <i-custom-menu />
  </motion.div>
</template>
```

## Оптимизация

### SVGO конфигурация
```javascript
// package.json
{
  "devDependencies": {
    "svgo": "^4.0.0"
  }
}
```

### Оптимизация SVG файлов
```bash
# Оптимизация всех иконок
npx svgo src/assets/svg/icons/*.svg

# С кастомной конфигурацией
npx svgo --config svgo.config.js src/assets/svg/icons/*.svg
```

### svgo.config.js
```javascript
export default {
  plugins: [
    'preset-default',
    {
      name: 'removeViewBox',
      active: false,
    },
    {
      name: 'removeDimensions',
      active: true,
    },
  ],
}
```

## Рекомендации

### 1. Именование файлов
- Используйте kebab-case: `menu-icon.svg`
- Добавляйте `-original` для иконок с фиксированными цветами
- Группируйте по функциональности: `nav-menu.svg`, `nav-close.svg`

### 2. Размеры и viewBox
- Используйте стандартные размеры: 16x16, 20x20, 24x24
- Всегда указывайте viewBox
- Оптимизируйте пути для минимального размера

### 3. Цвета
- Используйте `currentColor` для адаптивных иконок
- Сохраняйте оригинальные цвета только для брендинговых иконок
- Тестируйте в светлой и темной темах

### 4. Производительность
- Оптимизируйте SVG файлы перед добавлением
- Используйте спрайты для часто используемых иконок
- Ленивая загрузка для больших коллекций

### 5. Доступность
- Добавляйте `aria-label` для интерактивных иконок
- Используйте `aria-hidden="true"` для декоративных иконок
- Предоставляйте текстовые альтернативы

### 6. Консистентность
- Поддерживайте единый стиль линий и заливки
- Используйте одинаковую толщину обводки
- Выравнивайте иконки по сетке