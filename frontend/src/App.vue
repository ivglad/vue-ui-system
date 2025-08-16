<script setup>
import { AnimatePresence, motion } from 'motion-v'

// Инициализируем viewport fallback только для старых браузеров
const { initViewportFallback, cleanupViewportFallback } = useViewportFallback()

onMounted(() => {
  initViewportFallback()
})

onUnmounted(() => {
  cleanupViewportFallback()
})

// Управление переходами между страницами
const router = useRouter()
const transitionType = ref('fade')

// Определяем тип анимации на основе перехода
router.beforeEach((to, from) => {
  if (from.path === '/auth' && to.path === '/chat') {
    transitionType.value = 'auth-to-chat'
  } else if (from.path === '/chat' && to.path === '/auth') {
    transitionType.value = 'chat-to-auth'
  } else {
    transitionType.value = 'fade'
  }
})
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

  <main class="flex flex-col flex-[1_1_100%] w-full h-full relative overflow-hidden">
    <router-view v-slot="{ Component, route }">
      <AnimatePresence mode="wait">
        <motion.div
          :key="route.path"
          class="w-full h-full overflow-hidden">
          <component :is="Component" />
        </motion.div>
      </AnimatePresence>
    </router-view>
  </main>

  <DynamicDialog />
  <ConfirmDialog group="confirm" pt:root:class="app-confirm-modified" />
  <ConfirmDialog
    group="confirm-secondary"
    pt:root:class="app-confirm-secondary" />
  <ConfirmPopup />
</template>
