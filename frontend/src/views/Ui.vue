<script setup>
// Динамическая карта асинхронных секций из директории `@/uikit/sections/`
const sectionEntries = Object.entries(
  import.meta.glob('@/uikit/sections/*.vue', {
    eager: false,
  }),
)

// Асинхронные компоненты секций
const AsyncSections = Object.fromEntries(
  sectionEntries.map(([path, loader]) => {
    const name = path.split('/').pop().replace('.vue', '')
    return [
      name,
      defineAsyncComponent({
        loader,
        suspensible: false,
        delay: 150,
        onError(err, retry, fail, attempts) {
          if (attempts <= 3) retry()
          else fail()
        },
      }),
    ]
  }),
)

// Карта name -> loader для префетча чанков
const nameToLoader = Object.fromEntries(
  sectionEntries.map(([path, loader]) => [
    path.split('/').pop().replace('.vue', ''),
    loader,
  ]),
)

// Управление выбором секций (минимум одна)
const {
  sectionNames,
  includeList,
  isSelected,
  toggle,
  toggleAll,
  prefetch,
  selectDefault,
} = useUiShowcase(nameToLoader)

onMounted(() => {
  selectDefault()
})

// Видимые секции (для корректного стаггера по индексу только видимых элементов)
const visibleSectionNames = computed(() =>
  sectionNames.value.filter(isSelected),
)

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

// Преобразует имя файла в удобную метку, убирает префикс UiSection
const displayLabel = (name) =>
  name.replace(/^UiSection/, '').replace(/([a-z])([A-Z])/g, '$1 $2')

// Пропсы, специфичные для отдельных секций
const getComponentProps = (name) => {
  if (name === 'UiSectionColors') {
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

// Директивы/атрибуты для отдельных секций (например, Carousel)
const getAnimateOnScroll = (name) => {
  if (name === 'UiSectionCarousel') {
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
  <div class="relative">
    <div class="sticky top-0 z-100 p-4 backdrop-blur-md">
      <div
        class="mx-auto flex w-full max-w-[1200px] flex-wrap items-center justify-between gap-4">
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

    <div class="flex w-full max-w-[1200px] items-start gap-8">
      <UiShowcaseSidebar
        :names="sectionNames"
        :selected="includeList"
        :labelFor="displayLabel"
        @toggle="toggle"
        @prefetch="prefetch"
        @update:showAll="toggleAll" />

      <MotionGroup
        class="flex flex-1 flex-col items-start gap-8"
        presence-mode="sync"
        layout>
        <template #default>
          <MotionContainer
            v-for="(name, idx) in visibleSectionNames"
            :key="name"
            class="w-full overflow-hidden"
            layout
            item
            preset="scaleIn"
            presence-mode="wait"
            :index="idx"
            :reveal-delay="0.05">
            <component
              :is="AsyncSections[name]"
              v-bind="getComponentProps(name)"
              v-animateonscroll="getAnimateOnScroll(name)" />
          </MotionContainer>
        </template>
      </MotionGroup>
    </div>

    <ScrollTop>
      <template #icon>
        <!-- <i-fluent-arrow-curve-up-right-20-filled /> -->
      </template>
    </ScrollTop>
  </div>
</template>
