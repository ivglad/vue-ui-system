# Структура слоёв стилей

Этот каталог — единственная точка для проектных и адаптерных стилей (SCSS only).

## Слои и порядок импортов
- theme/index.scss — централизованные токены и маппинги компонентов
  - tokens.skin.scss — skin (цвета, контрасты, поверхности)
  - tokens.structure.scss — структура (радиусы, размеры контролов, отступы)
  - components.map.scss — алиасы токенов для компонентов PrimeVue
- primevue/_index.scss — адаптер PT (минимальный структурный слой под PrimeVue)
- components.scss — проектные композиции (app-*)
- common.scss — глобальные штрихи (selection, scrollbar и т.п.)
- main.css — Tailwind-утилиты и алиасы (например, .btn-base) — подключается из index.scss

Важно: в `assets/styles/index.scss` сначала подключайте `theme/index`, затем все слои, потребляющие токены.

## Принципы
- Все переменные определяются в theme/*.scss и применяются через `var(...)`.
- SCSS-компоненты не содержат `:root` — только потребление токенов.
- PT-слой минимален: только структура и «проводка» классов (delta к primeui/tailwind), без дублирования skin.
- Все радиусы через `--radius-control-*`; поверхности через `--surface-*`.

## Где менять внешний вид
- Цвета/поверхности/текст: `theme/tokens.skin.scss`
- Радиусы/размеры/отступы: `theme/tokens.structure.scss`
- Специфика компонента (алиасы): `theme/components.map.scss`

## Алиасы (пример)
- .btn-base, .input-base, .dialog-surface — в `main.css` (Tailwind и CSS-mode через токены).

## Runtime-темизация
- Меняйте значения в `:root` (tokens.skin / tokens.structure) или переключайте пресеты через адаптер темы (Pinia Setup Store).

## Быстрый старт для новичков
1) Где менять цвета и размеры
   - Цвета/контрасты/поверхности: `theme/tokens.skin.scss` (`--primary-*`, `--surface-*`, `--text-*`, `--content-*`, `--highlight-*`).
   - Размеры контролов/радиусы/отступы/иконки/переходы: `theme/tokens.structure.scss` (`--control-*`, `--radius-control-*`, `--gap-inline-*`, `--icon-size-*`, `--transition-*`).
   - Компонентные алиасы PrimeVue: `theme/components.map.scss` (например, `--p-dialog-*`, `--p-button-*`).

2) Как подключаются слои
   - В `assets/styles/index.scss` первым импортируется `theme/index.scss`, затем `primevue/_index.scss`, затем `components.scss` и `common.scss`.
   - `main.css` — слой Tailwind-утилит и небольших алиасов (.btn-base, .input-base, .dialog-surface), импортируется внутри `index.scss`.

3) Tailwind vs CSS‑mode
   - В обычном режиме используйте утилиты Tailwind и ui-* классы из `tailwindcss-primeui`.
   - В CSS‑mode (`.css-mode` на `<html>`) используйте `.btn-base`, `.input-base`, `.dialog-surface` — они питаются от тех же токенов.

4) Что запрещено
   - Не объявлять локальные `:root` в файлах компонентов.
   - Не использовать `--p-*` напрямую вне `theme/` (разрешены только алиасы из `components.map.scss`).
   - Не писать «магические» значения — всегда заводить токен.

5) Где смотреть примеры
   - Карта токенов: `theme/TOKENS_MAP.md` — соответствия PrimeVue → централизованные токены.
   - Минимальный PT-слой: `assets/styles/primevue/*.scss`.
