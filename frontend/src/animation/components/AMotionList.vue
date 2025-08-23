<script setup>
// Контролируемая обёртка для списков: LayoutGroup + контейнер Motion со стаггером
defineOptions({ inheritAttrs: false })

const props = defineProps({
  preset: { type: String, default: 'list.spring' },
  overrides: { type: Object, default: null },
  presence: { type: Boolean, default: true },
  // 'sync' | 'wait' | 'popLayout'
  presenceMode: { type: String, default: 'sync' },
})

const attrs = useAttrs()
const groupProps = computed(() => m(props.preset, props.overrides))
const mergedProps = computed(() => ({ ...groupProps.value, ...attrs }))
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
