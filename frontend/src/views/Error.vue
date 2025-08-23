<script setup>
const router = useRouter()

// Стаггер задержек инкапсулирован в MotionContainer через prop index

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    goHome()
  }
}

defineOptions({
  name: 'ErrorPage',
})
</script>

<template>
  <div
    class="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
    <AMotion preset="element.fadeInUp" class="w-full max-w-md text-center">
      <AMotion
        preset="element.fadeInUp"
        :order="0"
        class="text-primary-500 mb-4 text-8xl font-black select-none md:text-9xl">
        404
      </AMotion>

      <AMotion
        tag="h1"
        preset="element.fadeInUp"
        :order="1"
        class="mb-4 text-2xl font-bold text-gray-900 md:text-3xl">
        Упс! Страница не найдена
      </AMotion>

      <AMotion
        tag="p"
        preset="element.fadeInUp"
        :order="2"
        class="mb-8 text-lg leading-relaxed text-gray-600">
        Страница, которую вы ищете, была удалена, переименована или временно
        недоступна.
      </AMotion>

      <AMotion
        preset="element.fadeInUp"
        :order="3"
        class="flex flex-col justify-center gap-4 sm:flex-row">
        <Button
          label="На главную"
          icon="pi pi-home"
          class="bg-primary-500 hover:bg-primary-600 rounded-xl px-6 py-3 font-medium text-white transition-colors duration-200"
          @click="goHome" />

        <Button
          label="Назад"
          icon="pi pi-arrow-left"
          outlined
          class="rounded-xl border-gray-300 px-6 py-3 font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50"
          @click="goBack" />
      </AMotion>
    </AMotion>
  </div>
</template>
