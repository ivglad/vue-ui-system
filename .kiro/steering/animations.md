# Система анимации с Motion-v

## Конфигурация

Motion-v интегрирован в проект через:
- **Auto Import**: Компоненты импортируются автоматически
- **Resolver**: `MotionResolver` в конфигурации Vite
- **Presets**: Предустановленные анимации в композаблах

## Основные компоненты

### motion.div
```vue
<script setup>
import { motion } from 'motion-v'
</script>

<template>
  <!-- Базовая анимация -->
  <motion.div
    :initial="{ opacity: 0, y: 20 }"
    :animate="{ opacity: 1, y: 0 }"
    :exit="{ opacity: 0, y: -20 }"
    :transition="{ duration: 0.3 }"
  >
    Анимированный контент
  </motion.div>
</template>
```

### AnimatePresence
```vue
<script setup>
import { AnimatePresence, motion } from 'motion-v'

const items = ref(['item1', 'item2', 'item3'])
</script>

<template>
  <AnimatePresence>
    <motion.div
      v-for="item in items"
      :key="item"
      :initial="{ opacity: 0, scale: 0.8 }"
      :animate="{ opacity: 1, scale: 1 }"
      :exit="{ opacity: 0, scale: 0.8 }"
      class="list-item"
    >
      {{ item }}
    </motion.div>
  </AnimatePresence>
</template>
```

## Предустановленные анимации

### Композабл useAnimationPresets
```javascript
// composables/animations/useAnimationPresets.js

export const ANIMATION_PRESETS = {
  // Базовые анимации
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 },
  },
  
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.25, ease: 'easeOut' },
  },
  
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  
  // Анимации для сообщений
  messageAppear: {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -10, scale: 0.95 },
    transition: {
      duration: 0.3,
      ease: 'easeOut',
      layout: { duration: 0.2 },
    },
  },
  
  // Анимации для страниц
  pageTransitionFade: {
    initial: { opacity: 0, scale: 0.95, filter: 'blur(4px)' },
    animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, scale: 0.95, filter: 'blur(4px)' },
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}
```

### Использование пресетов
```vue
<script setup>
const { createAnimationProps } = useAnimationPresets()

const animationProps = computed(() => {
  return createAnimationProps('fadeIn', { duration: 0.5 }, 0.1)
})
</script>

<template>
  <motion.div v-bind="animationProps">
    Контент с анимацией
  </motion.div>
</template>
```

## Компонент AnimatedContainer

### Базовое использование
```vue
<script setup>
// AnimatedContainer автоматически импортируется
</script>

<template>
  <AnimatedContainer 
    preset="slideUp" 
    :delay="0.1"
    container-class="p-4 bg-white rounded-lg"
  >
    <h2>Заголовок</h2>
    <p>Контент с анимацией</p>
  </AnimatedContainer>
</template>
```

### Кастомные переопределения
```vue
<template>
  <AnimatedContainer 
    preset="fadeIn"
    :overrides="{ 
      transition: { duration: 0.5, ease: 'easeInOut' },
      animate: { opacity: 1, scale: 1.05 }
    }"
  >
    Контент с кастомной анимацией
  </AnimatedContainer>
</template>
```

## Анимации переходов страниц

### В App.vue
```vue
<script setup>
import { AnimatePresence, motion } from 'motion-v'

const router = useRouter()
const transitionType = ref('fade')

router.beforeEach((to, from) => {
  if (from.path === '/auth' && to.path === '/chat') {
    transitionType.value = 'auth-to-chat'
  } else if (from.path === '/chat' && to.path === '/auth') {
    transitionType.value = 'chat-to-auth'
  } else {
    transitionType.value = 'fade'
  }
})
</script>

<template>
  <main>
    <router-view v-slot="{ Component, route }">
      <AnimatePresence mode="wait">
        <motion.div
          :key="route.path"
          class="w-full h-full overflow-hidden"
        >
          <component :is="Component" />
        </motion.div>
      </AnimatePresence>
    </router-view>
  </main>
</template>
```

### Композабл для переходов страниц
```javascript
// composables/usePageTransition.js

export const usePageTransition = (options = {}) => {
  const {
    staggerDelay = 0.1,
    enterDuration = 0.3,
    enterDelay = 0.2,
  } = options

  const getElementAnimationProps = (index) => {
    return {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: {
        duration: enterDuration,
        delay: enterDelay + (index * staggerDelay),
        ease: 'easeOut',
      },
    }
  }

  return {
    getElementAnimationProps,
  }
}
```

### Использование в компонентах
```vue
<script setup>
const { getElementAnimationProps } = usePageTransition({
  staggerDelay: 0.1,
  enterDuration: 0.3,
  enterDelay: 0.2,
})
</script>

<template>
  <div class="page-container">
    <motion.h1 v-bind="getElementAnimationProps(0)">
      Заголовок
    </motion.h1>
    
    <motion.div v-bind="getElementAnimationProps(1)">
      Первый блок
    </motion.div>
    
    <motion.div v-bind="getElementAnimationProps(2)">
      Второй блок
    </motion.div>
  </div>
</template>
```

## Анимации списков

### Staggered анимации
```vue
<script setup>
const items = ref(['Item 1', 'Item 2', 'Item 3'])

const containerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, ease: 'easeOut' },
}
</script>

<template>
  <motion.div :variants="containerVariants" animate="animate">
    <AnimatePresence>
      <motion.div
        v-for="item in items"
        :key="item"
        :variants="itemVariants"
        class="list-item"
      >
        {{ item }}
      </motion.div>
    </AnimatePresence>
  </motion.div>
</template>
```

## Layout анимации

### Автоматические layout анимации
```vue
<template>
  <motion.div
    layout
    :transition="{ duration: 0.3, ease: 'easeOut' }"
    class="flexible-container"
  >
    <motion.div
      v-for="item in items"
      :key="item.id"
      layout
      class="item"
    >
      {{ item.content }}
    </motion.div>
  </motion.div>
</template>
```

## Константы и настройки

### Timing константы
```javascript
export const ANIMATION_TIMING = {
  fast: 0.15,
  normal: 0.25,
  slow: 0.4,
  delays: {
    short: 0.05,
    medium: 0.1,
    long: 0.2,
  },
}
```

### Easing функции
```javascript
export const EASING = {
  easeOut: 'easeOut',
  easeIn: 'easeIn',
  easeInOut: 'easeInOut',
  smooth: [0.25, 0.1, 0.25, 1],
  snappy: [0.4, 0, 0.2, 1],
  gentle: [0.25, 0.46, 0.45, 0.94],
}
```

## Рекомендации

### 1. Производительность
- Используйте `transform` и `opacity` для анимаций
- Избегайте анимации `width`, `height`, `top`, `left`
- Используйте `will-change` для сложных анимаций

### 2. UX принципы
- Быстрые анимации для мелких элементов (0.15s)
- Стандартные анимации для большинства случаев (0.25s)
- Медленные анимации для крупных переходов (0.4s)

### 3. Доступность
- Учитывайте `prefers-reduced-motion`
- Предоставляйте возможность отключения анимаций
- Не используйте мигающие анимации

### 4. Паттерны
- Используйте предустановленные анимации
- Группируйте связанные анимации в композаблы
- Создавайте переиспользуемые компоненты для сложных анимаций

### 5. Отладка
- Используйте Vue DevTools для отслеживания анимаций
- Тестируйте на разных устройствах и браузерах
- Проверяйте производительность с помощью DevTools