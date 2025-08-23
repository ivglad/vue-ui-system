<script setup>
// Инициализируем viewport fallback только для старых браузеров
const { initViewportFallback, cleanupViewportFallback } = useViewportFallback()

onMounted(() => {
  initViewportFallback()
})

onUnmounted(() => {
  cleanupViewportFallback()
})

// Пресеты переходов страниц из route.meta
const { routeMotion } = useRouteMotion()
</script>

<template>
  <Toast>
    <template #closeicon>
      <i-custom-cross />
    </template>
    <template #container="{ message, closeCallback }">
      <div class="app-toast p-toast-message-content">
        <div v-if="message.summary" class="app-toast-summary">
          <span class="p-toast-summary fw-bold">{{ message.summary }}</span>
          <Button
            class="app-toast-close-button"
            variant="text"
            size="small"
            severity="secondary"
            rounded
            @click="closeCallback">
          </Button>
        </div>
        <div
          v-if="message.detail"
          class="app-toast-detail p-toast-detail text-color">
          {{ message.detail }}
        </div>
      </div>
    </template>
  </Toast>

  <AMotionProvider>
    <main
      class="bg-surface-50 relative flex h-full w-full flex-col overflow-hidden">
      <router-view v-slot="{ Component, route }">
        <AnimatePresence mode="wait">
          <Motion
            :key="route.fullPath"
            v-bind="routeMotion(route)"
            class="overflow-y-auto">
            <component :is="Component" />
          </Motion>
        </AnimatePresence>
      </router-view>
    </main>
  </AMotionProvider>

  <DynamicDialog />
  <ConfirmDialog group="confirm" pt:root:class="app-confirm-modified" />
  <ConfirmDialog
    group="confirm-secondary"
    pt:root:class="app-confirm-secondary" />
  <ConfirmPopup />
</template>
