<script setup>
// Явное имя компонента для корректной работы KeepAlive :include
defineOptions({ name: 'UiSectionFonts' })
</script>

<template>
  <UiShowcaseTable title="Fonts">
    <div class="content">
      <div>
        <div class="flex items-center gap-1">
          <span>Inter</span>
          <span>Regular</span>
          <span class="font-semibold">Semibold</span>
          <span class="font-bold">Bold</span>
        </div>
        <span>Fluid text:</span>
        <div class="flex items-center gap-1">
          <div class="ui-typo-col mr-10">
            <span class="ui-h1 font-bold">H1:</span>
            <span class="ui-h2 font-bold">H2:</span>
            <span class="ui-h3 font-bold"
              >H3 <br />
              bold:</span
            >
            <span class="ui-h3 font-semibold"
              >H3 <br />
              semibold:</span
            >
            <span class="ui-h3"
              >H3 <br />
              regular:</span
            >
            <span class="ui-h4 font-bold"
              >H4 <br />
              bold:</span
            >
            <span class="ui-h4 font-semibold"
              >H4 <br />
              semibold:</span
            >
            <span class="ui-h4"
              >H4 <br />
              regular:</span
            >
            <span class="ui-h5 font-bold"
              >H5 <br />
              bold:</span
            >
            <span class="ui-h5 font-semibold"
              >H5 <br />
              semibold:</span
            >
            <span class="ui-h5"
              >H5 <br />
              regular:</span
            >
          </div>
          <div class="ui-typo-col">
            <span class="ui-h1 font-bold">Система предназначена</span>
            <span class="ui-h2 font-bold">Система предназначена</span>
            <span class="ui-h3 font-bold">Система предназначена</span>
            <span class="ui-h3 font-semibold"> Система предназначена </span>
            <span class="ui-h3">Система предназначена</span>
            <span class="ui-h4 font-bold">Система предназначена</span>
            <span class="ui-h4 font-semibold"> Система предназначена </span>
            <span class="ui-h4">Система предназначена</span>
            <span class="ui-h5 font-bold">Система предназначена</span>
            <span class="ui-h5 font-semibold"> Система предназначена </span>
            <span class="ui-h5">Система предназначена</span>
          </div>
        </div>
      </div>
    </div>
  </UiShowcaseTable>
</template>

<style scoped>
@reference "@/assets/styles/tailwind.css";

.ui-typo-col {
  @apply flex flex-col gap-4;
}
.ui-h1 {
  @apply text-[clamp(20px,4vw,40px)];
}
.ui-h2 {
  @apply text-[clamp(18px,2.5vw,24px)];
}
.ui-h3 {
  @apply text-[16px];
}
.ui-h4 {
  @apply text-[14px];
}
.ui-h5 {
  @apply text-[12px];
}
</style>
