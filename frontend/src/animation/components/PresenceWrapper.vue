<script setup>
import { AnimatePresence } from 'motion-v'

defineOptions({
  name: 'PresenceWrapper',
  inheritAttrs: false,
})

defineProps({
  // Если undefined/false — рендерим слот без AnimatePresence
  mode: { type: String, default: undefined },
})
</script>

<template>
  <template v-if="mode">
    <AnimatePresence :mode="mode">
      <slot />
    </AnimatePresence>
  </template>
  <template v-else>
    <slot />
  </template>
</template>
