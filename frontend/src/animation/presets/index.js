// Агрегация всех пресетов и функции поиска по имени
import elementPresets from './element.js'
import listPresets from './list.js'
import pagePresets from './page.js'

export const PRESETS = {
  element: elementPresets,
  list: listPresets,
  page: pagePresets,
}

/**
 * Возвращает пресет по строковому пути, например:
 * - 'element.fade'
 * - 'list.spring' (контейнер)
 * - 'list.spring.parent' (контейнер)
 * - 'list.spring.item' (элемент)
 */
export const getPresetByPath = (path) => {
  if (!path || typeof path !== 'string') return null
  const parts = path.split('.')
  let node = PRESETS
  for (const p of parts) {
    node = node?.[p]
    if (!node) break
  }
  // Для 'list.spring' вернуть контейнер
  if (node && node.parent && !('initial' in node || 'animate' in node || 'exit' in node || 'layout' in node)) {
    return node.parent
  }
  // Для 'list.spring' если выше логика не сработала по какой-то причине
  if (!node && parts.length === 2 && parts[0] === 'list') {
    const grp = PRESETS.list?.[parts[1]]
    if (grp?.parent) return grp.parent
  }
  return node ?? null
}
