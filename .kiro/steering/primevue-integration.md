# Интеграция PrimeVue с Tailwind CSS 4

## Конфигурация

### PrimeVue настройка
```javascript
// src/plugins/index.js
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: '.dark-mode',
      cssLayer: {
        name: 'default',
        order: 'reset, theme, base, default, preset, app',
      },
    },
  },
  locale: Locale,
  ripple: false,
})
```

### Tailwind интеграция
```javascript
// package.json dependencies
"tailwindcss-primeui": "^0.6.1"
```

## CSS Layers порядок

Правильный порядок слоев для корректной работы:
1. **reset** - Сброс стилей
2. **theme** - Переменные темы PrimeVue
3. **base** - Базовые стили
4. **default** - Стили по умолчанию
5. **preset** - Стили компонентов PrimeVue
6. **app** - Кастомные стили приложения

## Темизация

### Aura Theme
- Современная тема PrimeVue по умолчанию
- Поддержка темной темы через `.dark-mode`
- Интеграция с Tailwind цветовой палитрой

### Dark Mode
```javascript
// Переключение темы
document.documentElement.classList.toggle('dark-mode')
```

### Кастомизация компонентов
```vue
<template>
  <!-- Использование pt (passthrough) для кастомизации -->
  <Button 
    pt:root:class="custom-button-styles"
    class="rounded-xl text-base"
  />
  
  <!-- Кастомизация через Tailwind классы -->
  <InputText class="rounded-xl text-base border-gray-300" />
</template>
```

## Компоненты и стили

### Формы
```vue
<template>
  <FloatLabel class="app-input text-base">
    <InputText
      id="email"
      :invalid="hasError"
      fluid
      class="rounded-xl text-base"
    />
    <label for="email">Email</label>
  </FloatLabel>
</template>

<style scoped>
.app-input {
  @apply w-full;
}
</style>
```

### Кнопки
```vue
<template>
  <!-- Стандартная кнопка с Tailwind стилями -->
  <Button
    class="w-fit h-[3.25rem] p-4 rounded-xl text-base"
    type="submit"
    label="Отправить"
    :disabled="isLoading"
  />
  
  <!-- Кнопка с вариантами -->
  <Button
    variant="text"
    size="small"
    severity="secondary"
    rounded
  />
</template>
```

### Сообщения и уведомления
```vue
<template>
  <Toast>
    <template #closeicon>
      <i-custom-cross />
    </template>
    <template #container="{ message, closeCallback }">
      <div class="app-toast p-toast-message-content">
        <div v-if="message.summary" class="app-toast-summary">
          <span class="p-toast-summary fw-bold">{{ message.summary }}</span>
          <Button
            class="app-toast-close-button"
            variant="text"
            size="small"
            severity="secondary"
            rounded
            @click="closeCallback"
          />
        </div>
      </div>
    </template>
  </Toast>
</template>
```

### Диалоги
```vue
<template>
  <!-- Кастомизация через pt -->
  <ConfirmDialog 
    group="confirm" 
    pt:root:class="app-confirm-modified" 
  />
  
  <ConfirmDialog
    group="confirm-secondary"
    pt:root:class="app-confirm-secondary"
  />
</template>
```

## Директивы

### Tooltip
```vue
<template>
  <InputText
    v-tooltip.top="{
      value: errorMessage,
      showDelay: 500,
    }"
    :invalid="hasError"
  />
</template>
```

### Другие директивы
```javascript
// Регистрация в plugins/index.js
app.directive('tooltip', Tooltip)
app.directive('keyfilter', KeyFilter)
app.directive('styleclass', StyleClass)
app.directive('animateonscroll', AnimateOnScroll)
```

## Сервисы

### Toast Service
```javascript
// В компоненте
const toast = useToast()

toast.add({
  severity: 'error',
  summary: 'Ошибка',
  detail: 'Описание ошибки',
  life: 5000,
})
```

### Confirmation Service
```javascript
const confirm = useConfirm()

confirm.require({
  message: 'Вы уверены?',
  header: 'Подтверждение',
  icon: 'pi pi-exclamation-triangle',
  accept: () => {
    // Действие при подтверждении
  }
})
```

### Dialog Service
```javascript
const dialog = useDialog()

dialog.open(ComponentName, {
  props: {
    header: 'Заголовок',
    style: {
      width: '50vw',
    },
  },
  data: {
    // Данные для компонента
  }
})
```

## Локализация

### Настройка локали
```javascript
// src/plugins/primevue/locale.json
{
  "startsWith": "Начинается с",
  "contains": "Содержит",
  "notContains": "Не содержит",
  // ... другие переводы
}
```

### Использование
```vue
<template>
  <!-- Компоненты автоматически используют локализацию -->
  <Calendar locale="ru" />
  <DataTable :value="data">
    <!-- Фильтры и пагинация будут на русском -->
  </DataTable>
</template>
```

## Производительность

### Отключение Ripple
```javascript
// В конфигурации PrimeVue
ripple: false
```

### Оптимизация импортов
Компоненты импортируются автоматически только при использовании благодаря `@primevue/auto-import-resolver`.

## Рекомендации

### 1. Комбинирование стилей
```vue
<template>
  <!-- PrimeVue классы + Tailwind -->
  <Button class="p-button-rounded bg-blue-500 hover:bg-blue-600" />
</template>
```

### 2. Кастомизация через CSS переменные
```css
:root {
  --p-primary-color: theme('colors.blue.500');
  --p-primary-color-hover: theme('colors.blue.600');
}
```

### 3. Использование pt (passthrough)
```vue
<template>
  <DataTable
    :value="data"
    pt:table:class="border-collapse border border-gray-300"
    pt:header:class="bg-gray-50"
  />
</template>
```