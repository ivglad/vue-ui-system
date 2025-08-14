<script setup>
const COPY_COLOR_TYPES = ['HEX', 'CSS Variable']

const props = defineProps({
  primaryColors: {
    type: Array,
    required: true,
  },
  surfaceColors: {
    type: Array,
    required: true,
  },
  colorShades: {
    type: Array,
    required: true,
  },
  primaryPalette: {
    type: Object,
    required: true,
  },
  surfacePalette: {
    type: Object,
    required: true,
  },
})

const isDarkMode = inject('isDarkMode')

const colors = ref([])

// Установка цветов
const setColors = () => {
  const unionColors = [
    props.primaryColors[0],
    props.surfaceColors[0],
    ...props.primaryColors.slice(1),
    ...props.surfaceColors.slice(1),
  ]
  colors.value = unionColors.map((color) => {
    if (color.includes('.')) {
      const colorTokens = color.split('.')
      color = colorTokens.at(-1)
    }
    return {
      name: color,
      shades: Object.fromEntries(
        props.colorShades.map((shade) => {
          const dt = $dt(`${color}.${shade}`)
          /**
           * Для primary и surface особая структура данных с вложенными объектами
           * связано с палитрой для приложения в app.color и двух тем (light и dark) для surface
           */
          if (typeof dt.value !== 'string') {
            const theme = isDarkMode.value ? 'dark' : 'light'
            const token =
              color === 'primary'
                ? `app.color.${color}.${shade}`
                : `app.color.${color}.${theme}.${shade}`
            dt.value =
              color === 'primary'
                ? $dt(token)?.value
                : $dt(token)?.value?.none?.value
          }
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

// Обновление цветовой палитры
const updatePalette = (colorName, palette) => {
  const targetColor = colors.value.find((color) =>
    color.name.includes(colorName),
  )
  if (!targetColor) return

  Object.keys(targetColor.shades).forEach((shade) => {
    const shadeToken = palette[shade].replace(/[{}]/g, '').trim()
    const dt = $dt(shadeToken)
    // Для surface особая структура данных с вложенными объектами
    if (colorName === 'surface' && typeof dt.value !== 'string') {
      dt.value = dt.value?.none?.value
    }
    targetColor.shades[shade] = dt
  })
}
// Наблюдаем за primary палитрой
watch(
  () => props.primaryPalette,
  (newValue) => {
    updatePalette('primary', newValue)
  },
  { deep: true },
)
// Наблюдаем за surface палитрой
watch(
  () => props.surfacePalette,
  (newValue) => {
    updatePalette('surface', newValue)
  },
  { deep: true },
)

const getFontColor = (color, shade) => {
  const shadeModified = shade < 500 ? 700 : shade <= 600 ? 200 : 300
  return {
    color: `var(--${color}-${shadeModified})`,
  }
}

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
// Копирование цвета в буфер обмена
const copyColor = async (shade) => {
  if (!isSupported) return
  await copy(copyColorSwitch.value === 'HEX' ? shade?.value : shade?.variable)
  showCopyColorMessage()
}
</script>

<template>
  <LayoutUiTemplate title="Colors">
    <div class="content">
      <div class="options flex flex-col gap-2 mb-8">
        <div class="flex items-center gap-4">
          <span class="font-semibold">Copy:</span>
          <SelectButton
            v-model="copyColorSwitch"
            :options="COPY_COLOR_TYPES"
            :allowEmpty="false" />
        </div>
        <span class="text-xs"
          >* копирует [<span
            class="transition-colors"
            :class="{ 'text-[var(--primary-500)]': copyColorSwitch === 'HEX' }"
            >цвет</span
          >
          /
          <span
            class="transition-colors"
            :class="{ 'text-[var(--primary-500)]': copyColorSwitch === 'CSS Variable' }"
            >название переменной</span
          >] в буфер обмена</span
        >
      </div>

      <div class="table-wrapper">
        <table class="colors-table">
          <thead>
            <tr>
              <th class="p-4 font-semibold first:pl-0">Color</th>
              <th v-for="(_, key) in colors[0].shades" :key="key" class="shade p-0 text-center">
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
                :style="{ 'background-color': shade.value }">
                <div
                  class="color-value p-2 cursor-pointer"
                  :style="getFontColor(color.name, key)"
                  @click="copyColor(shade)">
                  {{ shade.value }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </LayoutUiTemplate>
</template>
