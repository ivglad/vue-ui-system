<script setup>
import { $dt } from '@primeuix/themes'
import { AnimatePresence, motion, LayoutGroup } from 'motion-v'

// Динамическая карта асинхронных лэйаутов из директории `src/layouts/ui/`
// Исключаем статические импорты: нет прямых тегов компонентов в шаблоне
// Используем абсолютный путь, чтобы исключить влияние алиаса в dev-графе
const layoutLoaders = import.meta.glob('/src/layouts/ui/*.vue', {
  eager: false,
})

const AsyncLayouts = Object.fromEntries(
  Object.entries(layoutLoaders).map(([path, loader]) => {
    const name = path.split('/').pop().replace('.vue', '')
    return [
      name,
      defineAsyncComponent({
        loader,
        // Отключаем Suspense-поведение для первого показа
        suspensible: false,
        delay: 150,
        // Автоматический ретрай при временных ошибках загрузки чанка
        onError(err, retry, fail, attempts) {
          if (attempts <= 3) retry()
          else fail()
        },
      }),
    ]
  }),
)

// Карта name -> loader для префетча чанков по наведению/фокусу
const nameToLoader = Object.fromEntries(
  Object.entries(layoutLoaders).map(([path, loader]) => [
    path.split('/').pop().replace('.vue', ''),
    loader,
  ]),
)

// Кэш уже предзагруженных компонентов, чтобы не дёргать загрузчик повторно
const prefetched = new Set()
const prefetchLayout = async (name) => {
  const loader = nameToLoader[name]
  if (!loader || prefetched.has(name)) return
  prefetched.add(name)
  try {
    await loader()
  } catch {
    // В случае ошибки позволим повторить попытку позже
    prefetched.delete(name)
  }
}

const PRIMARY_COLORS = [
  'app.color.primary',
  'emerald',
  'green',
  'lime',
  'red',
  'orange',
  'amber',
  'yellow',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'pink',
  'rose',
]
const SURFACE_COLORS = [
  'app.color.surface',
  'slate',
  'gray',
  'zinc',
  'neutral',
  'stone',
]
const COLOR_SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

const getBackgroundColor = (color, shade = 400) => {
  return {
    'background-color': $dt(`${color}.${shade}`)?.variable,
  }
}

const primaryPalette = ref({})
const setPrimaryColor = (color) => {
  primaryPalette.value = Object.fromEntries(
    COLOR_SHADES.map((shade) => [shade, `{${color}.${shade}}`]),
  )
  updatePrimaryPalette({
    light: primaryPalette.value,
  })
}
const surfacePalette = ref({})
const setSurfaceColor = (color) => {
  surfacePalette.value = Object.fromEntries(
    COLOR_SHADES.map((shade) => [shade, `{${color}.${shade}}`]),
  )
  updateSurfacePalette({
    light: surfacePalette.value,
  })
}

// Динамический список имён лэйаутов из карты AsyncLayouts
const layoutNames = computed(() => Object.keys(AsyncLayouts).sort())

// Преобразует имя файла в удобную метку, убирает префикс LayoutUi
const displayLabel = (name) => {
  const base = name.replace(/^LayoutUi/, '')
  return base.replace(/([a-z])([A-Z])/g, '$1 $2')
}

// Набор выбранных лэйаутов
const selected = ref(new Set())

// По умолчанию выбираем "Buttons", если есть, иначе первый
onMounted(() => {
  const preferred = 'LayoutUiButtons'
  if (preferred in AsyncLayouts) selected.value.add(preferred)
  else if (layoutNames.value.length) selected.value.add(layoutNames.value[0])
})

const updateLayoutsVisibility = ref(false)
watch(updateLayoutsVisibility, (value) => {
  if (value) selected.value = new Set(layoutNames.value)
  else selected.value.clear()
})

const isComponentSelected = (componentName) => selected.value.has(componentName)

const isSelected = (name) => selected.value.has(name)
const toggleSelected = async (name, value) => {
  if (value) {
    await prefetchLayout(name)
    selected.value.add(name)
  } else {
    selected.value.delete(name)
  }
}

// Инициализация композабла анимации
const { getAnimationProps } = useAnimation()

// Функция для получения пропсов анимации для конкретного компонента
const getElementAnimationProps = (elementName) => {
  return getAnimationProps(elementName)
}

// Пропсы, специфичные для отдельных лэйаутов
const getComponentProps = (name) => {
  if (name === 'LayoutUiColors') {
    return {
      'primary-colors': PRIMARY_COLORS,
      'surface-colors': SURFACE_COLORS,
      'color-shades': COLOR_SHADES,
      'primary-palette': primaryPalette,
      'surface-palette': surfacePalette,
    }
  }
  return {}
}

// Директивы/атрибуты для отдельных лэйаутов (например, Carousel)
const getAnimateOnScroll = (name) => {
  if (name === 'LayoutUiCarousel') {
    return {
      enterClass: 'animate-fadein',
      leaveClass: 'animate-fadeout',
    }
  }
  // Директива ожидает объект; undefined приводит к попытке чтения свойств
  return {}
}
</script>

<template>
  <div class="relative overflow-hidden">
    <div class="sticky top-0 left-0">
      <div
        class="flex w-full max-w-[1200px] flex-wrap items-center justify-between gap-4">
        <span class="block w-full font-bold">Цветовая палитра:</span>
        <div class="flex items-center gap-2">
          <span>Primary:</span>
          <div
            v-for="color in PRIMARY_COLORS"
            :key="color"
            class="size-8 cursor-pointer rounded-full"
            :style="getBackgroundColor(color)"
            @click="setPrimaryColor(color)"></div>
        </div>
        <div class="flex items-center gap-2">
          <span>Surface:</span>
          <div
            v-for="color in SURFACE_COLORS"
            :key="color"
            class="size-8 cursor-pointer rounded-full"
            :style="getBackgroundColor(color)"
            @click="setSurfaceColor(color)"></div>
        </div>
      </div>
    </div>

    <Divider align="center">
      <h1>UI-KIT</h1>
    </Divider>

    <div class="flex w-full max-w-[1200px] flex-col items-start gap-8">
      <div class="flex w-full flex-wrap items-center gap-4">
        <ToggleButton
          v-model="updateLayoutsVisibility"
          onLabel="Скрыть все"
          offLabel="Показать все" />
        <div v-for="name in layoutNames" :key="name">
          <ToggleButton
            :modelValue="isSelected(name)"
            :onLabel="displayLabel(name)"
            :offLabel="displayLabel(name)"
            @update:modelValue="
              (val) => {
                toggleSelected(name, val)
                if (val) prefetchLayout(name)
              }
            "
            @mouseenter="prefetchLayout(name)"
            @focusin="prefetchLayout(name)" />
        </div>
      </div>

      <LayoutGroup>
        <AnimatePresence mode="popLayout">
          <template v-for="name in layoutNames" :key="name">
            <motion.div
              v-if="isComponentSelected(name)"
              :key="name"
              v-bind="getElementAnimationProps(name)"
              class="w-full">
              <KeepAlive>
                <component
                  :is="AsyncLayouts[name]"
                  v-bind="getComponentProps(name)"
                  v-animateonscroll="getAnimateOnScroll(name)"
                  :style="
                    name === 'LayoutUiCarousel'
                      ? { transitionDuration: '0.5s' }
                      : undefined
                  " />
              </KeepAlive>
            </motion.div>
          </template>
        </AnimatePresence>
      </LayoutGroup>

      <ScrollTop>
        <template #icon>
          <!-- <i-fluent-arrow-curve-up-right-20-filled /> -->
        </template>
      </ScrollTop>
    </div>
  </div>
</template>
