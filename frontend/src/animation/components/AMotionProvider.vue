<script setup>
// Глобальная конфигурация Motion для всего приложения
// - задаем дефолтный transition
// - учитываем reduced motion (по умолчанию: 'never')
const props = defineProps({
  transition: { type: Object, default: null },
  // 'user' | 'always' | 'never'
  reduced: { type: String, default: 'never' },
})

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
