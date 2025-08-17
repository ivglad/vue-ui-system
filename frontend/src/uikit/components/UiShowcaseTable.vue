<script setup>
const props = defineProps({
  title: { type: String, required: true },
  states: { type: Array, default: () => [] },
  variants: { type: Array, default: () => [] },
  columnMinWidthRem: { type: Number, default: 7.5 }, // ~120px
  gapRem: { type: Number, default: 2 }, // ~32px
  emptyText: { type: String, default: '' },
})

const gridTemplateColumns = computed(() => {
  return `minmax(${props.columnMinWidthRem}rem, min-content) repeat(${props.states.length}, 1fr)`
})

const formatSlotName = (str) => str.toLowerCase().replace(/\s+/g, '-')
const getSlotName = (variant, state) =>
  `${formatSlotName(variant)}-${formatSlotName(state)}`
</script>

<template>
  <section class="flex w-full flex-col items-start overflow-hidden">
    <div class="flex w-full items-center justify-start px-8 py-4">
      <h2 class="text-xl font-semibold">{{ title }}</h2>
    </div>

    <div class="w-full max-w-full overflow-x-auto px-8 pb-8">
      <div v-if="!states?.length" class="w-fit pt-8">
        <slot />
        <p v-if="!$slots.default && emptyText" class="text-sm opacity-70">
          {{ emptyText }}
        </p>
      </div>

      <div v-else class="flex w-fit flex-col" role="table" :aria-label="title">
        <!-- Заголовок таблицы -->
        <div
          class="hidden w-full md:grid"
          :style="{ gridTemplateColumns, gap: `${gapRem}rem` }"
          role="row">
          <div
            class="min-h-[3.125rem] text-start font-semibold"
            role="columnheader">
            Variant
          </div>
          <div
            v-for="state in states"
            :key="state"
            class="min-h-[3.125rem] font-semibold"
            role="columnheader">
            {{ state }}
          </div>
        </div>

        <!-- Варианты -->
        <div
          v-for="variant in variants"
          :key="variant"
          class="grid w-full"
          :style="{ gridTemplateColumns, gap: `${gapRem}rem` }"
          role="row">
          <div
            class="mb-4 text-start break-normal md:px-1 md:py-2 md:font-semibold"
            role="rowheader">
            {{ variant }}
          </div>
          <div v-for="state in states" :key="state" class="w-full" role="cell">
            <div v-if="$slots[getSlotName(variant, state)]" class="mb-8 w-full">
              <slot :name="getSlotName(variant, state)" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
