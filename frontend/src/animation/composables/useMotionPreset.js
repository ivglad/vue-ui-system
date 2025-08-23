// Генерация пропсов для <Motion> на основе именованных пресетов
import { getPresetByPath } from '../presets/index.js'

const isObject = (v) => v && typeof v === 'object' && !Array.isArray(v)

const deepMerge = (target, source) => {
  const out = { ...target }
  if (!isObject(source)) return out
  for (const [k, v] of Object.entries(source)) {
    out[k] = isObject(v) ? deepMerge(isObject(out[k]) ? out[k] : {}, v) : v
  }
  return out
}

export const m = (name, overrides) => {
  const base = getPresetByPath(name)
  if (!base) return overrides || {}
  // Глубокий клон простыми структурами
  const cloned = JSON.parse(JSON.stringify(base))
  return overrides ? deepMerge(cloned, overrides) : cloned
}

export const useMotionPreset = () => ({ m })
