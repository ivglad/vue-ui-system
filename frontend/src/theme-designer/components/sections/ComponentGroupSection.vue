<script setup>
import { SettingGroups } from '../../data/settingGroups.js'
import { ComponentDefinitions, getSettingsForComponent } from '../../data/componentDefinitions.js'
import SettingControl from '../controls/SettingControl.vue'
import ComponentSection from './ComponentSection.vue'

defineOptions({
  name: 'ComponentGroupSection'
})

const props = defineProps({
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

// Local state
const activeGroup = ref('forms')
const activeComponent = ref(null)

// Computed properties
const componentGroups = computed(() => {
  return Object.values(SettingGroups.components.groups)
})

const currentGroup = computed(() => {
  return SettingGroups.components.groups[activeGroup.value]
})

const currentGroupComponents = computed(() => {
  if (!currentGroup.value) return []
  
  return currentGroup.value.components.map(componentId => {
    const definition = ComponentDefinitions[componentId]
    return {
      id: componentId,
      name: definition?.name || componentId,
      ...definition
    }
  }).filter(Boolean)
})

const showComponentDetail = computed(() => {
  return activeComponent.value !== null
})

// Methods
const handleSettingUpdate = (settingId, value) => {
  emit('update-setting', settingId, value)
}

const setActiveGroup = (groupId) => {
  activeGroup.value = groupId
  activeComponent.value = null
}

const setActiveComponent = (componentId) => {
  activeComponent.value = componentId
}

const goBackToGroup = () => {
  activeComponent.value = null
}

const getSettingValue = (settingId) => {
  return props.currentTheme[settingId]
}
</script>

<template>
  <div class="component-group-section">
    <!-- Component detail view -->
    <div 
      v-if="showComponentDetail"
      class="component-group-section__detail"
    >
      <!-- Back button -->
      <div class="component-group-section__detail-header">
        <Button
          icon="pi pi-arrow-left"
          label="Back to Components"
          text
          size="small"
          @click="goBackToGroup"
        />
      </div>

      <!-- Component section -->
      <ComponentSection
        :component-id="activeComponent"
        :current-theme="currentTheme"
        :readonly="readonly"
        :loading="loading"
        @update-setting="handleSettingUpdate"
      />
    </div>

    <!-- Group overview -->
    <div 
      v-else
      class="component-group-section__overview"
    >
      <!-- Group navigation -->
      <div class="component-group-section__nav">
        <div class="component-group-section__nav-buttons">
          <Button
            v-for="group in componentGroups"
            :key="group.id"
            :label="group.name"
            :icon="group.icon"
            :severity="activeGroup === group.id ? 'primary' : 'secondary'"
            :outlined="activeGroup !== group.id"
            size="small"
            class="component-group-section__nav-button"
            @click="setActiveGroup(group.id)"
          />
        </div>
      </div>

      <!-- Group content -->
      <div class="component-group-section__content">
        <!-- Group header -->
        <div class="component-group-section__group-header">
          <div class="component-group-section__group-info">
            <h3 class="component-group-section__group-title">
              <i :class="currentGroup.icon" />
              {{ currentGroup.name }}
            </h3>
            <p class="component-group-section__group-description">
              {{ currentGroup.description }}
            </p>
          </div>
        </div>

        <!-- Components grid -->
        <div class="component-group-section__components">
          <div class="component-group-section__components-grid">
            <div
              v-for="component in currentGroupComponents"
              :key="component.id"
              class="component-group-section__component-card"
              @click="setActiveComponent(component.id)"
            >
              <!-- Component preview -->
              <div class="component-group-section__component-preview">
                <!-- Mini preview based on component type -->
                <div 
                  v-if="component.id === 'button'"
                  class="component-group-section__preview-button"
                >
                  Button
                </div>
                <div 
                  v-else-if="component.id === 'inputtext'"
                  class="component-group-section__preview-input"
                >
                  <div class="component-group-section__preview-input-field">
                    Sample text
                  </div>
                </div>
                <div 
                  v-else-if="component.id === 'select'"
                  class="component-group-section__preview-select"
                >
                  <div class="component-group-section__preview-select-field">
                    Select option
                    <i class="pi pi-chevron-down" />
                  </div>
                </div>
                <div 
                  v-else-if="component.id === 'checkbox'"
                  class="component-group-section__preview-checkbox"
                >
                  <div class="component-group-section__preview-checkbox-box">
                    <i class="pi pi-check" />
                  </div>
                  <span>Checkbox</span>
                </div>
                <div 
                  v-else-if="component.id === 'tabs'"
                  class="component-group-section__preview-tabs"
                >
                  <div class="component-group-section__preview-tab component-group-section__preview-tab--active">
                    Tab 1
                  </div>
                  <div class="component-group-section__preview-tab">
                    Tab 2
                  </div>
                </div>
                <div 
                  v-else
                  class="component-group-section__preview-generic"
                >
                  <i class="pi pi-th-large" />
                </div>
              </div>

              <!-- Component info -->
              <div class="component-group-section__component-info">
                <h4 class="component-group-section__component-name">
                  {{ component.name }}
                </h4>
                <p class="component-group-section__component-settings-count">
                  {{ component.settings?.length || 0 }} settings
                </p>
              </div>

              <!-- Edit indicator -->
              <div class="component-group-section__component-action">
                <i class="pi pi-chevron-right" />
              </div>
            </div>
          </div>
        </div>

        <!-- Group-wide settings (if any) -->
        <div 
          v-if="currentGroup.settings && currentGroup.settings.length > 0"
          class="component-group-section__group-settings"
        >
          <div class="component-group-section__group-settings-header">
            <h4 class="component-group-section__group-settings-title">
              Group Settings
            </h4>
            <p class="component-group-section__group-settings-description">
              Settings that apply to all components in this group
            </p>
          </div>

          <div class="component-group-section__group-settings-content">
            <!-- Group settings would go here if defined -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.component-group-section {
  @apply space-y-6;
}

/* Navigation */
.component-group-section__nav {
  @apply pb-4 border-b border-gray-200 dark:border-gray-700;
}

.component-group-section__nav-buttons {
  @apply flex flex-wrap gap-2;
}

.component-group-section__nav-button {
  @apply flex-shrink-0;
}

/* Detail view */
.component-group-section__detail-header {
  @apply mb-6;
}

/* Group header */
.component-group-section__group-header {
  @apply mb-6;
}

.component-group-section__group-info {
  @apply space-y-2;
}

.component-group-section__group-title {
  @apply text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2;
}

.component-group-section__group-description {
  @apply text-sm text-gray-600 dark:text-gray-400;
}

/* Components grid */
.component-group-section__components-grid {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4;
}

.component-group-section__component-card {
  @apply bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700;
  @apply rounded-lg p-4 cursor-pointer transition-all duration-200;
  @apply hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md;
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500;
}

.component-group-section__component-card:hover {
  @apply transform -translate-y-0.5;
}

/* Component preview */
.component-group-section__component-preview {
  @apply mb-4 h-16 flex items-center justify-center;
}

.component-group-section__preview-button {
  @apply px-4 py-2 bg-blue-500 text-white rounded text-sm font-medium;
}

.component-group-section__preview-input {
  @apply w-full;
}

.component-group-section__preview-input-field {
  @apply w-full px-3 py-2 border border-gray-300 dark:border-gray-600;
  @apply rounded bg-white dark:bg-gray-700 text-sm;
}

.component-group-section__preview-select {
  @apply w-full;
}

.component-group-section__preview-select-field {
  @apply w-full px-3 py-2 border border-gray-300 dark:border-gray-600;
  @apply rounded bg-white dark:bg-gray-700 text-sm flex items-center justify-between;
}

.component-group-section__preview-checkbox {
  @apply flex items-center gap-2;
}

.component-group-section__preview-checkbox-box {
  @apply w-4 h-4 border border-gray-300 dark:border-gray-600 rounded;
  @apply bg-blue-500 text-white flex items-center justify-center text-xs;
}

.component-group-section__preview-tabs {
  @apply flex border-b border-gray-200 dark:border-gray-700;
}

.component-group-section__preview-tab {
  @apply px-3 py-2 text-sm border-b-2 border-transparent;
}

.component-group-section__preview-tab--active {
  @apply border-blue-500 text-blue-600 dark:text-blue-400;
}

.component-group-section__preview-generic {
  @apply text-2xl text-gray-400 dark:text-gray-500;
}

/* Component info */
.component-group-section__component-info {
  @apply flex-1;
}

.component-group-section__component-name {
  @apply font-medium text-gray-900 dark:text-white mb-1;
}

.component-group-section__component-settings-count {
  @apply text-sm text-gray-500 dark:text-gray-400;
}

.component-group-section__component-action {
  @apply text-gray-400 dark:text-gray-500 ml-2;
}

/* Group settings */
.component-group-section__group-settings {
  @apply mt-8 pt-6 border-t border-gray-200 dark:border-gray-700;
}

.component-group-section__group-settings-header {
  @apply mb-4;
}

.component-group-section__group-settings-title {
  @apply text-base font-medium text-gray-900 dark:text-white;
}

.component-group-section__group-settings-description {
  @apply text-sm text-gray-600 dark:text-gray-400 mt-1;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .component-group-section__components-grid {
    @apply grid-cols-1;
  }
  
  .component-group-section__component-preview {
    @apply h-12;
  }
}
</style>