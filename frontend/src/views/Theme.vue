<script setup>
import { ref, watch } from 'vue'
import ThemePreviewSidebar from '@/components/theme/ThemePreviewSidebar.vue'
import ThemePreviewContainer from '@/components/theme/ThemePreviewContainer.vue'
import ThemeDesignerDrawer from '@/components/theme/ThemeDesignerDrawer.vue'

// Выбор раздела предпросмотра
const selected = ref('Buttons') // 'Buttons' | 'Inputs'
const onSelect = (name) => (selected.value = name)

// Управление Drawer
const open = ref(false)

// Тёмная тема (ручное переключение) — по умолчанию светлая
const dark = ref(false)
watch(dark, () => {
  // Никаких глобальных эффектов — класс навешивается в контейнере предпросмотра
})
</script>

<template>
  <div class="flex h-screen w-full overflow-hidden">
    <!-- Sidebar -->
    <ThemePreviewSidebar
      class="w-40 border-r border-gray-200 dark:border-zinc-700"
      :model-value="selected"
      @select="onSelect"
    />

    <!-- Preview area -->
    <ThemePreviewContainer
      class="flex-1 overflow-auto"
      :entry="selected"
      :dark="dark"
    />

    <!-- Drawer trigger -->
    <div class="absolute right-4 top-4 z-10 flex items-center gap-3">
      <Button
        label="Открыть дизайнер"
        class="px-3 py-1.5"
        @click="open = true"
      />
      <div class="inline-flex items-center gap-2 text-sm">
        <ToggleSwitch v-model="dark" />
        <span>Тёмная тема</span>
      </div>
    </div>

    <!-- Designer Drawer -->
    <ThemeDesignerDrawer v-model:open="open" />

  </div>
</template>
<!-- Все стили только Tailwind 4 -->
