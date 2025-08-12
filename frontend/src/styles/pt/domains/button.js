// PT-домен: Button (соответствует домену PrimeVue)
// Маппинг слотов компонентов кнопок на утилиты.
// Важно: названия ключей компонентов в глобальном PT — в нижнем регистре (primevue.org/passthrough)

const button = {
  // Button
  button: {
    root: {
      // delta-only: только структурные моменты (например, отступ между иконкой и лейблом)
      class: 'gap-2',
    },
    loadingIcon: { class: 'animate-spin' },
    icon: { class: 'text-base' },
    label: { class: 'font-medium' },
    pcBadge: { root: { class: 'ml-2' } },
  },
  // Для остальных компонентов домена — только root
  splitbutton: { root: { class: '' } },
  speeddial: { root: { class: '' } },
}

export default button
