// PT-домен: Overlay (соответствует домену PrimeVue)
// Важно: глобальные ключи компонентов указываются в нижнем регистре.
const overlay = {
  // Dialog — ключи из скриншота
  dialog: {
    // delta-only: skin (скругления, отступы, границы, тени, цвета) задаются пресетом.
    // Оставляем только композицию и выравнивание для действий в заголовке.
    root: { class: '' },
    header: { class: '' },
    title: { class: '' },
    headerActions: { class: 'ml-auto flex items-center gap-2' },
    pcMaximizeButton: { root: { class: '' } },
    pcCloseButton: { root: { class: '' } },
    content: { class: '' },
    footer: { class: '' },
    mask: { class: '' },
  },
  // Остальные overlay — только root
  drawer: { root: { class: '' } },
  overlaypanel: { root: { class: '' } },
  tooltip: { root: { class: '' } },
  popover: { root: { class: '' } },
  confirmdialog: { root: { class: '' } },
  confirmpopup: { root: { class: '' } },
  sidebar: { root: { class: '' } },
}
export default overlay

