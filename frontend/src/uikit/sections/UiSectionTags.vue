<script setup>
// Явное имя компонента для корректной работы KeepAlive :include
defineOptions({ name: 'UiSectionTags' })
</script>

<template>
  <UiShowcaseTable title="Tags">
    <div class="content">
      <div class="items-start">
        <Tag value="Primary"></Tag>
        <Tag severity="secondary" value="Secondary"></Tag>
        <Tag severity="success" value="Success"></Tag>
        <Tag severity="info" value="Info"></Tag>
        <Tag severity="warn" value="Warn"></Tag>
        <Tag severity="danger" value="Danger"></Tag>
        <Tag severity="contrast" value="Contrast"></Tag>
      </div>
    </div>
  </UiShowcaseTable>
</template>
