<script setup>
// Тонкая обёртка над <Motion> с API через пресеты
defineOptions({ inheritAttrs: false })

const props = defineProps({
  preset: { type: String, default: 'element.fade' },
  overrides: { type: Object, default: null },
})

const attrs = useAttrs()
const motionProps = computed(() => m(props.preset, props.overrides))
const mergedProps = computed(() => ({ ...motionProps.value, ...attrs }))
</script>

<template>
  <Motion v-bind="mergedProps">
    <slot />
  </Motion>
</template>
