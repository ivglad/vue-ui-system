import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getPtProfile } from '@/styles/pt'

const STORAGE_KEY = 'app:theme'

// Setup Store (Composition API)
export const useThemeStore = defineStore('theme', () => {
  // state
  const mode = ref('tailwind') // 'tailwind' | 'css'
  const dark = ref(false)
  const density = ref('md')
  const radius = ref('md')
  const _inited = ref(false)

  // getters
  const ptProfile = computed(() => getPtProfile(mode.value))

  // actions
  const init = () => {
    if (_inited.value) return
    try {
      const raw = typeof localStorage !== 'undefined' && localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const saved = JSON.parse(raw)
        if (saved && typeof saved === 'object') {
          if (saved.mode === 'css' || saved.mode === 'tailwind') mode.value = saved.mode
          if (typeof saved.dark === 'boolean') dark.value = saved.dark
          if (typeof saved.density === 'string') density.value = saved.density
          if (typeof saved.radius === 'string') radius.value = saved.radius
        }
      }
    } catch {}
    applyDarkClass()
    applyModeClass()
    _inited.value = true
  }

  const setMode = (next) => {
    mode.value = next === 'css' ? 'css' : 'tailwind'
    applyModeClass()
    persist()
    return ptProfile.value
  }

  const toggleDark = () => {
    setDark(!dark.value)
  }

  const setDark = (val) => {
    dark.value = !!val
    applyDarkClass()
    persist()
  }

  const setDensity = (val) => {
    density.value = val
    persist()
  }

  const setRadius = (val) => {
    radius.value = val
    persist()
  }

  const applyDarkClass = () => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark-mode', dark.value)
    }
  }

  const applyModeClass = () => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('css-mode', mode.value === 'css')
    }
  }

  const persist = () => {
    try {
      if (typeof localStorage === 'undefined') return
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          mode: mode.value,
          dark: dark.value,
          density: density.value,
          radius: radius.value,
        })
      )
    } catch {}
  }

  return {
    // state
    mode,
    dark,
    density,
    radius,
    _inited,
    // getters
    ptProfile,
    // actions
    init,
    setMode,
    toggleDark,
    setDark,
    setDensity,
    setRadius,
    applyDarkClass,
    applyModeClass,
    persist,
  }
})
