<script setup>
// Глобальная конфигурация Motion для всего приложения
// - задаем дефолтный transition
// - учитываем reduced motion (по умолчанию: 'never')
const props = defineProps({
  /** Глобальный transition для MotionConfig */
  transition: {
    type: Object,
    default: null,
    validator: (v) => v == null || typeof v === 'object',
  },
  /** Политика reduced-motion: 'user' | 'always' | 'never' */
  reduced: {
    type: String,
    default: 'never',
    validator: (v) => ['user', 'always', 'never'].includes(v),
  },
})

// Возвращает эффективный transition (из пропа или дефолтный)
const effectiveTransition = computed(
  () => props.transition || { duration: 0.2 },
)
</script>

<template>
  <MotionConfig
    :transition="effectiveTransition"
    :reduced-motion="props.reduced">
    <slot />
  </MotionConfig>
</template>
