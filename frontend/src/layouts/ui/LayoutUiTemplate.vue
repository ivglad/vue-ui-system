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
  <section class="flex w-full flex-col items-start overflow-hidden">
    <div class="flex w-full items-center justify-start px-8 py-4">
      <h2 class="text-xl font-semibold">{{ title }}</h2>
    </div>
    <div class="w-full max-w-full overflow-x-auto px-8 pb-8">
      <div v-if="!states?.length" class="w-fit pt-8">
        <slot />
      </div>
      <div v-else class="flex w-fit flex-col">
        <!-- Заголовок таблицы -->
        <div
          class="hidden w-full gap-8 md:grid"
          :style="{ gridTemplateColumns }">
          <div class="min-h-[50px] text-start font-semibold">Variant</div>
          <div
            v-for="state in states"
            :key="state"
            class="min-h-[50px] font-semibold">
            {{ state }}
          </div>
        </div>

        <!-- Дополнительные варианты -->
        <div
          v-for="variant in variants"
          :key="variant"
          class="grid w-full gap-8"
          :style="{ gridTemplateColumns }">
          <div class="mb-4 text-start md:px-1 md:py-2 md:font-semibold">
            {{ variant }}
          </div>
          <div v-for="state in states" :key="state" class="w-full">
            <div v-if="$slots[getSlotName(variant, state)]" class="mb-8 w-full">
              <slot :name="getSlotName(variant, state)"> </slot>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
