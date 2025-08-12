// Композиция для рантайм‑управления темой/токенами и профилями PT.
// ВАЖНО: не импортирует компоненты PrimeVue — не мешает tree‑shaking.

import { ref } from 'vue'
import { updatePreset } from '@primeuix/themes'
import { loadTokens, exportTokens } from '@/styles/theme/tokens'
import Preset, { createPresetFromTokens } from '@/styles/theme/presets/aura-brand'
import { useThemeStore } from '@/stores/theme'

const draft = ref(null)

export const useThemeAdapter = () => {
  const theme = useThemeStore()

  const preview = (patch) => {
    // Минимальный предпросмотр: слияние токенов и обновление пресета
    draft.value = structuredClone({ ...exportTokens(), ...patch })
    const preset = createPresetFromTokens(loadTokens(draft.value))
    // Применяем только часть — updatePreset объединяет с текущим
    updatePreset(preset)
  }

  const apply = () => {
    if (!draft.value) return
    const preset = createPresetFromTokens(loadTokens(draft.value))
    updatePreset(preset)
    draft.value = null
  }

  const reset = () => {
    draft.value = null
    // Для каркаса ничего не делаем дополнительно — текущий пресет остаётся активным
  }

  const setDark = (v) => {
    theme.setDark(v)
  }

  const setMode = (next) => {
    return theme.setMode(next)
  }

  return {
    mode: theme.mode,
    dark: theme.dark,
    preview,
    apply,
    reset,
    setDark,
    setMode,
    export: exportTokens,
    PresetDefault: Preset,
  }
}
