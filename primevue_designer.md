# PrimeVue Styled Mode — Дизайн‑система и Theme Designer (исследование)

Ниже — подробный конспект по устройству дизайн‑системы PrimeVue v4 (styled mode), механизму пресетов `@primeuix/themes`, API конфигурации и возможностям визуального Theme Designer. Документ предназначен как база для реализации собственного дизайнера тем.

Полезные ссылки: [Configuration](https://primevue.org/configuration/), [Styled Theming](https://primevue.org/theming/styled/), [Tailwind Integration](https://primevue.org/tailwind/), [Theme Designer](https://primevue.org/designer/), исходники [`primefaces/primevue`](https://github.com/primefaces/primevue).

## 1) Базовые понятия Styled Mode

- Дизайн‑токены и CSS‑переменные. Пример: `primary.color` → `var(--p-primary-color)`.
- Пакет пресетов: `@primeuix/themes` предоставляет готовые темы (Aura/Material/Lara/Nora) и утилиты: `definePreset`, `updatePreset`, `updatePrimaryPalette`, `updateSurfacePalette`, `usePreset`, `useTheme` (см. `node_modules/@primeuix/themes/dist/index.mjs`).
- Сводный пресет Aura: `node_modules/@primeuix/themes/dist/aura/index.mjs` (агрегирует `base` и токены компонентов).
- Полный перечень токенов и описаний: `node_modules/@primeuix/themes/tokens/index.d.mts`.
- Подключение темы в приложении:

```js
import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";

app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: { prefix: "p", darkModeSelector: "system", cssLayer: false },
  },
});
```

## 2) Иерархия токенов

- Primitive: палитры (emerald, indigo, zinc и т. п.), а также базовые величины (`rounded.*`, `transition.duration`, `icon.size`).
- Semantic: производные токены — `primary` (50–950 + агрегаты `color/hoverColor/activeColor/inverseColor`), `surface` (0–950), `text`, `content`, `focusRing`, `formField`, `mask` и т. д. Разделяются по `colorScheme.light` и `colorScheme.dark`.
- Component tokens: для каждого компонента определены секции `root/content/icon` и состояния (`hover/active/focus/disabled`) и размеры; значения обычно как ссылки на semantic/primitives в виде `{...}`.

## 3) Генерация CSS

- `options.prefix: string` — префикс CSS‑переменных (`'my'` → `--my-primary-color`).
- `options.darkModeSelector: 'system' | string | false` — системная тёмная тема (media‑query), либо селектор класса (напр. `.my-app-dark`), либо отключено.
- `options.cssLayer: false | { name: string; order?: string }` — размещение стилей в каскадном слое. Рекомендуется при совместном использовании с Tailwind (см. ниже).

## 4) Статическая настройка пресета

```js
import { definePreset } from "@primeuix/themes";
import Aura from "@primeuix/themes/aura";

const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: "{indigo.50}",
      100: "{indigo.100}",
      200: "{indigo.200}",
      300: "{indigo.300}",
      400: "{indigo.400}",
      500: "{indigo.500}",
      600: "{indigo.600}",
      700: "{indigo.700}",
      800: "{indigo.800}",
      900: "{indigo.900}",
      950: "{indigo.950}",
    },
    focusRing: {
      width: "2px",
      style: "dashed",
      color: "{primary.color}",
      offset: "1px",
    },
  },
  components: {
    card: {
      colorScheme: {
        light: {
          root: { background: "{surface.0}", color: "{surface.700}" },
          subtitle: { color: "{surface.500}" },
        },
        dark: {
          root: { background: "{surface.900}", color: "{surface.0}" },
          subtitle: { color: "{surface.400}" },
        },
      },
    },
  },
});
```

Кастомные токены и глобальный CSS:

```js
const MyMore = definePreset(Aura, {
  components: {
    button: {
      extend: { accent: { color: "#f59e0b", inverseColor: "#fff" } },
      css: ({ dt }) =>
        `.p-button-accent{background:${dt("button.accent.color")};color:${dt(
          "button.accent.inverse.color"
        )};}`,
    },
  },
  extend: { my: { transition: { fast: "0.25s" }, imageDisplay: "block" } },
  css: ({ dt }) => `img{display:${dt("my.image.display")};}`,
});
```

## 5) Динамика в рантайме

- `updatePreset(partial)` — слияние части токенов с текущим пресетом.
- Шорткаты: `updatePrimaryPalette(palette)`, `updateSurfacePalette(palette)`.
- `usePreset(preset)` — полная замена активного пресета.
- `$dt(name)` — получить `{ name, variable, value }` токена;
- `palette(color)` — генерация оттенков 50–950 из хекса или набора (`palette('{blue}')`).

## 6) Светлая/тёмная схема и Tailwind

```js
app.use(PrimeVue, {
  theme: { preset: Aura, options: { darkModeSelector: ".my-app-dark" } },
});
```

```css
@import "tailwindcss";
@import "tailwindcss-primeui";
@custom-variant dark (&:where(.my-app-dark, .my-app-dark *));
```

CSS Layers (пример порядка для безопасных override Tailwind):

```js
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      cssLayer: {
        name: "primevue",
        order: "tailwind-base, primevue, tailwind-utilities",
      },
    },
  },
});
```

```css
@layer tailwind-base, primevue, tailwind-utilities;

@layer tailwind-base {
  @tailwind base;
}
@layer tailwind-utilities {
  @tailwind components;
  @tailwind utilities;
}
```

Примечание: в проекте используется только Tailwind v4; конфигурации v3 не рассматриваются.

## 7) Pass‑Through и локальные `dt`

Локальные токены конкретного экземпляра:

```vue
<ToggleSwitch
  :dt="{
    colorScheme: { light: { root: { checkedBackground: '{amber.500}' } } },
  }"
/>
```

Pass‑Through (классы/атрибуты на внутренние элементы):

```vue
<Panel
  header="Header"
  :pt="{
    root: 'border rounded-xl',
    title: 'text-xl',
    content: 'text-primary-700',
  }"
/>
```

Можно задать глобально при установке: `app.use(PrimeVue, { pt: { button: { root: '...', label: '...' } } })`.

## 8) Theme Designer (визуальный редактор)

- Primitive: палитры (Emerald… Indigo…) и блок Rounded (none/xs/sm/md/lg/xl).
- Semantic: General (primary, transitions, icon.size, border.radius, mask.\*), Focus Ring (width/style/color/offset), Form Field (base/small/large: paddingX/Y, borderRadius, transition.duration + свой focus ring), прочие семантические секции.
- Component: токены по компонентам с раздельными схемами Light/Dark и состояниями.
- Custom: добавление пользовательских токенов (имя без `{}`, значение — литерал или ссылка `{...}`) → попадают в `extend` пресета и доступны через `dt('my.token')`.
- Settings: `options.prefix`, `options.darkModeSelector`, `options.cssLayer`, импорт/экспорт тем.
- Действия: Apply (применить), Download (экспорт JS пресета и опций). В расширенных планах — облако, миграция, Figma→Theme.

### 8.1 Полный перечень опций пресета для нового дизайнера

Глобальные поля (верхний уровень результата `definePreset(base, tokens)`):

- `semantic`

  - `primary.{50..950}` — числовая палитра.
  - `surface.{0,50..950}` — шкала поверхностей.
  - `text.color`, `text.hover.color`, `text.muted.color`, `text.hover.muted.color`.
  - `content.background`, `content.hover.background`, `content.border.color`, `content.color`.
  - `mask.background`, `mask.color`.
  - `focusRing.{width,style,color,offset}`.
  - `formField` (зависимые от полей формы):
    - `bg`, `color`, `icon.color`, `shadow`.
    - `border.color`, `hover.border.color`, `focus.border.color`, `invalid.border.color`.
    - `disabled.bg`, `disabled.color`, `placeholder`, `invalid.placeholder`.
    - `filled.bg`, `filled.hover.bg`, `filled.focus.bg`.
    - `floatLabel.{color,focus.color,active.color,invalid.color}`.
  - `colorScheme.light` / `colorScheme.dark` — переопределения всех перечисленных групп для режимов.

- `components` — объект со всеми компонентами PrimeVue. Для каждого компонента существует список токенов. Полный перечень получен из `node_modules/@primeuix/themes/tokens/index.mjs` и доступен в файлах `primevue_tokens.json` (детально) и `primevue_tokens_counts.md` (сводка количества токенов по компонентам) в корне репозитория. Ключевые группы токенов по распространённым компонентам:

  - `button`

    - Базовые размеры: `border.radius`, `rounded.border.radius`, `gap`, `padding.x/y`, `icon.only.width`, `label.font.weight`.
    - Размеры вариантов: `sm.font.size`, `sm.padding.x/y`, `lg.font.size`, `lg.padding.x/y`.
    - Визуальные параметры: `raised.shadow`, `focus.ring.{width,style,color,offset,shadow}`, `transition.duration`, `badge.size`.
    - Варианты по серьезности: `primary|secondary|success|info|warn|help|danger|contrast` с полями `background|hover.background|active.background|border.color|hover.border.color|active.border.color|color|hover.color|active.color|focus.ring.color|focus.ring.shadow`.
    - Вариант `outlined.*` для каждой серьезности: `hover.background`, `active.background`, `border.color`, `color`.

  - `inputtext`/`textarea`/`select`/`treeselect`

    - `background`, `disabled.background`, `filled.background/hover/focus`, `border.color`, `hover.border.color`, `focus.border.color`, `invalid.border.color`.
    - `color`, `disabled.color`, `placeholder.color`, `invalid.placeholder.color`.
    - `shadow`, `padding.x/y`, `border.radius`, `focus.ring.{width,style,color,offset,shadow}`, `transition.duration`.
    - Размеры: `sm.font.size`, `sm.padding.x/y`, `lg.font.size`, `lg.padding.x/y`.
    - Для `select` и `treeselect` дополнительно: `dropdown.width`, `dropdown.color`, `overlay.{background,border.color,border.radius,color,shadow}`, списки: `list.padding`, `list.gap`, `option.*` (focus/selected/background/color/padding/border.radius), отметки `checkmark.*`, `empty.message.padding`.

  - `datatable`

    - Границы/шапка/строки/футер: `border.color`, `header.*`, `row.*`, `body.cell.*`, `footer.*`.
    - Состояния/фокус: `focus.ring.*` для ячеек и строк.
    - Утилиты: `column.resizer.width`, `resize.indicator.{width,color}`, `sort.icon.{color,hover.color,size}`, `loading.icon.size`.
    - Фильтры: `filter.overlay.select.*`, `filter.overlay.popover.*`, `filter.constraint.*`.
    - Пагинация: `paginator.top|bottom.border.{color,width}`.

  - `dialog`

    - `background`, `border.color`, `color`, `border.radius`, `shadow`.
    - `header.{padding,gap}`, `title.{font.size,font.weight}`, `content.padding`, `footer.{padding,gap}`.

  - `tabs`/`tabmenu`

    - `transition.duration`, `tablist.*`, `tab.*` (фон/цвет/границы/паддинги/фокус), `tabpanel.*`, `nav.button.*`, `active.bar.*`.

  - `toast`

    - Общие размеры/анимация/контент, кнопка закрытия и наборы для `info|success|warn|error|secondary|contrast` (фон/границы/цвета/тени/фокус кольца).

  - Дополнительно в токенах присутствуют подробные настройки для `radiobutton`, `checkbox`, `slider`, `stepper`, `tree`, `treetable`, `selectbutton`, `togglebutton`, `toggleswitch`, `tooltip`, `panel`, `menubar`, `menu`, `tieredmenu`, `panelmenu`, `megamenu` и др. Их полный список и имена полей см. в `primevue_tokens.json`.

## 9) Рецепты

Смена primary в рантайме:

```js
import { updatePrimaryPalette, palette } from "@primeuix/themes";
updatePrimaryPalette(palette("{blue}"));
```

Замена surfaces для светлой/тёмной схем:

```js
import { updateSurfacePalette } from "@primeuix/themes";
updateSurfacePalette({
  light: { 50: "{zinc.50}", /* … */ 950: "{zinc.950}" },
  dark: { 50: "{slate.50}", /* … */ 950: "{slate.950}" },
});
```

Noir‑режим (использовать `surface` как `primary` + определить `colorScheme.{light,dark}.primary` и `highlight`).

Масштабирование UI: `html { font-size: 14px; }` — компоненты используют `rem`.

## 10) Важные файлы

- `primevue/config/index.mjs` — реэкспорт глобальной конфигурации из `@primevue/core/config`.
- `@primeuix/themes/dist/index.mjs` — утилиты темы (`definePreset`, `update*`, `use*`).
- `@primeuix/themes/dist/aura/index.mjs` — агрегатор токенов пресета Aura.
- `@primeuix/themes/tokens/index.d.mts` — список токенов и покрываемых компонентов.

## 11) Миграция и ограничения

- Начиная с v4 удалены SASS‑темы/`theme.css`; всё основано на токенах и CSS‑переменных. Старые темы необходимо пересоздавать на новом API.
- Для устойчивых override с Tailwind используйте `cssLayer` и корректный порядок слоёв.

## 12) Применение экспорта дизайнера

```js
import { definePreset } from "@primeuix/themes";
import Base from "@primeuix/themes/aura";

const MyPreset = definePreset(Base, {
  /* semantic/components/extend/css */
});

export default {
  preset: MyPreset,
  options: { darkModeSelector: ".my-app-dark", prefix: "p", cssLayer: false },
};
```

Подключение:

```js
import config from "./mytheme.js";
app.use(PrimeVue, { theme: config });
```

—
Документ служит фундаментом для будущей реализации собственного Theme Designer, совместимого с `@primeuix/themes` и расширяющего возможности PrimeVue Designer.
MD
