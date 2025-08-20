<script setup>
import { motion, Motion } from 'motion-v'

defineOptions({
  name: 'MotionElement',
  inheritAttrs: false,
})

const props = defineProps({
  tag: { type: String, default: 'div' },
  asChild: { type: Boolean, default: false },
  layout: { type: Boolean, default: false },
  motionProps: { type: Object, default: () => ({}) },
})

const motionTag = computed(() =>
  motion && motion[props.tag] ? motion[props.tag] : 'div',
)
</script>

<template>
  <Motion
    v-if="asChild"
    v-bind="{ ...motionProps, ...$attrs }"
    :layout="layout"
    as-child>
    <slot />
  </Motion>

  <component
    :is="motionTag"
    v-else
    v-bind="{ ...motionProps, ...$attrs }"
    :layout="layout">
    <slot />
  </component>
</template>
