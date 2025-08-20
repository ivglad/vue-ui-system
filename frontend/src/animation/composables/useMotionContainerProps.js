// Вспомогательный композабл для расчёта пропов MotionContainer
export const useMotionContainerProps = (props) => {
  const { createAnimationProps, STAGGER } = useMotionSystem()

  const effectiveDelay = computed(() => {
    if (typeof props.delay === 'number') return props.delay
    const base =
      typeof props.baseDelay === 'number' ? props.baseDelay : STAGGER.base
    const step =
      typeof props.stepDelay === 'number' ? props.stepDelay : STAGGER.step
    const idx = typeof props.index === 'number' ? props.index : 0
    return base + idx * step
  })

  const baseProps = computed(() =>
    createAnimationProps(props.preset, props.overrides, effectiveDelay.value),
  )

  const extraProps = computed(() => {
    const extras = {}
    if (props.inView) {
      extras['in-view'] =
        props.inView === true ? baseProps.value?.animate || {} : props.inView
      if (props.inViewOptions) extras['in-view-options'] = props.inViewOptions
    }
    if (props.hover && typeof props.hover === 'object')
      extras.hover = props.hover
    if (props.press && typeof props.press === 'object')
      extras.press = props.press
    return extras
  })

  const layoutTransition = computed(
    () =>
      props.transitionLayout ?? {
        type: 'spring',
        bounce: 0.2,
        duration: ANIMATION_TIMING.layout,
      },
  )

  const revealEnabled = computed(() =>
    typeof props.reveal === 'boolean' ? props.reveal : props.item,
  )

  const presenceModeValue = computed(() => {
    if (props.presenceMode === true) return 'wait'
    if (typeof props.presenceMode === 'string') return props.presenceMode
    return undefined
  })

  const outerMotionProps = computed(() => {
    if (!props.item) {
      return { ...baseProps.value, ...extraProps.value }
    }
    const exitDefault = { opacity: 0 }
    const merged = {
      ...extraProps.value,
      transition: layoutTransition.value,
      exit: exitDefault,
    }
    if (props.overrides && typeof props.overrides === 'object') {
      return { ...merged, ...props.overrides }
    }
    return merged
  })

  const revealDelayValue = computed(() =>
    typeof props.revealDelay === 'number'
      ? props.revealDelay
      : ANIMATION_TIMING.layout + effectiveDelay.value,
  )

  const innerRevealOverrides = computed(() => ({
    transition: {
      delay: revealDelayValue.value,
      duration: ANIMATION_TIMING.enter,
      ease: EASING.easeOut,
    },
  }))

  return {
    effectiveDelay,
    baseProps,
    extraProps,
    layoutTransition,
    revealEnabled,
    presenceModeValue,
    outerMotionProps,
    revealDelayValue,
    innerRevealOverrides,
  }
}
