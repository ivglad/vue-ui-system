<script setup>
import { SettingGroups } from '../data/settingGroups.js'
import GlobalSection from './sections/GlobalSection.vue'
import ComponentGroupSection from './sections/ComponentGroupSection.vue'
import ComponentSection from './sections/ComponentSection.vue'
import PresetSection from './sections/PresetSection.vue'

defineOptions({
  name: 'ThemeDesignerDrawer'
})

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  activeSection: {
    type: String,
    default: 'global'
  },
  position: {
    type: String,
    default: 'right',
    validator: (value) => ['left', 'right'].includes(value)
  },
  readonly: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  hasChanges: {
    type: Boolean,
    default: false
  },
  canReset: {
    type: Boolean,
    default: false
  },
  currentTheme: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits([
  'update:visible',
  'update:activeSection',
  'update-setting',
  'apply-changes',
  'reset-changes',
  'reset-to-original',
  'export-theme',
  'import-theme'
])

// Local state
const fileInput = ref(null)

// Computed properties
const isVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

const currentSection = computed({
  get: () => props.activeSection,
  set: (value) => emit('update:activeSection', value)
})

const drawerClasses = computed(() => [
  'theme-designer-drawer',
  {
    'theme-designer-drawer--visible': props.visible,
    'theme-designer-drawer--left': props.position === 'left',
    'theme-designer-drawer--right': props.position === 'right',
    'theme-designer-drawer--readonly': props.readonly,
    'theme-designer-drawer--loading': props.loading
  }
])

const sectionTabs = computed(() => [
  {
    id: 'global',
    label: 'Global',
    icon: 'pi pi-globe',
    description: 'Theme-wide settings'
  },
  {
    id: 'components',
    label: 'Components',
    icon: 'pi pi-th-large',
    description: 'Component-specific settings'
  },
  {
    id: 'presets',
    label: 'Presets',
    icon: 'pi pi-bookmark',
    description: 'Predefined themes'
  }
])

// Methods
const closeDrawer = () => {
  isVisible.value = false
}

const handleSectionChange = (sectionId) => {
  currentSection.value = sectionId
}

const handleSettingUpdate = (path, value) => {
  emit('update-setting', path, value)
}

const handleApplyChanges = () => {
  emit('apply-changes')
}

const handleResetChanges = () => {
  emit('reset-changes')
}

const handleResetToOriginal = () => {
  emit('reset-to-original')
}

const handleExportTheme = () => {
  emit('export-theme')
}

const handleImportClick = () => {
  fileInput.value?.click()
}

const handleFileImport = (event) => {
  const file = event.target.files?.[0]
  if (!file) return
  
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const themeData = JSON.parse(e.target.result)
      emit('import-theme', themeData)
    } catch (err) {
      console.error('Failed to parse theme file:', err)
    }
  }
  reader.readAsText(file)
  
  // Reset file input
  event.target.value = ''
}

// Keyboard shortcuts
const handleKeydown = (event) => {
  if (event.key === 'Escape') {
    closeDrawer()
  } else if (event.ctrlKey || event.metaKey) {
    switch (event.key) {
      case 's':
        event.preventDefault()
        if (props.hasChanges && !props.readonly) {
          handleApplyChanges()
        }
        break
      case 'r':
        event.preventDefault()
        if (props.canReset && !props.readonly) {
          handleResetChanges()
        }
        break
      case 'e':
        event.preventDefault()
        handleExportTheme()
        break
      case 'i':
        event.preventDefault()
        if (!props.readonly) {
          handleImportClick()
        }
        break
    }
  }
}

// Add keyboard listener when drawer is visible
watch(() => props.visible, (visible) => {
  if (visible) {
    document.addEventListener('keydown', handleKeydown)
  } else {
    document.removeEventListener('keydown', handleKeydown)
  }
})

// Cleanup on unmount
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Drawer
    v-model:visible="isVisible"
    :position="position"
    :class="drawerClasses"
    class="theme-designer-drawer__container"
    :style="{ width: '24rem' }"
    :modal="false"
    :dismissable="true"
    :show-close-icon="true"
  >
    <!-- Header -->
    <template #header>
      <div class="theme-designer-drawer__header">
        <div class="theme-designer-drawer__header-content">
          <h3 class="theme-designer-drawer__title">
            Theme Settings
          </h3>
          <div 
            v-if="hasChanges"
            class="theme-designer-drawer__status"
          >
            <i class="pi pi-circle-fill theme-designer-drawer__status-icon" />
            <span class="theme-designer-drawer__status-text">{{ Object.keys(currentTheme).length }} changes</span>
          </div>
        </div>
      </div>
    </template>

    <!-- Content -->
    <div class="theme-designer-drawer__content">
      <!-- Section tabs -->
      <div class="theme-designer-drawer__tabs">
        <TabView 
          v-model:active-index="currentSection"
          class="theme-designer-drawer__tab-view"
        >
          <TabPanel
            v-for="tab in sectionTabs"
            :key="tab.id"
            :header="tab.label"
            :disabled="loading"
          >
            <template #header>
              <div class="theme-designer-drawer__tab-header">
                <i :class="tab.icon" />
                <span>{{ tab.label }}</span>
              </div>
            </template>
            
            <!-- Tab content -->
            <div class="theme-designer-drawer__tab-content">
              <!-- Global settings -->
              <GlobalSection
                v-if="tab.id === 'global'"
                :current-theme="currentTheme"
                :readonly="readonly"
                :loading="loading"
                @update-setting="handleSettingUpdate"
              />
              
              <!-- Component settings -->
              <ComponentGroupSection
                v-else-if="tab.id === 'components'"
                :current-theme="currentTheme"
                :readonly="readonly"
                :loading="loading"
                @update-setting="handleSettingUpdate"
              />
              
              <!-- Preset settings -->
              <PresetSection
                v-else-if="tab.id === 'presets'"
                :current-theme="currentTheme"
                :readonly="readonly"
                :loading="loading"
                @update-setting="handleSettingUpdate"
                @export-theme="handleExportTheme"
                @import-theme="handleImportClick"
              />
            </div>
          </TabPanel>
        </TabView>
      </div>
    </div>

    <!-- Footer -->
    <template #footer>
      <div class="theme-designer-drawer__footer">
        <!-- Action buttons -->
        <div class="theme-designer-drawer__actions">
          <div class="theme-designer-drawer__actions-left">
            <Button
              label="Import"
              icon="pi pi-upload"
              severity="secondary"
              size="small"
              outlined
              :disabled="loading || readonly"
              @click="handleImportClick"
            />
            
            <Button
              label="Export"
              icon="pi pi-download"
              severity="secondary"
              size="small"
              outlined
              :disabled="loading"
              @click="handleExportTheme"
            />
          </div>
          
          <div class="theme-designer-drawer__actions-right">
            <Button
              v-if="canReset"
              label="Reset"
              icon="pi pi-refresh"
              severity="secondary"
              size="small"
              outlined
              :disabled="loading || readonly"
              @click="handleResetChanges"
            />
            
            <Button
              v-if="hasChanges"
              label="Apply"
              icon="pi pi-check"
              size="small"
              :loading="loading"
              :disabled="readonly"
              @click="handleApplyChanges"
            />
          </div>
        </div>
        
        <!-- Keyboard shortcuts hint -->
        <div class="theme-designer-drawer__shortcuts">
          <small class="text-gray-500 dark:text-gray-400">
            <kbd>Ctrl+S</kbd> Apply • <kbd>Ctrl+R</kbd> Reset • <kbd>Ctrl+E</kbd> Export • <kbd>Esc</kbd> Close
          </small>
        </div>
      </div>
    </template>
  </Drawer>

  <!-- Hidden file input for import -->
  <input
    ref="fileInput"
    type="file"
    accept=".json"
    style="display: none"
    @change="handleFileImport"
  />
</template>

<style scoped>
.theme-designer-drawer__container {
  @apply bg-white dark:bg-gray-800;
}

.theme-designer-drawer__header {
  @apply w-full;
}

.theme-designer-drawer__header-content {
  @apply flex items-center justify-between;
}

.theme-designer-drawer__title {
  @apply text-lg font-semibold text-gray-900 dark:text-white;
}

.theme-designer-drawer__status {
  @apply flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400;
}

.theme-designer-drawer__status-icon {
  @apply text-xs;
}

.theme-designer-drawer__content {
  @apply flex-1 overflow-hidden;
}

.theme-designer-drawer__tabs {
  @apply h-full;
}

.theme-designer-drawer__tab-view {
  @apply h-full;
}

.theme-designer-drawer__tab-header {
  @apply flex items-center gap-2;
}

.theme-designer-drawer__tab-content {
  @apply h-full overflow-y-auto;
  @apply pr-2 -mr-2; /* Custom scrollbar spacing */
}

.theme-designer-drawer__footer {
  @apply border-t border-gray-200 dark:border-gray-700 pt-4;
}

.theme-designer-drawer__actions {
  @apply flex items-center justify-between mb-3;
}

.theme-designer-drawer__actions-left,
.theme-designer-drawer__actions-right {
  @apply flex items-center gap-2;
}

.theme-designer-drawer__shortcuts {
  @apply text-center;
}

.theme-designer-drawer__shortcuts kbd {
  @apply px-1.5 py-0.5 text-xs font-mono bg-gray-100 dark:bg-gray-700;
  @apply border border-gray-300 dark:border-gray-600 rounded;
}

/* Loading state */
.theme-designer-drawer--loading {
  @apply pointer-events-none opacity-75;
}

/* Readonly state */
.theme-designer-drawer--readonly .theme-designer-drawer__actions-right {
  @apply opacity-50 pointer-events-none;
}

/* Custom scrollbar for tab content */
.theme-designer-drawer__tab-content::-webkit-scrollbar {
  @apply w-2;
}

.theme-designer-drawer__tab-content::-webkit-scrollbar-track {
  @apply bg-gray-100 dark:bg-gray-700 rounded;
}

.theme-designer-drawer__tab-content::-webkit-scrollbar-thumb {
  @apply bg-gray-300 dark:bg-gray-600 rounded;
}

.theme-designer-drawer__tab-content::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-400 dark:bg-gray-500;
}
</style>