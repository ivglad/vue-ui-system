<script setup>
import { ComponentDefinitions, getSettingsForComponent } from '../../data/componentDefinitions.js'
import SettingControl from '../controls/SettingControl.vue'

defineOptions({
  name: 'ComponentSection'
})

const props = defineProps({
  componentId: {
    type: String,
    required: true
  },
  currentTheme: {
    type: Object,
    default: () => ({})
  },
  readonly: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update-setting'])

// Computed properties
const componentDefinition = computed(() => {
  return ComponentDefinitions[props.componentId]
})

const componentSettings = computed(() => {
  return getSettingsForComponent(props.componentId)
})

const settingsByCategory = computed(() => {
  const categories = {}
  
  componentSettings.value.forEach(setting => {
    const category = setting.category || 'general'
    if (!categories[category]) {
      categories[category] = []
    }
    categories[category].push(setting)
  })
  
  return categories
})

const categoryOrder = ['appearance', 'spacing', 'typography', 'colors', 'general']

const orderedCategories = computed(() => {
  const ordered = []
  
  // Add categories in preferred order
  categoryOrder.forEach(category => {
    if (settingsByCategory.value[category]) {
      ordered.push({
        id: category,
        name: getCategoryName(category),
        settings: settingsByCategory.value[category]
      })
    }
  })
  
  // Add any remaining categories
  Object.keys(settingsByCategory.value).forEach(category => {
    if (!categoryOrder.includes(category)) {
      ordered.push({
        id: category,
        name: getCategoryName(category),
        settings: settingsByCategory.value[category]
      })
    }
  })
  
  return ordered
})

// Methods
const handleSettingUpdate = (settingId, value) => {
  emit('update-setting', settingId, value)
}

const getSettingValue = (settingId) => {
  return props.currentTheme[settingId]
}

const getCategoryName = (category) => {
  const names = {
    appearance: 'Appearance',
    spacing: 'Spacing',
    typography: 'Typography',
    colors: 'Colors',
    general: 'General'
  }
  return names[category] || category.charAt(0).toUpperCase() + category.slice(1)
}

const getCategoryIcon = (category) => {
  const icons = {
    appearance: 'pi pi-eye',
    spacing: 'pi pi-arrows-alt',
    typography: 'pi pi-font',
    colors: 'pi pi-palette',
    general: 'pi pi-cog'
  }
  return icons[category] || 'pi pi-cog'
}

const getComponentPreview = (componentId) => {
  // Return appropriate preview component based on component ID
  switch (componentId) {
    case 'button':
      return 'Button'
    case 'inputtext':
      return 'InputText'
    case 'select':
      return 'Select'
    case 'checkbox':
      return 'Checkbox'
    case 'tabs':
      return 'TabView'
    default:
      return null
  }
}
</script>

<template>
  <div class="component-section">
    <!-- Component header -->
    <div class="component-section__header">
      <div class="component-section__header-content">
        <div class="component-section__header-info">
          <h2 class="component-section__title">
            {{ componentDefinition?.name || componentId }}
          </h2>
          <p 
            v-if="componentDefinition?.description"
            class="component-section__description"
          >
            {{ componentDefinition.description }}
          </p>
        </div>
        
        <!-- Component preview -->
        <div class="component-section__preview">
          <div class="component-section__preview-container">
            <!-- Button preview -->
            <div 
              v-if="componentId === 'button'"
              class="component-section__preview-content"
            >
              <Button 
                label="Preview Button" 
                size="small"
              />
              <Button 
                label="Secondary" 
                severity="secondary"
                size="small"
              />
            </div>
            
            <!-- Input preview -->
            <div 
              v-else-if="componentId === 'inputtext'"
              class="component-section__preview-content"
            >
              <InputText 
                value="Sample text"
                placeholder="Placeholder text"
                size="small"
              />
            </div>
            
            <!-- Select preview -->
            <div 
              v-else-if="componentId === 'select'"
              class="component-section__preview-content"
            >
              <Select
                :model-value="'option1'"
                :options="[
                  { label: 'Option 1', value: 'option1' },
                  { label: 'Option 2', value: 'option2' }
                ]"
                option-label="label"
                option-value="value"
                size="small"
              />
            </div>
            
            <!-- Checkbox preview -->
            <div 
              v-else-if="componentId === 'checkbox'"
              class="component-section__preview-content"
            >
              <div class="flex items-center gap-2">
                <Checkbox 
                  :model-value="true"
                  input-id="preview-checkbox"
                />
                <label for="preview-checkbox">Sample checkbox</label>
              </div>
            </div>
            
            <!-- Generic preview -->
            <div 
              v-else
              class="component-section__preview-content component-section__preview-content--generic"
            >
              <i class="pi pi-th-large text-2xl text-gray-400" />
              <span class="text-sm text-gray-500">{{ componentDefinition?.name || componentId }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Settings content -->
    <div class="component-section__content">
      <!-- No settings message -->
      <div 
        v-if="componentSettings.length === 0"
        class="component-section__no-settings"
      >
        <div class="component-section__no-settings-content">
          <i class="pi pi-info-circle text-3xl text-gray-400 mb-3" />
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Settings Available
          </h3>
          <p class="text-gray-600 dark:text-gray-400">
            This component doesn't have any customizable settings yet.
          </p>
        </div>
      </div>

      <!-- Settings by category -->
      <div 
        v-else
        class="component-section__settings"
      >
        <div
          v-for="category in orderedCategories"
          :key="category.id"
          class="component-section__category"
        >
          <!-- Category header -->
          <div class="component-section__category-header">
            <h3 class="component-section__category-title">
              <i :class="getCategoryIcon(category.id)" />
              {{ category.name }}
            </h3>
            <p class="component-section__category-description">
              {{ category.settings.length }} setting{{ category.settings.length !== 1 ? 's' : '' }}
            </p>
          </div>

          <!-- Category settings -->
          <div class="component-section__category-settings">
            <SettingControl
              v-for="setting in category.settings"
              :key="setting.id"
              :setting="setting"
              :model-value="getSettingValue(setting.id)"
              :disabled="readonly || loading"
              @update:model-value="handleSettingUpdate(setting.id, $event)"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Component dependencies -->
    <div 
      v-if="componentDefinition?.dependencies && componentDefinition.dependencies.length > 0"
      class="component-section__dependencies"
    >
      <div class="component-section__dependencies-header">
        <h3 class="component-section__dependencies-title">
          <i class="pi pi-link" />
          Dependencies
        </h3>
        <p class="component-section__dependencies-description">
          This component depends on the following global settings
        </p>
      </div>
      
      <div class="component-section__dependencies-list">
        <div
          v-for="dependency in componentDefinition.dependencies"
          :key="dependency"
          class="component-section__dependency"
        >
          <i class="pi pi-arrow-right text-xs" />
          <span>{{ dependency }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.component-section {
  @apply space-y-8;
}

/* Header */
.component-section__header {
  @apply pb-6 border-b border-gray-200 dark:border-gray-700;
}

.component-section__header-content {
  @apply flex items-start justify-between gap-6;
}

.component-section__header-info {
  @apply flex-1;
}

.component-section__title {
  @apply text-xl font-semibold text-gray-900 dark:text-white mb-2;
}

.component-section__description {
  @apply text-gray-600 dark:text-gray-400;
}

/* Preview */
.component-section__preview {
  @apply flex-shrink-0;
}

.component-section__preview-container {
  @apply p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700;
}

.component-section__preview-content {
  @apply flex items-center gap-3;
}

.component-section__preview-content--generic {
  @apply flex-col text-center;
}

/* Content */
.component-section__content {
  @apply space-y-6;
}

/* No settings */
.component-section__no-settings {
  @apply flex items-center justify-center py-12;
}

.component-section__no-settings-content {
  @apply text-center;
}

/* Settings */
.component-section__settings {
  @apply space-y-8;
}

.component-section__category {
  @apply space-y-4;
}

.component-section__category-header {
  @apply space-y-1;
}

.component-section__category-title {
  @apply text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2;
}

.component-section__category-description {
  @apply text-sm text-gray-500 dark:text-gray-400;
}

.component-section__category-settings {
  @apply space-y-4 pl-6;
}

/* Dependencies */
.component-section__dependencies {
  @apply pt-6 border-t border-gray-200 dark:border-gray-700;
}

.component-section__dependencies-header {
  @apply mb-4;
}

.component-section__dependencies-title {
  @apply text-base font-medium text-gray-900 dark:text-white flex items-center gap-2;
}

.component-section__dependencies-description {
  @apply text-sm text-gray-600 dark:text-gray-400 mt-1;
}

.component-section__dependencies-list {
  @apply space-y-2;
}

.component-section__dependency {
  @apply flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400;
  @apply px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded;
}

/* Responsive */
@media (max-width: 768px) {
  .component-section__header-content {
    @apply flex-col items-stretch;
  }
  
  .component-section__preview {
    @apply w-full;
  }
  
  .component-section__category-settings {
    @apply pl-0;
  }
}
</style>