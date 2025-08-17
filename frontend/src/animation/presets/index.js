/**
 * Централизованные пресеты и константы анимаций
 */

// ==========================================================================
// Animation Presets
// ==========================================================================

export const ANIMATION_PRESETS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 },
  },

  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.25, ease: 'easeOut' },
  },

  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: { duration: 0.25, ease: 'easeOut' },
  },

  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { duration: 0.2, ease: 'easeOut' },
  },
}

// ==========================================================================
// Animation Timing Constants
// ==========================================================================

export const ANIMATION_TIMING = {
  fast: 0.15,
  normal: 0.25,
  slow: 0.4,
  delays: { short: 0.05, medium: 0.1, long: 0.2 },
}

// ==========================================================================
// Easing Functions
// ==========================================================================

export const EASING = {
  easeOut: 'easeOut',
  easeIn: 'easeIn',
  easeInOut: 'easeInOut',
  smooth: [0.25, 0.1, 0.25, 1],
  snappy: [0.4, 0, 0.2, 1],
  gentle: [0.25, 0.46, 0.45, 0.94],
}

// ==========================================================================
// Animation Variants
// ==========================================================================

export const ANIMATION_VARIANTS = {
  staggeredList: {
    container: {
      animate: {
        transition: { staggerChildren: 0.1, delayChildren: 0.1 },
      },
    },
    item: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
      transition: { duration: 0.3, ease: 'easeOut' },
    },
  },
}
