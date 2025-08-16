// Глобальная PT-карта для ключевых компонентов PrimeVue
// Минимальный безопасный набор (root-классы). Допускаются Tailwind-утилиты и кастом‑классы.

const pt = {
  button: {
    root: {
      class:
        'group inline-flex items-center justify-center select-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--p-focus-ring-color)] disabled:opacity-[var(--p-disabled-opacity)] disabled:pointer-events-none disabled:cursor-not-allowed [&.p-disabled]:opacity-[var(--p-disabled-opacity)] [&.p-disabled]:pointer-events-none [&.p-disabled]:cursor-not-allowed gap-2 [&.p-button-text]:p-2 [&.p-button-icon-only.p-button-rounded]:p-2 leading-[100%] [&:not([class*=sm]):not([class*=lg])]:font-[inherit] [&:not([class*=sm]):not([class*=lg])]:text-[inherit] [&:not([class*=sm]):not([class*=lg])]:tracking-[inherit] [&.p-button-outlined.app-button-outlined-hover-fill:hover]:text-[var(--p-button-primary-color)] [&.p-button-outlined.app-button-outlined-hover-fill:hover]:border-[var(--p-button-primary-hover-border-color)] [&.p-button-outlined.app-button-outlined-hover-fill:hover]:bg-[var(--p-button-primary-hover-border-color)] [&.p-button-outlined.app-button-outlined-hover-fill:active]:text-[var(--p-button-primary-color)] [&.p-button-outlined.app-button-outlined-hover-fill:active]:border-[var(--p-button-primary-active-border-color)] [&.p-button-outlined.app-button-outlined-hover-fill:active]:bg-[var(--p-button-primary-active-border-color)] [&.p-button-outlined.app-button-outlined-secondary-hover-fill:hover]:text-[var(--p-button-secondary-color)] [&.p-button-outlined.app-button-outlined-secondary-hover-fill:hover]:border-[var(--p-button-secondary-hover-border-color)] [&.p-button-outlined.app-button-outlined-secondary-hover-fill:hover]:bg-[var(--p-button-secondary-hover-border-color)] [&.p-button-outlined.app-button-outlined-secondary-hover-fill:active]:text-[var(--p-button-secondary-color)] [&.p-button-outlined.app-button-outlined-secondary-hover-fill:active]:border-[var(--p-button-secondary-active-border-color)] [&.p-button-outlined.app-button-outlined-secondary-hover-fill:active]:bg-[var(--p-button-secondary-active-border-color)]',
    },
    label: { class: 'whitespace-nowrap group-[.p-button-loading]:hidden' },
    icon: { class: 'shrink-0' },
    loadingIcon: { class: 'shrink-0 animate-spin' },
  },
  inputtext: {
    root: {
      class:
        'transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--p-focus-ring-color)] disabled:opacity-[var(--p-disabled-opacity)] placeholder:text-[var(--p-form-field-placeholder-color)] aria-[invalid=true]:placeholder:text-[var(--p-form-field-invalid-placeholder-color)] [&.p-invalid]:placeholder:text-[var(--p-form-field-invalid-placeholder-color)] aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-[var(--p-form-field-invalid-border-color)] [&.p-invalid]:ring-2 [&.p-invalid]:ring-[var(--p-form-field-invalid-border-color)] leading-[inherit] [&:not([class*=sm]):not([class*=lg])]:font-[inherit] [&:not([class*=sm]):not([class*=lg])]:text-[inherit] [&:not([class*=sm]):not([class*=lg])]:tracking-[inherit] ',
    },
  },
  textarea: {
    root: {
      class:
        'transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--p-focus-ring-color)] disabled:opacity-[var(--p-disabled-opacity)] placeholder:text-[var(--p-form-field-placeholder-color)] aria-[invalid=true]:placeholder:text-[var(--p-form-field-invalid-placeholder-color)] [&.p-invalid]:placeholder:text-[var(--p-form-field-invalid-placeholder-color)] aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-[var(--p-form-field-invalid-border-color)] [&.p-invalid]:ring-2 [&.p-invalid]:ring-[var(--p-form-field-invalid-border-color)] leading-[inherit] [&:not([class*=sm]):not([class*=lg])]:font-[inherit] [&:not([class*=sm]):not([class*=lg])]:text-[inherit] [&:not([class*=sm]):not([class*=lg])]:tracking-[inherit] ',
    },
  },
  select: {
    root: {
      class:
        'cursor-pointer items-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--p-focus-ring-color)] disabled:opacity-[var(--p-disabled-opacity)] disabled:cursor-not-allowed [&.p-disabled]:opacity-[var(--p-disabled-opacity)] [&.p-disabled]:cursor-not-allowed aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-[var(--p-form-field-invalid-border-color)] [&.p-invalid]:ring-2 [&.p-invalid]:ring-[var(--p-form-field-invalid-border-color)] [&_[data-pc-section=overlay]:not(.p-colorpicker-panel-inline)]:mt-2 [&_[data-pc-section=panel]:not(.p-colorpicker-panel-inline)]:mt-2 [&_[data-pc-section=overlay][style*="margin-top"]]:!-mt-2 [&_[data-pc-section=panel][style*="margin-top"]]:!-mt-2',
    },
  },
  multiselect: {
    root: {
      class:
        'cursor-pointer items-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--p-focus-ring-color)] disabled:opacity-[var(--p-disabled-opacity)] disabled:cursor-not-allowed [&.p-disabled]:opacity-[var(--p-disabled-opacity)] [&.p-disabled]:cursor-not-allowed aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-[var(--p-form-field-invalid-border-color)] [&.p-invalid]:ring-2 [&.p-invalid]:ring-[var(--p-form-field-invalid-border-color)] [&_[data-pc-section=overlay]:not(.p-colorpicker-panel-inline)]:mt-2 [&_[data-pc-section=panel]:not(.p-colorpicker-panel-inline)]:mt-2 [&_[data-pc-section=overlay][style*="margin-top"]]:!-mt-2 [&_[data-pc-section=panel][style*="margin-top"]]:!-mt-2',
    },
  },
  selectbutton: {
    root: {
      class:
        'inline-flex flex-wrap items-center gap-2 select-none focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--p-focus-ring-color)] disabled:cursor-not-allowed disabled:opacity-[var(--p-disabled-opacity)] [&.p-disabled]:cursor-not-allowed [&.p-disabled]:opacity-[var(--p-disabled-opacity)]',
    },
  },
  togglebutton: {
    root: {
      class:
        'inline-flex items-center gap-2 select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--p-focus-ring-color)] disabled:cursor-not-allowed disabled:opacity-[var(--p-disabled-opacity)] [&.p-disabled]:cursor-not-allowed [&.p-disabled]:opacity-[var(--p-disabled-opacity)] rounded-[var(--p-border-radius-sm)] px-2 py-2',
    },
  },
  radiobutton: {
    root: {
      class:
        'inline-flex items-center gap-2 select-none cursor-pointer focus-visible:outline-none focus-within:ring-2 focus-within:ring-[var(--p-focus-ring-color)] disabled:opacity-[var(--p-disabled-opacity)] disabled:cursor-not-allowed [&.p-disabled]:opacity-[var(--p-disabled-opacity)] [&.p-disabled]:cursor-not-allowed',
    },
  },
  checkbox: {
    root: {
      class:
        'inline-flex items-center gap-2 select-none cursor-pointer focus-visible:outline-none focus-within:ring-2 focus-within:ring-[var(--p-focus-ring-color)] disabled:opacity-[var(--p-disabled-opacity)] disabled:cursor-not-allowed [&.p-disabled]:opacity-[var(--p-disabled-opacity)] [&.p-disabled]:cursor-not-allowed',
    },
  },
  toggleswitch: {
    root: {
      class:
        'inline-flex items-center gap-2 select-none cursor-pointer focus-visible:outline-none focus-within:ring-2 focus-within:ring-[var(--p-focus-ring-color)] disabled:opacity-[var(--p-disabled-opacity)] disabled:cursor-not-allowed [&.p-disabled]:opacity-[var(--p-disabled-opacity)] [&.p-disabled]:cursor-not-allowed',
    },
  },

  // Overlays
  dialog: {
    root: {
      class:
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--p-focus-ring-color)] [&_[data-pc-section=header]]:p-4 [&_[data-pc-section=content]]:p-4 [&_[data-pc-section=footer]]:p-4 [&_[data-pc-section=overlay]:not(.p-colorpicker-panel-inline)]:mt-2 [&_[data-pc-section=panel]:not(.p-colorpicker-panel-inline)]:mt-2 [&_[data-pc-section=overlay][style*="margin-top"]]:!-mt-2 [&_[data-pc-section=panel][style*="margin-top"]]:!-mt-2',
    },
  },
  drawer: {
    root: {
      class:
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--p-focus-ring-color)] [&_[data-pc-section=header]]:p-4 [&_[data-pc-section=content]]:p-4 [&_[data-pc-section=footer]]:p-4 [&_[data-pc-section=overlay]:not(.p-colorpicker-panel-inline)]:mt-2 [&_[data-pc-section=panel]:not(.p-colorpicker-panel-inline)]:mt-2 [&_[data-pc-section=overlay][style*="margin-top"]]:!-mt-2 [&_[data-pc-section=panel][style*="margin-top"]]:!-mt-2',
    },
  },
  popover: {
    root: {
      class:
        'p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--p-focus-ring-color)] [&_[data-pc-section=content]]:p-2 [&_[data-pc-section=overlay]:not(.p-colorpicker-panel-inline)]:mt-2 [&_[data-pc-section=panel]:not(.p-colorpicker-panel-inline)]:mt-2 [&_[data-pc-section=overlay][style*="margin-top"]]:!-mt-2 [&_[data-pc-section=panel][style*="margin-top"]]:!-mt-2',
    },
  },
  menu: {
    root: {
      class:
        'p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--p-focus-ring-color)] [&_[data-pc-section=item]]:rounded-[var(--p-border-radius-sm)] [&_[data-pc-section=item]]:px-3 [&_[data-pc-section=item]]:py-2 [&_.p-disabled]:opacity-[var(--p-disabled-opacity)] [&_.p-disabled]:pointer-events-none [&_[data-pc-section=overlay]:not(.p-colorpicker-panel-inline)]:mt-2 [&_[data-pc-section=panel]:not(.p-colorpicker-panel-inline)]:mt-2 [&_[data-pc-section=overlay][style*="margin-top"]]:!-mt-2 [&_[data-pc-section=panel][style*="margin-top"]]:!-mt-2',
    },
  },
  tieredmenu: {
    root: {
      class:
        'p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--p-focus-ring-color)] [&_[data-pc-section=item]]:rounded-[var(--p-border-radius-sm)] [&_[data-pc-section=item]]:px-3 [&_[data-pc-section=item]]:py-2 [&_[data-pc-section=submenuLabel]]:px-3 [&_[data-pc-section=submenuLabel]]:py-2 [&_.p-disabled]:opacity-[var(--p-disabled-opacity)] [&_.p-disabled]:pointer-events-none [&_[data-pc-section=overlay]:not(.p-colorpicker-panel-inline)]:mt-2 [&_[data-pc-section=panel]:not(.p-colorpicker-panel-inline)]:mt-2 [&_[data-pc-section=overlay][style*="margin-top"]]:!-mt-2 [&_[data-pc-section=panel][style*="margin-top"]]:!-mt-2',
    },
  },
  overlaypanel: {
    root: {
      class:
        'p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--p-focus-ring-color)] [&_[data-pc-section=content]]:p-2 [&_[data-pc-section=overlay]:not(.p-colorpicker-panel-inline)]:mt-2 [&_[data-pc-section=panel]:not(.p-colorpicker-panel-inline)]:mt-2 [&_[data-pc-section=overlay][style*="margin-top"]]:!-mt-2 [&_[data-pc-section=panel][style*="margin-top"]]:!-mt-2',
    },
  },
}

export default pt
