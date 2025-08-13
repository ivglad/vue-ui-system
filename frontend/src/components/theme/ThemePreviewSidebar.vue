<script setup>
// Простой сайдбар: две опции — Buttons и Inputs
// Стили только Tailwind 4, элементы управления — PrimeVue Button

defineProps({
  modelValue: { type: String, default: 'Buttons' },
})

defineEmits(['update:modelValue', 'select'])
</script>

<template>
  <aside class="h-full bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100">
    <div class="p-4 border-b border-gray-200 dark:border-zinc-700 font-medium">Предпросмотр</div>
    <nav class="p-2 space-y-2">
      <Button
        label="Buttons"
        variant="text"
        :severity="modelValue === 'Buttons' ? 'contrast' : undefined"
        class="w-full justify-start"
        @click="$emit('update:modelValue', 'Buttons'); $emit('select', 'Buttons')"
      />
      <Button
        label="Inputs"
        variant="text"
        :severity="modelValue === 'Inputs' ? 'contrast' : undefined"
        class="w-full justify-start"
        @click="$emit('update:modelValue', 'Inputs'); $emit('select', 'Inputs')"
      />
    </nav>
  </aside>
</template>
