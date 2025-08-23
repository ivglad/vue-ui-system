<script setup>
// Тонкая обёртка над <Motion>: пресеты + минимальная логика задержки по глобальному шагу
import { STAGGER_STEP } from '../presets/constants.js'
import { getPresetByPath } from '../presets/index.js'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  /**
   * Preset animation name, path like 'element.*' | 'list.*' | 'page.*'
   * @type {string}
   * @default 'element.fade'
   */
  preset: {
    type: String,
    default: 'element.fade',
    validator: (v) => typeof v === 'string' && !!getPresetByPath(v),
  },
  /** Переопределения полей пресета (глубокий merge) */
  overrides: {
    type: Object,
    default: null,
    validator: (v) => v == null || (v && typeof v === 'object' && !Array.isArray(v)),
  },
  /** Порядок для задержки: delay = order * STAGGER_STEP */
  order: {
    type: Number,
    default: null,
    validator: (v) => v == null || (Number.isFinite(v) && v >= 0),
  },
})

const attrs = useAttrs()

// Возвращает пропсы Motion из пресета и overrides
const motionProps = computed(() => m(props.preset, props.overrides))

// Считает задержку по порядку с шагом STAGGER_STEP
const delay = computed(() => {
  if (props.order == null) return 0
  const o = Math.max(0, Number(props.order) || 0)
  return o * STAGGER_STEP
})

// Возвращает пропсы с добавленной задержкой
const withDelay = computed(() => {
  const base = { ...motionProps.value }
  if (delay.value > 0) {
    base.animate = base.animate || {}
    base.animate.transition = {
      ...(base.animate.transition || {}),
      delay: delay.value,
    }
  }
  return base
})

// Объединяет пропсы Motion с атрибутами компонента
const mergedProps = computed(() => ({ ...withDelay.value, ...attrs }))
</script>

<template>
  <Motion v-bind="mergedProps">
    <slot />
  </Motion>
</template>
