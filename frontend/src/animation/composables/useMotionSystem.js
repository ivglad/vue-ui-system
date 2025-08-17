// Общая система анимаций приложения (JS). Основана на motion-v и VueUse.
import {
  ANIMATION_PRESETS,
  ANIMATION_VARIANTS,
  ANIMATION_TIMING,
} from '@/animation/presets'

const DEFAULT_PRESET = 'fadeIn'
// Дефолтные параметры стаггера для поочерёдного появления элементов
const DEFAULT_STAGGER = { base: 0.12, step: 0.08 }

function mergeProps(base, overrides) {
  // Плоское объединение ключевых секций анимации с приоритетом overrides
  const result = { ...base }
  if (overrides) {
    if (overrides.initial)
      result.initial = { ...(base.initial || {}), ...overrides.initial }
    if (overrides.animate)
      result.animate = { ...(base.animate || {}), ...overrides.animate }
    if (overrides.exit)
      result.exit = { ...(base.exit || {}), ...overrides.exit }
    if (overrides.transition)
      result.transition = {
        ...(base.transition || {}),
        ...overrides.transition,
      }
    // Прочие ключи (layout и т.п.)
    for (const k of Object.keys(overrides)) {
      if (!['initial', 'animate', 'exit', 'transition'].includes(k)) {
        result[k] = overrides[k]
      }
    }
  }
  return result
}

export function useMotionSystem() {
  const createAnimationProps = (
    preset = DEFAULT_PRESET,
    overrides = {},
    delay = 0,
  ) => {
    const base =
      ANIMATION_PRESETS[preset] || ANIMATION_PRESETS[DEFAULT_PRESET] || {}
    const withDelay = delay
      ? {
          ...base,
          transition: { ...(base.transition || {}), delay },
        }
      : base

    return mergeProps(withDelay, overrides)
  }

  const VARIANTS = computed(() => ANIMATION_VARIANTS)

  return {
    TIMING: ANIMATION_TIMING,
    VARIANTS: VARIANTS.value,
    STAGGER: DEFAULT_STAGGER,
    createAnimationProps,
  }
}
