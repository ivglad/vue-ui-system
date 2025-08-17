<script setup>
const router = useRouter()

// Стаггер задержек инкапсулирован в AnimatedContainer через prop index

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
    <AnimatedContainer
      tag="div"
      :index="0"
      preset="fadeIn"
      class="w-full max-w-md text-center">
      <AnimatedContainer
        tag="div"
        :index="1"
        preset="fadeIn"
        class="text-primary-500 mb-4 text-8xl font-black select-none md:text-9xl">
        404
      </AnimatedContainer>

      <AnimatedContainer
        tag="h1"
        :index="2"
        preset="fadeIn"
        class="mb-4 text-2xl font-bold text-gray-900 md:text-3xl">
        Упс! Страница не найдена
      </AnimatedContainer>

      <AnimatedContainer
        tag="p"
        :index="3"
        preset="fadeIn"
        class="mb-8 text-lg leading-relaxed text-gray-600">
        Страница, которую вы ищете, была удалена, переименована или временно
        недоступна.
      </AnimatedContainer>

      <AnimatedContainer
        tag="div"
        :index="4"
        preset="fadeIn"
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
      </AnimatedContainer>
    </AnimatedContainer>

    <AnimatedContainer
      tag="div"
      :index="5"
      preset="fadeIn"
      class="bg-primary-100 absolute top-10 left-10 h-20 w-20 rounded-full opacity-50 blur-xl" />
    <AnimatedContainer
      tag="div"
      :index="6"
      preset="fadeIn"
      class="absolute right-10 bottom-10 h-32 w-32 rounded-full bg-gray-200 opacity-30 blur-2xl" />
    <AnimatedContainer
      tag="div"
      :index="7"
      preset="fadeIn"
      class="bg-primary-200 absolute top-1/2 left-1/4 h-16 w-16 rounded-full opacity-40 blur-lg" />
  </div>
</template>
