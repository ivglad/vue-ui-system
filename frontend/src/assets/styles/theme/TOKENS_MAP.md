# Карта токенов (PrimeVue → централизованные токены)

Ниже приведены ключевые токены компонентов PrimeVue и то, чем они питаются из централизованных слоёв.
Все значения переопределяются в `theme/tokens.skin.scss` (skin) и `theme/tokens.structure.scss` (structure).

- __Общее__
  - Радиусы: `--radius-control-sm|md|lg` (fallback: `--p-border-radius-*`)
  - Поверхности: `--surface-50|0|100|200|300|400|500|600|700|800|900|950` (fallback: `--p-surface-*`)
  - Текст: `--text-color`, `--text-muted-color` (fallback: `--p-text-*`)
  - Primary: `--primary-color`, `--primary-contrast-color`, `--primary-50|100|200|300|400|500|600|700|800|900|950` (fallback: `--p-primary-*`)
  - Content/Highlight: `--content-background`, `--content-border-color`, `--highlight-background` (fallback: `--p-content-*`, `--p-highlight-background`)
  - Переходы: `--transition-fast`, `--transition-normal` (замена `--p-transition-duration`)

- __Button__ (`theme/components.map.scss` + `primevue/button.scss`)
  - Размеры/радиусы: `--radius-control-sm|md|lg`
  - Цвета/границы (severities):
    - Filled: `--p-button-<severity>-(color|border-color)`
    - Outlined: `--p-button-outlined-<severity>-(hover|active)-(color|border-color)`
    - Text: `--p-button-text-<severity>-(hover|active)-color`
  - Контраст: `--text-color`, `--surface-0`

- __ConfirmDialog__ (`theme/components.map.scss`, `primevue/confirmdialog.scss`)
  - Пробелы: `--p-confirmdialog-header-gap`, `--p-confirmdialog-footer-gap`, `--p-confirmdialog-content-padding`
  - Заголовок: `--p-confirmdialog-title-font-size`, `--p-confirmdialog-title-font-weight`
  - Алиасы (совместимость): `--p-confirmdialog-title-fontSize`, `--p-confirmdialog-title-fontWeight`

- __InputText__ (`theme/components.map.scss`, `primevue/inputtext.scss`)
  - Размеры: `--p-inputtext-app-(min-height|sm-min-height|lg-min-height)`, `--p-inputtext-app-sm-font-size`
  - Плейсхолдеры: `--p-inputtext-placeholder-color` → `--surface-200`
  - Invalid placeholder: `--p-inputtext-invalid-placeholder-color` → `--surface-400`

- __Tooltip__ (`theme/components.map.scss`, `primevue/tooltip.scss`)
  - Поверхность/фон стрелки: `--p-tooltip-app-surface` → `--surface-0`
  - Радиус: `--radius-control-md`
  - Текст: `--text-color`

- __ToggleButton__ (`theme/components.map.scss`, `primevue/togglebutton.scss`)
  - Радиус контента: `--p-togglebutton-content-border-radius` → `--radius-control-sm`

- __MultiSelect / Popover (app-level)__ (`assets/styles/components.scss`)
  - Радиусы оверлея: `--radius-control-lg`
  - Фоны/текст: `--surface-*`, `--text-color`

## Где менять значения
- Skin (цвета/поверхности/контрасты): `theme/tokens.skin.scss`
- Structure (радиусы/размеры/отступы): `theme/tokens.structure.scss`
- Компонентные алиасы/маппинги: `theme/components.map.scss`

## Правила
- Не объявляем локальные `:root` в файлах компонентов, только используем `var(...)`.
- p-* используются только как fallback внутри централизованных токенов.
- Любые «магические» цвета/значения заменяем на токены.
