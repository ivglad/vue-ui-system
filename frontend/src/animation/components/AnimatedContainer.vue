<script setup>
import { motion } from 'motion-v'

const props = defineProps({
  preset: { type: String, default: 'fadeIn' },
  // Если delay не задан, он вычисляется из index/baseDelay/stepDelay
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
})

const { createAnimationProps, STAGGER } = useMotionSystem()
// Эффективная задержка: приоритет у явного delay, иначе считаем из index и дефолтов стаггера
const effectiveDelay = computed(() => {
  if (typeof props.delay === 'number') return props.delay
  const base =
    typeof props.baseDelay === 'number' ? props.baseDelay : STAGGER.base
  const step =
    typeof props.stepDelay === 'number' ? props.stepDelay : STAGGER.step
  const idx = typeof props.index === 'number' ? props.index : 0
  return base + idx * step
})

const motionProps = computed(() =>
  createAnimationProps(props.preset, props.overrides, effectiveDelay.value),
)
// Выбираем соответствующий motion-компонент по тегу; по умолчанию — motion.div
const motionTag = computed(() => motion?.[props.tag] ?? motion.div)
</script>

<template>
  <component :is="motionTag" v-bind="motionProps">
    <slot />
  </component>
</template>
