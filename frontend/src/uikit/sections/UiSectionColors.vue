<script>
// Явно задаём имя компонента для корректной работы KeepAlive :include
export default { name: 'UiSectionColors' }
</script>

<script setup>
// Пропсы секции: приходят из views/Ui.vue через kebab-case атрибуты
const props = defineProps({
  primaryColors: { type: Array, required: true },
  surfaceColors: { type: Array, required: true },
  colorShades: { type: Array, required: true },
  primaryPalette: { type: Object, required: true },
  surfacePalette: { type: Object, required: true },
})

const COPY_COLOR_TYPES = ['HEX', 'CSS Variable']

const colors = ref([])

// Собираем список цветов с их оттенками на основе дизайн-токенов
const setColors = () => {
  const unionColors = [
    props.primaryColors[0],
    props.surfaceColors[0],
    ...props.primaryColors.slice(1),
    ...props.surfaceColors.slice(1),
  ]
  colors.value = unionColors.map((raw) => {
    let name = raw
    if (name.includes('.')) {
      const parts = name.split('.')
      name = parts.at(-1)
    }
    return {
      name,
      shades: Object.fromEntries(
        props.colorShades.map((shade) => {
          const dt = $dt(`${name}.${shade}`)
          return [shade, dt]
        }),
      ),
    }
  })
}

watch(() => props.primaryColors + props.surfaceColors, setColors, {
  immediate: true,
  deep: true,
})

// Обновляем значения оттенков при изменении палитр
const updatePalette = (colorName, palette) => {
  const target = colors.value.find((c) => c.name.includes(colorName))
  if (!target) return

  Object.keys(target.shades).forEach((shade) => {
    const shadeToken = palette[shade].replace(/[{}]/g, '').trim()
    const dt = $dt(shadeToken)
    // Для surface особая структура данных с вложенными объектами
    if (colorName === 'surface' && typeof dt.value !== 'string') {
      dt.value = dt.value?.none?.value
    }
    target.shades[shade] = dt
  })
}

watch(
  () => props.primaryPalette,
  (val) => updatePalette('primary', val),
  { deep: true },
)

watch(
  () => props.surfacePalette,
  (val) => updatePalette('surface', val),
  { deep: true },
)

// Цвет текста для контраста на фоне
const getFontColor = (color, shade) => {
  const shadeModified = shade < 500 ? 700 : shade <= 600 ? 200 : 300
  return { color: `var(--${color}-${shadeModified})` }
}

// Копирование HEX/переменной в буфер
const copyColorSwitch = ref(COPY_COLOR_TYPES[0])
const toast = useToast()
const { text, copy, isSupported } = useClipboard()
const showCopyColorMessage = () => {
  toast.add({
    severity: 'success',
    summary: 'Успешно',
    detail: `${text.value} в буфере обмена`,
    life: 3000,
  })
}

const copyColor = async (shade) => {
  if (!isSupported) return
  await copy(copyColorSwitch.value === 'HEX' ? shade?.value : shade?.variable)
  showCopyColorMessage()
}
</script>

<template>
  <section aria-labelledby="colors-heading">
    <header class="mb-8 flex flex-col gap-2">
      <h2 id="colors-heading">Colors</h2>
      <div class="flex items-center gap-4">
        <span class="font-semibold">Copy:</span>
        <SelectButton
          v-model="copyColorSwitch"
          :options="COPY_COLOR_TYPES"
          :allowEmpty="false" />
      </div>
      <span class="text-xs"
        >* копирует [
        <span
          class="transition-colors"
          :class="{ 'text-[var(--primary-500)]': copyColorSwitch === 'HEX' }"
          >цвет</span
        >
        /
        <span
          class="transition-colors"
          :class="{
            'text-[var(--primary-500)]': copyColorSwitch === 'CSS Variable',
          }"
          >название переменной</span
        >
        ] в буфер обмена</span
      >
    </header>

    <div class="table-wrapper overflow-auto">
      <table class="colors-table min-w-max border-collapse">
        <thead>
          <tr>
            <th class="p-4 font-semibold first:pl-0">Color</th>
            <th
              v-for="(_, key) in colors[0].shades"
              :key="key"
              class="shade p-0 text-center">
              {{ key }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="color in colors" :key="color.name" class="color">
            <td class="p-4">{{ color.name }}</td>
            <td
              v-for="(shade, key) in color.shades"
              :key="key"
              class="shade p-0 text-center"
              :class="`shade-${color.name}-${key}`"
              :style="{ 'background-color': shade.value }"
              @click="copyColor(shade)">
              <div
                class="color-value cursor-pointer p-2"
                :style="getFontColor(color.name, key)">
                {{ shade.value }}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
