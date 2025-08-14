<!-- Basic Theme Designer Usage Example -->
<script setup>
import { ref } from 'vue'
import { ThemeDesigner } from '@/theme-designer'

// Basic reactive state
const currentTheme = ref({})
const isThemeApplied = ref(false)

// Event handlers
const handleThemeApplied = (theme) => {
  currentTheme.value = theme
  isThemeApplied.value = true
  
  // Show success message
  console.log('Theme applied:', theme)
}

const handleThemeReset = () => {
  currentTheme.value = {}
  isThemeApplied.value = false
  console.log('Theme reset to default')
}

const handleSettingChanged = (change) => {
  console.log('Setting changed:', change)
}
</script>

<template>
  <div class="basic-usage-example">
    <h2 class="text-2xl font-semibold mb-6">Basic Theme Designer Usage</h2>
    
    <!-- Status indicator -->
    <div class="mb-4 p-4 rounded-lg" :class="isThemeApplied ? 'bg-green-50 text-green-800' : 'bg-gray-50 text-gray-600'">
      <p class="font-medium">
        Status: {{ isThemeApplied ? 'Custom theme applied' : 'Using default theme' }}
      </p>
    </div>
    
    <!-- Theme Designer Component -->
    <ThemeDesigner
      :preview-components="['button', 'inputtext', 'select', 'card']"
      @theme-applied="handleThemeApplied"
      @theme-reset="handleThemeReset"
      @setting-changed="handleSettingChanged"
    />
  </div>
</template>

<style scoped>
.basic-usage-example {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}
</style>
</script>