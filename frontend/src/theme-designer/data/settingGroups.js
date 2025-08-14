/**
 * Setting groups and component organization
 * Defines how settings are grouped and organized in the UI
 */

export const SettingGroups = {
  global: {
    id: 'global',
    name: 'Глобальные настройки',
    icon: 'pi pi-globe',
    description: 'Общие настройки темы, влияющие на все компоненты',
    sections: {
      colors: {
        id: 'colors',
        name: 'Цвета',
        icon: 'pi pi-palette',
        description: 'Основные цветовые палитры темы',
        settings: [
          'colors.primary',
          'colors.surface',
          'colors.success',
          'colors.warning',
          'colors.error',
          'colors.info',
        ],
      },
      typography: {
        id: 'typography',
        name: 'Типографика',
        icon: 'pi pi-font',
        description: 'Настройки шрифтов и текста',
        settings: [
          'typography.fontSize',
          'typography.fontWeight',
          'typography.lineHeight',
          'typography.letterSpacing',
        ],
      },
      spacing: {
        id: 'spacing',
        name: 'Отступы',
        icon: 'pi pi-arrows-alt',
        description: 'Базовые отступы и размеры',
        settings: ['spacing.base', 'spacing.component', 'spacing.section'],
      },
      borders: {
        id: 'borders',
        name: 'Границы',
        icon: 'pi pi-stop',
        description: 'Настройки границ и скругления',
        settings: ['borders.radius', 'borders.width', 'borders.style'],
      },
    },
  },

  components: {
    id: 'components',
    name: 'Компоненты',
    icon: 'pi pi-th-large',
    description: 'Настройки отдельных компонентов и их групп',
    groups: {
      forms: {
        id: 'forms',
        name: 'Формы',
        icon: 'pi pi-list',
        description: 'Элементы форм и ввода данных',
        components: [
          'button',
          'inputtext',
          'select',
          'checkbox',
          'radiobutton',
          'textarea',
          'inputnumber',
        ],
      },
      navigation: {
        id: 'navigation',
        name: 'Навигация',
        icon: 'pi pi-compass',
        description: 'Элементы навигации и меню',
        components: ['tabs', 'menu', 'breadcrumb', 'steps', 'menubar'],
      },
      feedback: {
        id: 'feedback',
        name: 'Обратная связь',
        icon: 'pi pi-info-circle',
        description: 'Уведомления и сообщения',
        components: [
          'toast',
          'message',
          'confirmdialog',
          'dialog',
          'progressbar',
        ],
      },
      data: {
        id: 'data',
        name: 'Данные',
        icon: 'pi pi-table',
        description: 'Отображение и управление данными',
        components: ['datatable', 'card', 'panel', 'accordion', 'fieldset'],
      },
    },
  },

  presets: {
    id: 'presets',
    name: 'Пресеты',
    icon: 'pi pi-bookmark',
    description: 'Готовые темы и шаблоны',
    presets: ['default', 'dark', 'corporate', 'minimal'],
  },
}

// Utility functions for working with setting groups
export const getGroupById = (groupId) => {
  return SettingGroups[groupId] || null
}

export const getSectionById = (groupId, sectionId) => {
  const group = getGroupById(groupId)
  return group?.sections?.[sectionId] || null
}

export const getComponentGroupById = (groupId) => {
  const componentsGroup = SettingGroups.components
  return componentsGroup?.groups?.[groupId] || null
}

export const getAllComponentGroups = () => {
  return Object.values(SettingGroups.components.groups || {})
}

export const getAllGlobalSections = () => {
  return Object.values(SettingGroups.global.sections || {})
}

export const getSettingsForSection = (groupId, sectionId) => {
  const section = getSectionById(groupId, sectionId)
  return section?.settings || []
}

export const getComponentsForGroup = (groupId) => {
  const group = getComponentGroupById(groupId)
  return group?.components || []
}
