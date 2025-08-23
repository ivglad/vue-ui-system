// Пресеты анимаций для списков
import {
  DURATION_SM,
  DURATION_XS,
  DURATION_LAYOUT,
  BOUNCE,
} from './constants.js'

export const listPresets = {
  spring: {
    layout: true,
    transition: {
      duration: DURATION_SM,
      delay: DURATION_XS,
      layout: {
        type: 'spring',
        bounce: BOUNCE,
        duration: DURATION_LAYOUT,
      },
    },
    initial: { x: 16, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 16, opacity: 0, transition: { duration: DURATION_XS } },
  },
}

export default listPresets
