// Генерация пропсов для <Motion> на основе именованных пресетов
import { getPresetByPath } from '../presets/index.js'

// Проверяет, что значение — обычный объект
const isObject = (v) => v && typeof v === 'object' && !Array.isArray(v)

// Глубоко мержит два простых объекта
const deepMerge = (target, source) => {
  const out = { ...target }
  if (!isObject(source)) return out
  for (const [k, v] of Object.entries(source)) {
    out[k] = isObject(v) ? deepMerge(isObject(out[k]) ? out[k] : {}, v) : v
  }
  return out
}

// Возвращает пропсы Motion по имени пресета с учётом overrides
export const m = (name, overrides) => {
  const base = getPresetByPath(name)
  if (!base) return overrides || {}
  // Глубокий клон простыми структурами
  const cloned = JSON.parse(JSON.stringify(base))
  return overrides ? deepMerge(cloned, overrides) : cloned
}

// Композабл: предоставляет функцию m()
export const useMotionPreset = () => ({ m })
