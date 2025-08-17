<script setup>
// Явное имя компонента для корректной работы KeepAlive :include
defineOptions({ name: 'UiSectionSwitches' })

const switchesState = ref(false)

// Определение вариантов и состояний для переключателей
const switchStates = ['Default', 'Disabled']
const switchVariants = ['Default']
</script>

<template>
  <UiShowcaseTable
    title="Switches"
    :states="switchStates"
    :variants="switchVariants">
    <!-- Default -->
    <template #default-default>
      <ToggleSwitch v-model="switchesState" />
    </template>
    <template #default-disabled>
      <ToggleSwitch v-model="switchesState" disabled />
    </template>
  </UiShowcaseTable>
</template>
