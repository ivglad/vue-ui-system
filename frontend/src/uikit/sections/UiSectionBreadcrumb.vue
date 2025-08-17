<script setup>
// Явное имя компонента для корректной работы KeepAlive :include
defineOptions({ name: 'UiSectionBreadcrumb' })

const home = ref({ label: 'Вселенная' })
const items = ref([
  { label: 'Планета' },
  { label: 'Континент' },
  { label: 'Страна' },
  { label: 'Город' },
  { label: 'Улица' },
  { label: 'Дом' },
])
</script>

<template>
  <UiShowcaseTable title="Breadcrumb">
    <div class="content">
      <div>
        <div class="gap flex items-center gap-1">
          <Breadcrumb :home="home" :model="items">
            <template #item="{ item }">
              <a class="cursor-pointer" href="#">
                <span>{{ item.label }}</span>
              </a>
            </template>
            <template #separator>
              <i-custom-arrow-right />
            </template>
          </Breadcrumb>
        </div>
      </div>
    </div>
  </UiShowcaseTable>
</template>
