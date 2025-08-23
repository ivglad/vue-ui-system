// Подбор пресета для переходов страниц на основе route.meta
import { m } from './useMotionPreset.js'

/**
 * route.meta.motionPreset — строка, например 'page.fade' | 'page.slideLeft' | 'page.slideRight' | 'page.scaleFade' | 'page.autoSlide'
 * route.meta.motionDirection — опционально: 'forward' | 'back'
 */
// Композабл: выбирает пресет анимации для маршрута
export const useRouteMotion = () => {
  const DEFAULT_PRESET = 'page.fade'

  // Возвращает пропсы Motion по route.meta с учётом направления
  const routeMotion = (route, overrides) => {
    const meta = route?.meta || {}
    let preset =
      typeof meta.motionPreset === 'string' ? meta.motionPreset : DEFAULT_PRESET
    const direction = meta.motionDirection

    if (preset === 'page.autoSlide' && direction) {
      preset = direction === 'back' ? 'page.slideRight' : 'page.slideLeft'
    }

    return m(preset, overrides)
  }

  return { routeMotion }
}
