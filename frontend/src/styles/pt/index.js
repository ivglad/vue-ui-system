// Агрегатор PT-профилей по доменам.
// ВАЖНО: здесь нет стилей, только карта слотов → классы.

import form from './domains/form'
import button from './domains/button'
import data from './domains/data'
import panel from './domains/panel'
import overlay from './domains/overlay'
import file from './domains/file'
import menu from './domains/menu'
import chart from './domains/chart'
import messages from './domains/messages'
import media from './domains/media'
import misc from './domains/misc'

// Tailwind‑режим: предполагается использование утилит tailwindcss-primeui
export const ptTailwind = {
  ...form,
  ...button,
  ...data,
  ...panel,
  ...overlay,
  ...file,
  ...menu,
  ...chart,
  ...messages,
  ...media,
  ...misc,
}

// Режим без Tailwind: предполагается использование наших .ui-* утилит
export const ptCss = {
  ...form,
  ...button,
  ...data,
  ...panel,
  ...overlay,
  ...file,
  ...menu,
  ...chart,
  ...messages,
  ...media,
  ...misc,
}

export function getPtProfile(mode = 'tailwind') {
  return mode === 'css' ? ptCss : ptTailwind
}
