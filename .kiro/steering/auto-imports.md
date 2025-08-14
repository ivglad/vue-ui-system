# Система автоимпорта

## Конфигурация

Автоимпорт настроен через плагины Vite и охватывает:
- Vue API функции
- Композаблы и утилиты
- PrimeVue компоненты
- Motion-v компоненты
- Кастомные иконки

## Auto Import функций

### Vue API
Все основные Vue функции доступны глобально:
```javascript
// Доступно без импорта
const count = ref(0)
const doubled = computed(() => count.value * 2)
const router = useRouter()
const route = useRoute()
```

### Композаблы и утилиты
Автоматически импортируются из директорий:
- `src/composables/**`
- `src/helpers/**`
- `src/stores/**`
- `src/utils/**`

```javascript
// Доступно без импорта
const userStore = useUserStore()
const { data } = useApiQuery()
const formattedDate = formatDate(new Date())
```

### Внешние библиотеки
```javascript
// VueUse
const { onClickOutside, useDebounceFn } = // автоимпорт

// Axios
axios.get('/api/data') // доступен глобально

// Zod
const schema = z.object({ name: z.string() })

// TanStack Query
const { data, isLoading } = useQuery(...)
```

## Auto Import компонентов

### PrimeVue компоненты
Все PrimeVue компоненты импортируются автоматически:
```vue
<template>
  <!-- Без импорта -->
  <Button label="Click me" />
  <InputText v-model="value" />
  <DataTable :value="data" />
</template>
```

### Motion-v компоненты
```vue
<template>
  <!-- Без импорта -->
  <motion.div :initial="{ opacity: 0 }">
    Content
  </motion.div>
  <AnimatePresence>
    <motion.div v-if="show">Animated content</motion.div>
  </AnimatePresence>
</template>
```

### Кастомные компоненты
Компоненты из `src/components/` импортируются автоматически:
```vue
<template>
  <!-- Без импорта -->
  <AnimatedContainer preset="fadeIn">
    <UserProfile :user="user" />
  </AnimatedContainer>
</template>
```

## Система иконок

### Кастомные иконки
Иконки из `src/assets/svg/icons/` доступны с префиксом `i-custom-`:
```vue
<template>
  <!-- Без импорта -->
  <i-custom-menu />
  <i-custom-cross />
  <i-custom-send />
</template>
```

### Конфигурация иконок
- **Класс по умолчанию**: `icon`
- **Размер**: `1em` (наследует от родителя)
- **Цвет**: `currentColor` (кроме иконок с суффиксом `-original`)

## Правила использования

### 1. Именование файлов
- Композаблы: `useFeatureName.js`
- Утилиты: `featureName.js`
- Компоненты: `ComponentName.vue`

### 2. Экспорт функций
```javascript
// composables/useUserData.js
export const useUserData = () => {
  // логика
}

// utils/formatters.js
export const formatDate = (date) => {
  // логика
}
```

### 3. Типы TypeScript
Типы генерируются автоматически в:
- `auto-imports.d.ts` - для функций
- `components.d.ts` - для компонентов

### 4. Отключение автоимпорта
Если нужен явный импорт:
```javascript
// Используйте комментарий для отключения
/* eslint-disable-next-line */
import { ref } from 'vue'
```

## Производительность

### Оптимизация сборки
- **Tree Shaking**: Неиспользуемые импорты исключаются
- **Code Splitting**: Автоматическое разделение кода
- **Vite Optimize Deps**: Оптимизация зависимостей

### Рекомендации
- Используйте автоимпорт для всех доступных функций
- Избегайте дублирования импортов
- Группируйте связанную логику в композаблы