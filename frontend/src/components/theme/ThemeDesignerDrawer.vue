<script setup>
import { computed, ref, watch } from 'vue'
import { useThemeDesignerStore } from '@/stores/themeDesignerStore'
import { useToast } from 'primevue/usetoast'

const props = defineProps({
  open: { type: Boolean, default: false },
})

// Store & Toast должны быть объявлены до вычисляемых свойств
const store = useThemeDesignerStore()
const toast = useToast()

// Unsaved changes and autosave UX
const isDirty = computed(() => {
  try {
    return JSON.stringify(store.draft) !== JSON.stringify(store.applied)
  } catch (e) {
    return true
  }
})

const suppressAutosaveToast = ref(false)
let autosaveTimer = null
const lastAutosaveToastAt = ref(0)

watch(
  () => store.draft,
  () => {
    // useStorage уже сохраняет черновик автоматически, тут только UX-обратная связь
    if (autosaveTimer) clearTimeout(autosaveTimer)
    autosaveTimer = setTimeout(() => {
      if (suppressAutosaveToast.value) return
      const now = Date.now()
      if (now - lastAutosaveToastAt.value >= 3000) {
        toast.add({ severity: 'secondary', summary: 'Черновик автосохранён', life: 1200 })
        lastAutosaveToastAt.value = now
      }
    }, 800)
  },
  { deep: true }
)

// Forms → InputText tokens
const inputPaddingX = computed({
  get: () => store.draft?.forms?.inputtext?.paddingX,
  set: (val) => {
    let v = Number(val ?? 0)
    if (Number.isNaN(v)) v = 0
    v = Math.max(0, Math.min(48, Math.round(v)))
    const forms = { ...(store.draft?.forms || {}) }
    const inputtext = { ...(forms.inputtext || {}) }
    store.draft = { ...store.draft, forms: { ...forms, inputtext: { ...inputtext, paddingX: v } } }
  },
})

const inputPaddingY = computed({
  get: () => store.draft?.forms?.inputtext?.paddingY,
  set: (val) => {
    let v = Number(val ?? 0)
    if (Number.isNaN(v)) v = 0
    v = Math.max(0, Math.min(32, Math.round(v)))
    const forms = { ...(store.draft?.forms || {}) }
    const inputtext = { ...(forms.inputtext || {}) }
    store.draft = { ...store.draft, forms: { ...forms, inputtext: { ...inputtext, paddingY: v } } }
  },
})

const inputBorderRadius = computed({
  get: () => store.draft?.forms?.inputtext?.borderRadius,
  set: (val) => {
    let v = Number(val ?? 0)
    if (Number.isNaN(v)) v = 0
    v = Math.max(0, Math.min(24, Math.round(v)))
    const forms = { ...(store.draft?.forms || {}) }
    const inputtext = { ...(forms.inputtext || {}) }
    store.draft = { ...store.draft, forms: { ...forms, inputtext: { ...inputtext, borderRadius: v } } }
  },
})

const inputFocusRingWidth = computed({
  get: () => store.draft?.forms?.inputtext?.focusRingWidth,
  set: (val) => {
    let v = Number(val ?? 0)
    if (Number.isNaN(v)) v = 0
    v = Math.max(0, Math.min(8, Math.round(v)))
    const forms = { ...(store.draft?.forms || {}) }
    const inputtext = { ...(forms.inputtext || {}) }
    store.draft = { ...store.draft, forms: { ...forms, inputtext: { ...inputtext, focusRingWidth: v } } }
  },
})

// Store & Toast объявлены выше

// Поверхности (базовая): пока используется как значение для экспорта/сохранения
const surfaceHex = computed({
  get: () => store.draft?.surface,
  set: (value) => {
    const v = String(value || '').trim()
    const isHex = /^#([\da-fA-F]{3}|[\da-fA-F]{6})$/.test(v)
    if (isHex) {
      store.draft = { ...store.draft, surface: v }
    } else if (v) {
      toast.add({ severity: 'warn', summary: 'Некорректный цвет', detail: 'Введите HEX в формате #RGB или #RRGGBB', life: 2500 })
    }
  },
})

// Фокус: цвет кольца фокуса (используется в экспорте; предпросмотр пока частично)
const focusHex = computed({
  get: () => store.draft?.focus,
  set: (value) => {
    const v = String(value || '').trim()
    const isHex = /^#([\da-fA-F]{3}|[\da-fA-F]{6})$/.test(v)
    if (isHex) {
      store.draft = { ...store.draft, focus: v }
    } else if (v) {
      toast.add({ severity: 'warn', summary: 'Некорректный цвет', detail: 'Введите HEX в формате #RGB или #RRGGBB', life: 2500 })
    }
  },
})

// Радиус скругления (px), безопасный диапазон 0..24
const radiusValue = computed({
  get: () => store.draft?.radius,
  set: (val) => {
    let v = Number(val ?? 0)
    if (Number.isNaN(v)) v = 0
    v = Math.max(0, Math.min(24, Math.round(v)))
    store.draft = { ...store.draft, radius: v }
  },
})
const emit = defineEmits(['update:open'])

// Обёртка над PrimeVue Drawer API (visible) → внешний v-model:open
const visible = computed({
  get: () => props.open,
  set: (v) => emit('update:open', v),
})

const close = () => emit('update:open', false)

// Store и Toast уже объявлены выше

// Двунаправленное связывание primary через вычисляемое свойство
const primaryHex = computed({
  get: () => store.draft?.primary,
  set: (value) => {
    const v = String(value || '').trim()
    const isHex = /^#([\da-fA-F]{3}|[\da-fA-F]{6})$/.test(v)
    if (isHex) {
      store.draft = { ...store.draft, primary: v }
    } else if (v) {
      toast.add({ severity: 'warn', summary: 'Некорректный цвет', detail: 'Введите HEX в формате #RGB или #RRGGBB', life: 2500 })
    }
  },
})

// Actions
const apply = () => {
  store.applyPreview()
  toast.add({ severity: 'success', summary: 'Тема применена', life: 2000 })
}
const reset = () => {
  suppressAutosaveToast.value = true
  store.resetDraft()
  // подавляем автосохранение на этот тик
  setTimeout(() => (suppressAutosaveToast.value = false), 0)
  toast.add({ severity: 'info', summary: 'Черновик сброшен', life: 2000 })
}

// Export / Import helpers
const download = (filename, text) => {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(link.href)
}

const exportJson = () => {
  download('theme.json', store.exportJson())
  toast.add({ severity: 'success', summary: 'Экспорт JSON', detail: 'Файл theme.json сохранён', life: 2000 })
}
const exportJs = () => {
  download('theme.config.js', store.exportJsModule())
  toast.add({ severity: 'success', summary: 'Экспорт JS', detail: 'Файл theme.config.js сохранён', life: 2000 })
}

const fileInput = ref(null)
const triggerImport = () => fileInput.value?.click()
const onFile = async (e) => {
  const file = e.target?.files?.[0]
  if (!file) return
  const text = await file.text()
  suppressAutosaveToast.value = true
  const ok = store.importJson(text)
  if (ok) {
    toast.add({ severity: 'success', summary: 'Импорт JSON', detail: 'Настройки импортированы', life: 2000 })
  } else {
    toast.add({ severity: 'error', summary: 'Ошибка импорта', detail: 'Некорректный формат JSON', life: 2500 })
  }
  setTimeout(() => (suppressAutosaveToast.value = false), 0)
  e.target.value = ''
}
</script>

<template>
  <Drawer v-model:visible="visible" position="right" class="w-1/2 sm:w-full">
    <template #header>
      <div class="flex items-center justify-between w-full">
        <h3 class="text-base font-semibold">Theme Designer</h3>
        <Button label="Закрыть" variant="text" @click="close" />
      </div>
    </template>

    <div class="space-y-6">
      <!-- Colors section -->
      <section class="space-y-3">
        <h4 class="text-sm font-medium text-zinc-600 dark:text-zinc-300">Colors</h4>
        <div class="flex items-center gap-3">
          <label class="w-24 text-sm">Primary</label>
          <ColorPicker v-model="primaryHex" />
          <InputText v-model="primaryHex" class="flex-1" />
        </div>
        <p class="text-xs text-zinc-500 dark:text-zinc-400">Выберите базовый цвет. Палитра оттенков будет рассчитана автоматически и применена только после нажатия «Применить».</p>
      </section>

      <!-- Surfaces section -->
      <section class="space-y-3">
        <h4 class="text-sm font-medium text-zinc-600 dark:text-zinc-300">Surfaces</h4>
        <div class="flex items-center gap-3">
          <label class="w-24 text-sm">Base</label>
          <ColorPicker v-model="surfaceHex" />
          <InputText v-model="surfaceHex" class="flex-1" />
        </div>
        <Message severity="secondary" variant="simple" size="small">Изменение поверхностей в предпросмотре может применяться не полностью. Для точности используйте экспорт пресета.</Message>
      </section>

      <!-- Radius section -->
      <section class="space-y-3">
        <h4 class="text-sm font-medium text-zinc-600 dark:text-zinc-300">Radius</h4>
        <div class="flex items-center gap-3">
          <label class="w-24 text-sm">Base (px)</label>
          <InputNumber v-model="radiusValue" :min="0" :max="24" :step="1" inputId="radius" locale="ru-RU" />
        </div>
        <Message severity="secondary" variant="simple" size="small">Скругления компонентов могут зависеть от пресета. В экспорте будет сохранено число пикселей.</Message>
      </section>

      <!-- Focus section -->
      <section class="space-y-3">
        <h4 class="text-sm font-medium text-zinc-600 dark:text-zinc-300">Focus</h4>
        <div class="flex items-center gap-3">
          <label class="w-24 text-sm">Ring</label>
          <ColorPicker v-model="focusHex" />
          <InputText v-model="focusHex" class="flex-1" />
        </div>
        <Message severity="secondary" variant="simple" size="small">Цвет кольца фокуса в рантайме может отличаться. Экспорт пресета гарантирует единообразие.</Message>
      </section>

      <!-- Forms section -->
      <section class="space-y-3">
        <h4 class="text-sm font-medium text-zinc-600 dark:text-zinc-300">Forms</h4>
        <div class="flex items-center gap-3">
          <label class="w-32 text-sm">Input X (px)</label>
          <InputNumber v-model="inputPaddingX" :min="0" :max="48" :step="1" locale="ru-RU" />
        </div>
        <div class="flex items-center gap-3">
          <label class="w-32 text-sm">Input Y (px)</label>
          <InputNumber v-model="inputPaddingY" :min="0" :max="32" :step="1" locale="ru-RU" />
        </div>
        <div class="flex items-center gap-3">
          <label class="w-32 text-sm">Radius (px)</label>
          <InputNumber v-model="inputBorderRadius" :min="0" :max="24" :step="1" locale="ru-RU" />
        </div>
        <div class="flex items-center gap-3">
          <label class="w-32 text-sm">Focus ring (px)</label>
          <InputNumber v-model="inputFocusRingWidth" :min="0" :max="8" :step="1" locale="ru-RU" />
        </div>
        <Message severity="secondary" variant="simple" size="small">Настройки форм отражаются частично в предпросмотре. Экспорт пресета сохранит значения корректно.</Message>
      </section>

      <!-- Actions -->
      <section v-if="isDirty" class="-mt-2">
        <Message severity="warn" variant="simple" size="small">Есть несохранённые изменения. Нажмите «Применить», чтобы применить их.</Message>
      </section>

      <section class="flex flex-wrap items-center gap-2">
        <Button label="Применить" :disabled="!isDirty" @click="apply" />
        <Button label="Сбросить" variant="outlined" @click="reset" />

        <div class="ml-auto flex items-center gap-2">
          <Button label="Экспорт JSON" variant="outlined" @click="exportJson" />
          <Button label="Импорт JSON" variant="outlined" @click="triggerImport" />
          <Button label="Экспорт JS" variant="outlined" @click="exportJs" />
        </div>

        <input ref="fileInput" type="file" accept="application/json" class="hidden" @change="onFile" />
      </section>
    </div>
  </Drawer>
</template>
