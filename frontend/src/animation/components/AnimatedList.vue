<script setup>
// Высокоуровневый список с анимацией: сам оборачивает элементы в AnimatedContainer
const props = defineProps({
  // Контейнер списка
  tag: { type: String, default: 'div' },
  containerClass: { type: [String, Object, Array], default: '' },

  // Данные списка
  items: { type: Array, default: () => [] },
  // Ключ элемента: строка-ключ свойства или функция (item, index) => any
  itemKey: { type: [String, Function], default: undefined },

  // Обёртка элемента
  itemTag: { type: String, default: 'div' },
  itemClass: { type: [String, Object, Array], default: '' },
  itemPreset: { type: String, default: 'fadeIn' },
  itemOverrides: { type: Object, default: () => ({}) },
  // Локальные переопределения стаггера (опционально); по умолчанию берутся из useMotionSystem
  baseDelay: { type: Number, default: undefined },
  stepDelay: { type: Number, default: undefined },
})

// Вычисление ключа для элемента
const keyOf = (item, index) => {
  if (typeof props.itemKey === 'function') return props.itemKey(item, index)
  if (typeof props.itemKey === 'string' && item && item[props.itemKey] != null) return item[props.itemKey]
  return index
}
</script>

<template>
  <component :is="tag" :class="containerClass">
    <template v-for="(item, index) in items" :key="keyOf(item, index)">
      <AnimatedContainer
        :tag="itemTag"
        :preset="itemPreset"
        :overrides="itemOverrides"
        :index="index"
        :baseDelay="baseDelay"
        :stepDelay="stepDelay"
        :class="itemClass">
        <slot name="item" :item="item" :index="index" />
      </AnimatedContainer>
    </template>
  </component>
</template>
