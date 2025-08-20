// Композабл для расчётов и логики контейнера MotionGroup
// Сохраняет публичный API и переносит вычисления из компонента
export const useMotionGroupProps = (props, attrs) => {
  const { STAGGER, createAnimationProps } = useMotionSystem()

  const MOTION_KEYS = new Set([
    'initial',
    'animate',
    'exit',
    'transition',
    'in-view',
    'in-view-options',
    'hover',
    'press',
  ])

  const hasMotionAttrs = computed(() =>
    Object.keys(attrs || {}).some((k) => MOTION_KEYS.has(k)),
  )

  const effectiveBase = computed(() => {
    if (typeof props.baseDelay === 'number') return props.baseDelay
    if (props.stagger && typeof props.stagger.base === 'number')
      return props.stagger.base
    return STAGGER.base
  })

  const effectiveStep = computed(() => {
    if (typeof props.stepDelay === 'number') return props.stepDelay
    if (props.stagger && typeof props.stagger.step === 'number')
      return props.stagger.step
    return STAGGER.step
  })

  const delayOf = (index) => effectiveBase.value + index * effectiveStep.value

  const shouldUseMotionContainer = computed(
    () => props.layout || props.preset || props.overrides || hasMotionAttrs.value,
  )

  const containerMotionProps = computed(() => {
    if (!shouldUseMotionContainer.value) return {}
    if (!props.preset && !props.overrides) return {}
    return createAnimationProps(props.preset, props.overrides, 0)
  })

  return {
    effectiveBase,
    effectiveStep,
    delayOf,
    shouldUseMotionContainer,
    containerMotionProps,
  }
}
