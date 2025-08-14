<script setup>
import { SettingGroups } from '../../data/settingGroups.js'
import { GlobalColorSettings, GlobalTypographySettings, GlobalSpacingSettings } from '../../data/componentDefinitions.js'
import SettingControl from '../controls/SettingControl.vue'
import ColorPalettePicker from '../controls/ColorPalettePicker.vue'

defineOptions({
  name: 'GlobalSection'
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
const activeSubsection = ref('colors')

// Computed properties
const globalSections = computed(() => {
  return Object.values(SettingGroups.global.sections)
})

const colorSettings = computed(() => {
  return Object.values(GlobalColorSettings)
})

const typographySettings = computed(() => {
  return Object.values(GlobalTypographySettings)
})

const spacingSettings = computed(() => {
  return Object.values(GlobalSpacingSettings)
})

// Methods
const handleSettingUpdate = (settingId, value) => {
  emit('update-setting', settingId, value)
}

const getSettingValue = (settingId) => {
  return props.currentTheme[settingId]
}

const setActiveSubsection = (sectionId) => {
  activeSubsection.value = sectionId
}
</script>

<template>
  <div class="global-section">
    <!-- Section navigation -->
    <div class="global-section__nav">
      <div class="global-section__nav-buttons">
        <Button
          v-for="section in globalSections"
          :key="section.id"
          :label="section.name"
          :icon="section.icon"
          :severity="activeSubsection === section.id ? 'primary' : 'secondary'"
          :outlined="activeSubsection !== section.id"
          size="small"
          class="global-section__nav-button"
          @click="setActiveSubsection(section.id)"
        />
      </div>
    </div>

    <!-- Section content -->
    <div class="global-section__content">
      <!-- Colors Section -->
      <div 
        v-if="activeSubsection === 'colors'"
        class="global-section__subsection"
      >
        <div class="global-section__subsection-header">
          <h3 class="global-section__subsection-title">
            <i class="pi pi-palette" />
            Color Settings
          </h3>
          <p class="global-section__subsection-description">
            Configure the main color palettes for your theme
          </p>
        </div>

        <div class="global-section__subsection-content">
          <!-- Primary Color -->
          <div class="global-section__setting-group">
            <h4 class="global-section__group-title">Primary Color</h4>
            <p class="global-section__group-description">
              The main brand color used for buttons, links, and active states
            </p>
            
            <ColorPalettePicker
              :model-value="getSettingValue('colors.primary')"
              palette-type="primary"
              :disabled="readonly || loading"
              @update:model-value="handleSettingUpdate('colors.primary', $event)"
            />
          </div>

          <!-- Surface Color -->
          <div class="global-section__setting-group">
            <h4 class="global-section__group-title">Surface Color</h4>
            <p class="global-section__group-description">
              Background colors for cards, panels, and surfaces
            </p>
            
            <ColorPalettePicker
              :model-value="getSettingValue('colors.surface')"
              palette-type="surface"
              :disabled="readonly || loading"
              @update:model-value="handleSettingUpdate('colors.surface', $event)"
            />
          </div>

          <!-- Semantic Colors -->
          <div class="global-section__setting-group">
            <h4 class="global-section__group-title">Semantic Colors</h4>
            <p class="global-section__group-description">
              Colors for success, warning, error, and info states
            </p>
            
            <div class="global-section__settings-grid">
              <SettingControl
                v-for="setting in colorSettings.filter(s => ['colors.success', 'colors.warning', 'colors.error'].includes(s.id))"
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

      <!-- Typography Section -->
      <div 
        v-if="activeSubsection === 'typography'"
        class="global-section__subsection"
      >
        <div class="global-section__subsection-header">
          <h3 class="global-section__subsection-title">
            <i class="pi pi-font" />
            Typography Settings
          </h3>
          <p class="global-section__subsection-description">
            Configure fonts, sizes, and text styling
          </p>
        </div>

        <div class="global-section__subsection-content">
          <!-- Base Typography -->
          <div class="global-section__setting-group">
            <h4 class="global-section__group-title">Base Typography</h4>
            <p class="global-section__group-description">
              Default font settings that apply throughout the theme
            </p>
            
            <div class="global-section__settings-grid">
              <SettingControl
                v-for="setting in typographySettings"
                :key="setting.id"
                :setting="setting"
                :model-value="getSettingValue(setting.id)"
                :disabled="readonly || loading"
                @update:model-value="handleSettingUpdate(setting.id, $event)"
              />
            </div>
          </div>

          <!-- Typography Preview -->
          <div class="global-section__setting-group">
            <h4 class="global-section__group-title">Typography Preview</h4>
            <div class="global-section__typography-preview">
              <h1 class="global-section__preview-heading">Heading 1</h1>
              <h2 class="global-section__preview-heading">Heading 2</h2>
              <h3 class="global-section__preview-heading">Heading 3</h3>
              <p class="global-section__preview-text">
                This is a paragraph of body text that shows how the typography settings affect regular content. 
                It includes <strong>bold text</strong> and <em>italic text</em> to demonstrate different font weights.
              </p>
              <small class="global-section__preview-small">This is small text for captions and notes.</small>
            </div>
          </div>
        </div>
      </div>

      <!-- Spacing Section -->
      <div 
        v-if="activeSubsection === 'spacing'"
        class="global-section__subsection"
      >
        <div class="global-section__subsection-header">
          <h3 class="global-section__subsection-title">
            <i class="pi pi-arrows-alt" />
            Spacing Settings
          </h3>
          <p class="global-section__subsection-description">
            Configure margins, padding, and layout spacing
          </p>
        </div>

        <div class="global-section__subsection-content">
          <!-- Base Spacing -->
          <div class="global-section__setting-group">
            <h4 class="global-section__group-title">Base Spacing</h4>
            <p class="global-section__group-description">
              Fundamental spacing units used throughout the theme
            </p>
            
            <div class="global-section__settings-grid">
              <SettingControl
                v-for="setting in spacingSettings"
                :key="setting.id"
                :setting="setting"
                :model-value="getSettingValue(setting.id)"
                :disabled="readonly || loading"
                @update:model-value="handleSettingUpdate(setting.id, $event)"
              />
            </div>
          </div>

          <!-- Spacing Preview -->
          <div class="global-section__setting-group">
            <h4 class="global-section__group-title">Spacing Preview</h4>
            <div class="global-section__spacing-preview">
              <div class="global-section__preview-box global-section__preview-box--small">
                Small spacing
              </div>
              <div class="global-section__preview-box global-section__preview-box--medium">
                Medium spacing
              </div>
              <div class="global-section__preview-box global-section__preview-box--large">
                Large spacing
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Borders Section -->
      <div 
        v-if="activeSubsection === 'borders'"
        class="global-section__subsection"
      >
        <div class="global-section__subsection-header">
          <h3 class="global-section__subsection-title">
            <i class="pi pi-stop" />
            Border Settings
          </h3>
          <p class="global-section__subsection-description">
            Configure border radius, width, and styles
          </p>
        </div>

        <div class="global-section__subsection-content">
          <!-- Border Radius -->
          <div class="global-section__setting-group">
            <h4 class="global-section__group-title">Border Radius</h4>
            <p class="global-section__group-description">
              Default corner rounding for components
            </p>
            
            <div class="global-section__border-preview">
              <div class="global-section__preview-border global-section__preview-border--none">
                No radius
              </div>
              <div class="global-section__preview-border global-section__preview-border--small">
                Small radius
              </div>
              <div class="global-section__preview-border global-section__preview-border--medium">
                Medium radius
              </div>
              <div class="global-section__preview-border global-section__preview-border--large">
                Large radius
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.global-section {
  @apply space-y-6;
}

.global-section__nav {
  @apply pb-4 border-b border-gray-200 dark:border-gray-700;
}

.global-section__nav-buttons {
  @apply flex flex-wrap gap-2;
}

.global-section__nav-button {
  @apply flex-shrink-0;
}

.global-section__content {
  @apply space-y-6;
}

.global-section__subsection {
  @apply space-y-6;
}

.global-section__subsection-header {
  @apply space-y-2;
}

.global-section__subsection-title {
  @apply text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2;
}

.global-section__subsection-description {
  @apply text-sm text-gray-600 dark:text-gray-400;
}

.global-section__subsection-content {
  @apply space-y-8;
}

.global-section__setting-group {
  @apply space-y-4;
}

.global-section__group-title {
  @apply text-base font-medium text-gray-900 dark:text-white;
}

.global-section__group-description {
  @apply text-sm text-gray-600 dark:text-gray-400;
}

.global-section__settings-grid {
  @apply grid grid-cols-1 gap-4;
}

/* Typography Preview */
.global-section__typography-preview {
  @apply p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3;
}

.global-section__preview-heading {
  @apply font-semibold text-gray-900 dark:text-white;
}

.global-section__preview-text {
  @apply text-gray-700 dark:text-gray-300 leading-relaxed;
}

.global-section__preview-small {
  @apply text-gray-500 dark:text-gray-400;
}

/* Spacing Preview */
.global-section__spacing-preview {
  @apply flex flex-wrap gap-4;
}

.global-section__preview-box {
  @apply bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100;
  @apply border border-blue-200 dark:border-blue-800 rounded text-sm font-medium;
  @apply flex items-center justify-center text-center;
}

.global-section__preview-box--small {
  @apply p-2 w-20 h-20;
}

.global-section__preview-box--medium {
  @apply p-4 w-24 h-24;
}

.global-section__preview-box--large {
  @apply p-6 w-28 h-28;
}

/* Border Preview */
.global-section__border-preview {
  @apply grid grid-cols-2 gap-4;
}

.global-section__preview-border {
  @apply p-4 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white;
  @apply border border-gray-300 dark:border-gray-600 text-sm font-medium text-center;
}

.global-section__preview-border--none {
  @apply rounded-none;
}

.global-section__preview-border--small {
  @apply rounded;
}

.global-section__preview-border--medium {
  @apply rounded-lg;
}

.global-section__preview-border--large {
  @apply rounded-xl;
}

/* Responsive */
@media (min-width: 640px) {
  .global-section__settings-grid {
    @apply grid-cols-2;
  }
}

@media (min-width: 1024px) {
  .global-section__border-preview {
    @apply grid-cols-4;
  }
}
</style>