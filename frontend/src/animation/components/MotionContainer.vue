<script setup>
defineOptions({
  name: 'MotionContainer',
  inheritAttrs: false,
})

const props = defineProps({
  preset: { type: String, default: 'fadeIn' },
  // Явная задержка; если не задана — вычисляется из index/baseDelay/stepDelay
  delay: { type: Number, default: undefined },
  // Переопределения ключей initial/animate/exit/transition и пр.
  overrides: { type: Object, default: () => ({}) },
  // Семантический тег (например, h1, section, div и т.д.)
  tag: { type: String, default: 'div' },
  // Индекс элемента для стаггера (0,1,2,...)
  index: { type: Number, default: undefined },
  // Переопределение базовой задержки и шага для стаггера (если нужно)
  baseDelay: { type: Number, default: undefined },
  stepDelay: { type: Number, default: undefined },
  // Управление layout-анимациями (по умолчанию выключено для экономии ресурсов)
  layout: { type: Boolean, default: false },
  // Рендер без дополнительного DOM-обёртывания (Motion as-child)
  asChild: { type: Boolean, default: false },
  // Reveal при входе в зону видимости
  inView: { type: [Boolean, Object], default: false },
  inViewOptions: { type: Object, default: undefined },
  // Жесты (временные состояния)
  hover: { type: [Object, Boolean], default: false },
  press: { type: [Object, Boolean], default: false },

  // РЕЖИМ ЭЛЕМЕНТА СПИСКА: интеграция per-item presence и двухфазного enter
  item: { type: Boolean, default: false },
  // Включить обёртку AnimatePresence для текущего контейнера
  // false — выключено; true — 'wait' по умолчанию; строка — явный режим ('wait'|'sync'|'popLayout')
  presenceMode: { type: [Boolean, String], default: false },
  // Включить двухфазный reveal контента после layout (по умолчанию включено в item-режиме)
  reveal: { type: Boolean, default: undefined },
  // Пресет для внутреннего reveal
  enterPreset: { type: String, default: 'slideUp' },
  // Переопределение spring для layout-перехода внешнего контейнера
  transitionLayout: { type: Object, default: undefined },
  // Явная задержка для reveal; если не задана — layout + стаггер
  revealDelay: { type: Number, default: undefined },
})

// Вычисления вынесены в композабл для упрощения поддержки
const {
  presenceModeValue,
  outerMotionProps,
  revealEnabled,
  innerRevealOverrides,
} = useMotionContainerProps(props)
</script>

<template>
  <PresenceWrapper :mode="presenceModeValue">
    <MotionElement
      v-if="asChild"
      :tag="tag"
      :asChild="true"
      :layout="layout"
      :motionProps="outerMotionProps">
      <slot />
    </MotionElement>

    <MotionElement
      v-else
      :tag="tag"
      :layout="layout"
      :motionProps="outerMotionProps">
      <template v-if="item && revealEnabled && !asChild">
        <MotionContainer
          :preset="enterPreset"
          :overrides="innerRevealOverrides">
          <slot />
        </MotionContainer>
      </template>
      <template v-else>
        <slot />
      </template>
    </MotionElement>
  </PresenceWrapper>
</template>
