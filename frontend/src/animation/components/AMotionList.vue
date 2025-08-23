<script setup>
// Контролируемая обёртка для списков: LayoutGroup + контейнер Motion
import { STAGGER_STEP } from '../presets/constants.js'
import { getPresetByPath } from '../presets/index.js'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  /** Имя пресета списка: путь вида 'list.*' */
  preset: {
    type: String,
    default: 'list.spring',
    validator: (v) => typeof v === 'string' && !!getPresetByPath(v),
  },
  /** Переопределения полей пресета контейнера */
  overrides: {
    type: Object,
    default: null,
    validator: (v) =>
      v == null || (v && typeof v === 'object' && !Array.isArray(v)),
  },
  /** Включать ли AnimatePresence-обёртку */
  presence: { type: Boolean, default: true },
  /** Режим AnimatePresence: 'sync' | 'wait' | 'popLayout' */
  presenceMode: {
    type: String,
    default: 'sync',
    validator: (v) => ['sync', 'wait', 'popLayout'].includes(v),
  },
})

const attrs = useAttrs()
// Возвращает пропсы контейнера списка из пресета
const groupProps = computed(() => m(props.preset, props.overrides))

// Добавляем глобальный стаггер дочерних элементов
// Возвращает пропсы с добавленным staggerChildren
const mergedProps = computed(() => {
  const base = { ...groupProps.value, ...attrs }
  base.transition = {
    ...(base.transition || {}),
    staggerChildren: STAGGER_STEP,
  }
  return base
})
</script>

<template>
  <LayoutGroup>
    <Motion v-bind="mergedProps">
      <template v-if="props.presence">
        <AnimatePresence :mode="props.presenceMode">
          <slot />
        </AnimatePresence>
      </template>
      <template v-else>
        <slot />
      </template>
    </Motion>
  </LayoutGroup>
</template>
