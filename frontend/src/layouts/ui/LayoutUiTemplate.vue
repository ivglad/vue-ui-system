<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  states: {
    type: Array,
    default: () => [],
  },
  variants: {
    type: Array,
    default: () => [],
  },
})

// CSS Grid template с равными колонками
const gridTemplateColumns = computed(() => {
  // Первая колонка для заголовка вариантов, остальные равные для состояний
  return `minmax(120px, min-content) repeat(${props.states.length}, 1fr)`
})

/**
 * Форматирует строку для использования в имени слота
 * Преобразует строку в нижний регистр и заменяет пробелы на дефисы
 * @param {string} str - строка для форматирования
 * @return {string} форматированная строка
 */
const formatSlotName = (str) => {
  return str.toLowerCase().replace(/\s+/g, '-')
}

/**
 * Генерирует имя слота на основе варианта и состояния
 * @param {string} variant - название варианта
 * @param {string} state - название состояния
 * @return {string} имя слота
 */
const getSlotName = (variant, state) => {
  return `${formatSlotName(variant)}-${formatSlotName(state)}`
}
</script>

<template>
  <section class="ui-layout-display flex flex-col items-start w-full overflow-hidden rounded-[var(--radius-control-lg)]">
    <div class="ui-layout-display__header flex items-center justify-start w-full px-8 py-4 bg-[var(--surface-100)]">
      <h2 class="font-semibold text-xl md:text-2xl">{{ title }}</h2>
    </div>
    <div class="ui-layout-display__content w-fit max-w-full bg-[var(--surface-50)] overflow-x-auto px-8 pb-8">
      <div class="raw-content-wrapper w-full pt-8" v-if="!states?.length">
        <slot />
      </div>
      <div class="grid-table-wrapper flex flex-col w-full overflow-x-auto" v-else>
        <!-- Заголовок таблицы -->
        <div class="grid-table-header hidden md:grid w-full gap-8" :style="{ gridTemplateColumns }">
          <div class="grid-cell header-cell first-cell font-semibold min-h-[50px] text-start">Variant</div>
          <div
            v-for="state in states"
            :key="state"
            class="grid-cell header-cell font-semibold min-h-[50px]">
            {{ state }}
          </div>
        </div>

        <!-- Дополнительные варианты -->
        <div v-for="variant in variants" :key="variant" class="grid-table-row grid w-full gap-8" :style="{ gridTemplateColumns }">
          <div class="grid-cell first-cell text-start mb-4 md:font-semibold md:py-2 md:px-1">{{ variant }}</div>
          <div v-for="state in states" :key="state" class="grid-cell w-full">
            <div
              class="grid-cell-slot w-full mb-8"
              v-if="$slots[getSlotName(variant, state)]">
              <slot :name="getSlotName(variant, state)"> </slot>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@media (max-width: 767px) {
  .grid-table-header { display: none; }
  .grid-table-row {
    grid-template-columns: 1fr !important;
    grid-auto-flow: row;
    gap: 0;
  }
  .grid-cell.first-cell { font-weight: 600; }
  .grid-cell.first-cell:not(.header-cell) { padding: 0.5rem 0.25rem; }
}
</style>
