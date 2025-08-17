<script setup>
// Явное имя компонента для корректной работы KeepAlive :include
defineOptions({ name: 'UiSectionProgress' })
</script>

<template>
  <UiShowcaseTable title="Progress">
    <div class="content">
      <div class="flex flex-col gap-2">
        <ProgressBar mode="indeterminate" class="app-progressline" />
        <ProgressBar :value="50" class="app-progressline-percent" />
        <ProgressSpinner class="app-progressspinner" fill="transparent" />
      </div>
    </div>
  </UiShowcaseTable>
</template>
