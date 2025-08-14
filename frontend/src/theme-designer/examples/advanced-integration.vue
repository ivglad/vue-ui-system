<!-- Advanced Theme Designer Integration Example -->
<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { ThemeDesigner } from '@/theme-designer'
import { THEME_PRESETS } from '@/theme-designer/presets'
import { useThemeExport } from '@/theme-designer/composables/useThemeExport'

// Advanced state management
const selectedPreset = ref('default')
const customTheme = ref({})
const themeHistory = ref([])
const maxHistorySize = 10

// Composables
const { exportTheme, importTheme } = useThemeExport()

// Computed properties
const availablePresets = computed(() => {
  return Object.keys(THEME_PRESETS).map(key => ({
    value: key,
    label: THEME_PRESETS[key].name
  }))
})

const currentThemeConfig = computed(() => {
  if (selectedPreset.value === 'custom') {
    return customTheme.value
  }
  return THEME_PRESETS[selectedPreset.value]?.settings || {}
})

// Methods
const applyPreset = (presetKey) => {
  selectedPreset.value = presetKey
  if (presetKey !== 'custom') {
    customTheme.value = {}
  }
}

const handleThemeApplied = (theme) => {
  // Add to history
  themeHistory.value.unshift({
    timestamp: new Date().toISOString(),
    theme: { ...theme },
    preset: selectedPreset.value
  })
  
  // Limit history size
  if (themeHistory.value.length > maxHistorySize) {
    themeHistory.value = themeHistory.value.slice(0, maxHistorySize)
  }
  
  // Save to localStorage
  localStorage.setItem('theme-history', JSON.stringify(themeHistory.value))
}

const handleThemeExport = async () => {
  try {
    const exportedTheme = await exportTheme(customTheme.value)
    
    // Create download link
    const blob = new Blob([JSON.stringify(exportedTheme, null, 2)], {
      type: 'application/json'
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `theme-${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Export failed:', error)
  }
}

const handleThemeImport = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  try {
    const text = await file.text()
    const themeData = JSON.parse(text)
    const importedTheme = await importTheme(themeData)
    
    customTheme.value = importedTheme
    selectedPreset.value = 'custom'
  } catch (error) {
    console.error('Import failed:', error)
  }
}

const restoreFromHistory = (historyItem) => {
  customTheme.value = historyItem.theme
  selectedPreset.value = historyItem.preset
}

// Lifecycle
onMounted(() => {
  // Load history from localStorage
  const savedHistory = localStorage.getItem('theme-history')
  if (savedHistory) {
    try {
      themeHistory.value = JSON.parse(savedHistory)
    } catch (error) {
      console.error('Failed to load theme history:', error)
    }
  }
})

// Watchers
watch(selectedPreset, (newPreset) => {
  console.log('Preset changed to:', newPreset)
})
</script>

<template>
  <div class="advanced-integration-example">
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Control Panel -->
      <div class="lg:col-span-1 space-y-6">
        <!-- Preset Selection -->
        <Card>
          <template #title>Theme Presets</template>
          <template #content>
            <div class="space-y-3">
              <div v-for="preset in availablePresets" :key="preset.value">
                <Button
                  :label="preset.label"
                  :severity="selectedPreset === preset.value ? 'primary' : 'secondary'"
                  :outlined="selectedPreset !== preset.value"
                  class="w-full"
                  @click="applyPreset(preset.value)"
                />
              </div>
              <Button
                label="Custom Theme"
                :severity="selectedPreset === 'custom' ? 'primary' : 'secondary'"
                :outlined="selectedPreset !== 'custom'"
                class="w-full"
                @click="applyPreset('custom')"
              />
            </div>
          </template>
        </Card>
        
        <!-- Import/Export -->
        <Card>
          <template #title>Import/Export</template>
          <template #content>
            <div class="space-y-3">
              <Button
                label="Export Theme"
                icon="pi pi-download"
                class="w-full"
                @click="handleThemeExport"
              />
              <div>
                <input
                  type="file"
                  accept=".json"
                  class="hidden"
                  ref="fileInput"
                  @change="handleThemeImport"
                />
                <Button
                  label="Import Theme"
                  icon="pi pi-upload"
                  class="w-full"
                  @click="$refs.fileInput.click()"
                />
              </div>
            </div>
          </template>
        </Card>
        
        <!-- Theme History -->
        <Card v-if="themeHistory.length > 0">
          <template #title>Recent Changes</template>
          <template #content>
            <div class="space-y-2 max-h-64 overflow-y-auto">
              <div
                v-for="(item, index) in themeHistory.slice(0, 5)"
                :key="index"
                class="p-2 border rounded cursor-pointer hover:bg-gray-50"
                @click="restoreFromHistory(item)"
              >
                <div class="text-sm font-medium">{{ item.preset }}</div>
                <div class="text-xs text-gray-500">
                  {{ new Date(item.timestamp).toLocaleString() }}
                </div>
              </div>
            </div>
          </template>
        </Card>
      </div>
      
      <!-- Theme Designer -->
      <div class="lg:col-span-3">
        <ThemeDesigner
          :initial-theme="currentThemeConfig"
          :preview-components="[
            'button', 'inputtext', 'select', 'card', 
            'datatable', 'dialog', 'menu', 'toast'
          ]"
          drawer-position="right"
          :auto-save="false"
          @theme-applied="handleThemeApplied"
          @theme-exported="handleThemeExport"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.advanced-integration-example {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}
</style>
</script>