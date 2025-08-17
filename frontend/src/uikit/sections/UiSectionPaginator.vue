<script setup>
// Явное имя компонента для корректной работы KeepAlive :include
defineOptions({ name: 'UiSectionPaginator' })
</script>

<template>
  <UiShowcaseTable title="Paginator">
    <div class="w-fit">
      <Paginator
        :rows="10"
        :totalRecords="120"
        :rowsPerPageOptions="[10, 20, 50]"
        :pt="{ pcRowPerPageDropdown: { root: { class: 'ml-10' } } }" />
    </div>
  </UiShowcaseTable>
</template>
