<script setup>
const props = defineProps({
  names: { type: Array, default: () => [] },
  selected: { type: Array, default: () => [] },
  labelFor: { type: Function, default: (n) => n },
})

const emit = defineEmits(['toggle', 'prefetch', 'update:showAll'])

const allSelected = computed(
  () =>
    props.selected.length > 0 && props.selected.length === props.names.length,
)

// Минимум один раздел должен оставаться видимым
const isLastVisible = computed(() => props.selected.length <= 1)

const onToggleAll = (val) => emit('update:showAll', val)
const onToggle = (name, val) => emit('toggle', name, val)
const onPrefetch = (name) => emit('prefetch', name)
</script>

<template>
  <aside
    class="sticky top-[4rem] max-h-[calc(100vh-4rem)] overflow-y-auto px-4 py-2">
    <div class="flex flex-col gap-[0.5rem]">
      <ToggleButton
        :modelValue="allSelected"
        onLabel="Скрыть все"
        offLabel="Показать все"
        :disabled="allSelected"
        @update:modelValue="onToggleAll" />

      <div class="mt-[0.5rem] flex flex-col gap-[0.5rem]">
        <ToggleButton
          v-for="name in names"
          :key="name"
          :modelValue="selected.includes(name)"
          :onLabel="labelFor(name)"
          :offLabel="labelFor(name)"
          :disabled="isLastVisible && selected.includes(name)"
          @update:modelValue="(val) => onToggle(name, val)"
          @mouseenter="onPrefetch(name)"
          @focusin="onPrefetch(name)" />
      </div>
    </div>
  </aside>
</template>
