# Анимации (motion-v)

В проекте используются утилиты VueUse и библиотека motion-v (motion) по умолчанию. Для удобства созданы два обёрточных компонента в `src/animation/components/`:

- `MotionContainer.vue` — анимированный элемент или as-child обёртка.
- `MotionGroup.vue` — анимированная группа с контекстом `AnimatePresence`/`LayoutGroup` и поддержкой стаггера.

Оба компонента поддерживают проброс нативных атрибутов и событий через `$attrs` (Vue 3 fallthrough). См. официальную документацию Vue по `$attrs` и `inheritAttrs`.

## MotionContainer

- __Основные пропсы__:
  - `preset: string` — имя пресета из вашей системы анимаций (`useMotionSystem()`). По умолчанию `fadeIn`.
  - `overrides: object` — переопределения ключей `initial/animate/exit/transition`.
  - `delay?: number` — явная задержка (если не указана, вычисляется из стаггера).
  - `index?: number` — индекс элемента для авто-стаггера.
  - `baseDelay?: number`, `stepDelay?: number` — ручные параметры стаггера.
  - `layout: boolean` — включает layout-анимации (по умолчанию `false`).
  - `asChild: boolean` — режим без лишнего DOM-обёртывания (использует `<Motion as-child>`).
  - `inView: boolean | object`, `inViewOptions?: object` — анимация при входе в зону видимости.
  - `hover?: object`, `press?: object` — жесты.

- __Проброс атрибутов__: все нативные атрибуты/классы/слушатели событий задаются прямо на компонент: `class`, `id`, `data-*`, `@click` и пр.

- __Пример__:
```vue
<MotionContainer
  preset="fadeIn"
  :index="idx"
  :layout="true"
  class="card shadow-md"
/>
```

- __As-child режим__:
```vue
<MotionContainer asChild preset="fadeIn" class="inline-block">
  <button class="btn">Click</button>
</MotionContainer>
```

## MotionGroup

Компонент-обёртка для контейнера, предоставляющий контекст анимаций группы и удобный стаггер.

- __Основные пропсы__:
  - `tag: string` — семантический тег корня (по умолчанию `div`).
  - `layout: boolean` — включает layout-анимации контейнера.
  - `preset?: string`, `overrides?: object` — анимация контейнера при необходимости.
  - `presence: boolean` — включает/отключает `AnimatePresence` внутри группы (по умолчанию `true`).
  - `layoutGroup: boolean` — включает/отключает `LayoutGroup` (по умолчанию `true`).
  - `baseDelay?: number`, `stepDelay?: number` — управление стаггером.
  - `stagger?: { base?: number; step?: number }` — объектная форма стаггера.

- __Слот API__ (scoped-slot `default`):
  - Передаются `delayOf(index)`, `baseDelay`, `stepDelay`.

- __Проброс атрибутов__: все нативные атрибуты и события (`class`, `style`, `id`, `@click` и т.д.) указываются прямо на `<MotionGroup ... />` и попадают на внутренний контейнер. Если вы передадите любые motion-ключи (`initial`, `animate`, `exit`, `transition`, `in-view`, `hover`, `press`), контейнер автоматически станет `motion[tag]`.

- __Пример__:
```vue
<MotionGroup class="flex flex-col gap-4" :layout="true">
  <template #default="{ delayOf }">
    <MotionContainer
      v-for="(item, idx) in items"
      :key="item.id"
      :delay="delayOf(idx)"
      preset="fadeIn"
      class="w-full"
    >
      <ItemCard :item="item" />
    </MotionContainer>
  </template>
</MotionGroup>
```

- __Пример с атрибутами motion прямо на группе__:
```vue
<MotionGroup
  class="grid gap-2"
  animate="{ opacity: 1 }"
  initial="{ opacity: 0 }"
  transition="{ duration: 0.3 }"
>
  <template #default="{ delayOf }">
    <!-- ... -->
  </template>
</MotionGroup>
```

## Стаггер

- Формула задержки: `delayOf(index) = baseDelay + index * stepDelay`.
- Источники значений:
  1) Явные пропсы `baseDelay/stepDelay`;
  2) `stagger.base/step` объектно;
  3) Глобальные значения из `useMotionSystem().STAGGER`.

- __Пример__: задать стаггер объектно
```vue
<MotionGroup :stagger="{ base: 0.1, step: 0.05 }">
  <template #default="{ delayOf }">
    <MotionContainer v-for="(n, i) in 5" :key="i" :delay="delayOf(i)" />
  </template>
</MotionGroup>
```

## Рекомендации и лучшие практики

- __Консистентность__: API `MotionContainer` и `MotionGroup` унифицирован — используйте `tag`, `layout`, `preset`, `overrides` и нативные атрибуты/события без специальных `container*` пропсов.
- __Пресеты сначала__: предпочитайте `preset` и точечные `overrides` вместо ручной декларации всех состояний.
- __Производительность__: включайте `layout` только там, где необходимы layout-анимации; используйте `presence=false`, когда выходные анимации не нужны.
- __Видимость__: для появления при скролле используйте `inView`/`inViewOptions` (motion-v). Дополнительно можно применять VueUse для утилит (debounce/throttle/обработчики событий и т.п.).

## Миграция (устаревшие пропсы)

- Было: `containerTag`, `containerClass`, `containerLayout`, `containerPreset`, `containerOverrides`.
- Стало: `tag`, `layout`, `preset`, `overrides`. Проп `containerClass` удалён — используйте обычный `class` на компоненте.

## Ссылки на документацию

- Vue: `$attrs` и fallthrough-атрибуты, `inheritAttrs` — см. официальную документацию Vue.
- VueUse: общий набор утилит для реактивности и браузерных API.
- motion-v: пресеты, in-view, жесты, layout-анимации — см. официальную документацию библиотеки.
