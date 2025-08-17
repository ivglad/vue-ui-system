import { ref, computed } from 'vue'

/**
 * Управление выбором секций UI Showcase с префетчем чанков.
 * Гарантирует минимум одну выбранную секцию.
 * @param {Record<string, Function>} nameToLoader - карта имя -> async loader (из import.meta.glob)
 */
export function useUiShowcase(nameToLoader) {
  const selected = ref(new Set())
  const prefetched = new Set()

  const sectionNames = computed(() => Object.keys(nameToLoader).sort())

  const isSelected = (name) => selected.value.has(name)

  const prefetch = async (name) => {
    const loader = nameToLoader[name]
    if (!loader || prefetched.has(name)) return
    prefetched.add(name)
    try {
      await loader()
    } catch {
      prefetched.delete(name)
    }
  }

  const toggle = async (name, value) => {
    if (value) {
      await prefetch(name)
      selected.value.add(name)
    } else {
      // не позволяем очистить последний выбранный
      if (selected.value.size <= 1 && selected.value.has(name)) return
      selected.value.delete(name)
    }
  }

  const toggleAll = async (value) => {
    if (value) {
      // Выбираем все
      for (const n of sectionNames.value) {
        await prefetch(n)
      }
      selected.value = new Set(sectionNames.value)
    } else {
      // Сбрасываем до одного — выбираем первый
      selected.value = new Set(sectionNames.value.length ? [sectionNames.value[0]] : [])
    }
  }

  const includeList = computed(() => Array.from(selected.value))

  const selectDefault = () => {
    const preferred = 'UiSectionButtons'
    if (sectionNames.value.includes(preferred)) selected.value.add(preferred)
    else if (sectionNames.value.length) selected.value.add(sectionNames.value[0])
  }

  return {
    sectionNames,
    selected,
    includeList,
    isSelected,
    toggle,
    toggleAll,
    prefetch,
    selectDefault,
  }
}
