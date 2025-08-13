<script setup>
// Компонент-канвас: рендерит нужный layout из src/layouts/ui/ по выбранному разделу
// Все стили — Tailwind 4. Никаких глобальных сайд-эффектов.

import { computed } from 'vue'
import LayoutUiButtons from '@/layouts/ui/LayoutUiButtons.vue'
import LayoutUiInputs from '@/layouts/ui/LayoutUiInputs.vue'

const props = defineProps({
  entry: { type: String, default: 'Buttons' }, // 'Buttons' | 'Inputs'
  dark: { type: Boolean, default: false },
})

const previewComponent = computed(() => {
  return props.entry === 'Inputs' ? LayoutUiInputs : LayoutUiButtons
})
</script>

<template>
  <!-- Контейнер предпросмотра. Тёмный режим включается добавлением класса .dark-mode на корневой блок. -->
  <section
    class="h-full w-full bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50"
    :class="{ 'dark-mode': dark }"
  >
    <div class="h-full w-full p-6 overflow-auto">
      <component :is="previewComponent" />
    </div>
  </section>
</template>
