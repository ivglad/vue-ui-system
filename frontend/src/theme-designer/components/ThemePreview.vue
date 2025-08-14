<script setup>
defineOptions({
  name: 'ThemePreview'
})

const props = defineProps({
  previewComponents: {
    type: Array,
    default: () => ['button', 'inputtext', 'select', 'checkbox', 'tabs']
  },
  currentTheme: {
    type: Object,
    default: () => ({})
  },
  hasChanges: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
})

// Local state for demo data
const demoData = reactive({
  inputValue: 'Sample text',
  selectValue: 'option1',
  checkboxValue: true,
  radioValue: 'option1',
  sliderValue: 50,
  activeTabIndex: 0,
  tableData: [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'Active' }
  ],
  selectOptions: [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' }
  ]
})

// Toast for demo
const toast = useToast()

// Component sections
const componentSections = computed(() => [
  {
    id: 'buttons',
    title: 'Buttons',
    description: 'Various button styles and states',
    visible: props.previewComponents.includes('button')
  },
  {
    id: 'inputs',
    title: 'Form Inputs',
    description: 'Input fields and form controls',
    visible: props.previewComponents.includes('inputtext') || 
             props.previewComponents.includes('select') ||
             props.previewComponents.includes('checkbox')
  },
  {
    id: 'navigation',
    title: 'Navigation',
    description: 'Tabs, menus, and navigation elements',
    visible: props.previewComponents.includes('tabs')
  },
  {
    id: 'data',
    title: 'Data Display',
    description: 'Tables, cards, and data presentation',
    visible: props.previewComponents.includes('datatable') ||
             props.previewComponents.includes('card')
  },
  {
    id: 'feedback',
    title: 'Feedback',
    description: 'Messages, dialogs, and notifications',
    visible: props.previewComponents.includes('message') ||
             props.previewComponents.includes('toast')
  }
])

// Methods
const showToast = (severity = 'info') => {
  toast.add({
    severity,
    summary: 'Demo Notification',
    detail: `This is a ${severity} message for theme preview`,
    life: 3000
  })
}

const handleButtonClick = (type) => {
  console.log(`${type} button clicked`)
  showToast('success')
}
</script>

<template>
  <div class="theme-preview">
    <!-- Header -->
    <div class="theme-preview__header">
      <div class="theme-preview__header-content">
        <h2 class="theme-preview__title">
          Theme Preview
        </h2>
        <div class="theme-preview__status">
          <div 
            v-if="hasChanges"
            class="theme-preview__changes-indicator"
          >
            <i class="pi pi-circle-fill" />
            <span>Live Preview</span>
          </div>
          <div 
            v-if="loading"
            class="theme-preview__loading-indicator"
          >
            <ProgressSpinner size="small" />
            <span>Applying...</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Preview content -->
    <div class="theme-preview__content">
      <!-- Buttons Section -->
      <section 
        v-if="componentSections.find(s => s.id === 'buttons')?.visible"
        class="theme-preview__section"
      >
        <div class="theme-preview__section-header">
          <h3 class="theme-preview__section-title">Buttons</h3>
          <p class="theme-preview__section-description">Various button styles and states</p>
        </div>
        
        <div class="theme-preview__section-content">
          <!-- Primary buttons -->
          <div class="theme-preview__group">
            <h4 class="theme-preview__group-title">Primary Buttons</h4>
            <div class="theme-preview__group-content">
              <Button 
                label="Default" 
                @click="handleButtonClick('primary')"
              />
              <Button 
                label="Loading" 
                loading
              />
              <Button 
                label="Disabled" 
                disabled
              />
              <Button 
                label="With Icon" 
                icon="pi pi-check"
                @click="handleButtonClick('icon')"
              />
            </div>
          </div>

          <!-- Secondary buttons -->
          <div class="theme-preview__group">
            <h4 class="theme-preview__group-title">Secondary Buttons</h4>
            <div class="theme-preview__group-content">
              <Button 
                label="Secondary" 
                severity="secondary"
                @click="handleButtonClick('secondary')"
              />
              <Button 
                label="Outlined" 
                outlined
                @click="handleButtonClick('outlined')"
              />
              <Button 
                label="Text" 
                text
                @click="handleButtonClick('text')"
              />
              <Button 
                label="Link" 
                link
                @click="handleButtonClick('link')"
              />
            </div>
          </div>

          <!-- Severity buttons -->
          <div class="theme-preview__group">
            <h4 class="theme-preview__group-title">Severity Buttons</h4>
            <div class="theme-preview__group-content">
              <Button 
                label="Success" 
                severity="success"
                @click="handleButtonClick('success')"
              />
              <Button 
                label="Warning" 
                severity="warning"
                @click="handleButtonClick('warning')"
              />
              <Button 
                label="Danger" 
                severity="danger"
                @click="handleButtonClick('danger')"
              />
              <Button 
                label="Info" 
                severity="info"
                @click="handleButtonClick('info')"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- Form Inputs Section -->
      <section 
        v-if="componentSections.find(s => s.id === 'inputs')?.visible"
        class="theme-preview__section"
      >
        <div class="theme-preview__section-header">
          <h3 class="theme-preview__section-title">Form Inputs</h3>
          <p class="theme-preview__section-description">Input fields and form controls</p>
        </div>
        
        <div class="theme-preview__section-content">
          <!-- Text inputs -->
          <div class="theme-preview__group">
            <h4 class="theme-preview__group-title">Text Inputs</h4>
            <div class="theme-preview__group-content theme-preview__group-content--vertical">
              <FloatLabel>
                <InputText 
                  id="demo-input"
                  v-model="demoData.inputValue"
                />
                <label for="demo-input">Sample Input</label>
              </FloatLabel>
              
              <FloatLabel>
                <InputText 
                  id="demo-input-disabled"
                  value="Disabled input"
                  disabled
                />
                <label for="demo-input-disabled">Disabled Input</label>
              </FloatLabel>
              
              <FloatLabel>
                <InputText 
                  id="demo-input-invalid"
                  value="Invalid input"
                  invalid
                />
                <label for="demo-input-invalid">Invalid Input</label>
              </FloatLabel>
            </div>
          </div>

          <!-- Select inputs -->
          <div class="theme-preview__group">
            <h4 class="theme-preview__group-title">Select Inputs</h4>
            <div class="theme-preview__group-content theme-preview__group-content--vertical">
              <Select
                v-model="demoData.selectValue"
                :options="demoData.selectOptions"
                option-label="label"
                option-value="value"
                placeholder="Choose an option"
              />
              
              <MultiSelect
                :model-value="['option1', 'option2']"
                :options="demoData.selectOptions"
                option-label="label"
                option-value="value"
                placeholder="Choose multiple options"
              />
            </div>
          </div>

          <!-- Checkboxes and radios -->
          <div class="theme-preview__group">
            <h4 class="theme-preview__group-title">Checkboxes & Radios</h4>
            <div class="theme-preview__group-content theme-preview__group-content--vertical">
              <div class="flex items-center gap-2">
                <Checkbox 
                  v-model="demoData.checkboxValue"
                  input-id="demo-checkbox"
                />
                <label for="demo-checkbox">Sample Checkbox</label>
              </div>
              
              <div class="flex items-center gap-4">
                <div class="flex items-center gap-2">
                  <RadioButton 
                    v-model="demoData.radioValue"
                    input-id="radio1"
                    value="option1"
                  />
                  <label for="radio1">Option 1</label>
                </div>
                <div class="flex items-center gap-2">
                  <RadioButton 
                    v-model="demoData.radioValue"
                    input-id="radio2"
                    value="option2"
                  />
                  <label for="radio2">Option 2</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Navigation Section -->
      <section 
        v-if="componentSections.find(s => s.id === 'navigation')?.visible"
        class="theme-preview__section"
      >
        <div class="theme-preview__section-header">
          <h3 class="theme-preview__section-title">Navigation</h3>
          <p class="theme-preview__section-description">Tabs, menus, and navigation elements</p>
        </div>
        
        <div class="theme-preview__section-content">
          <!-- Tabs -->
          <div class="theme-preview__group">
            <h4 class="theme-preview__group-title">Tabs</h4>
            <div class="theme-preview__group-content">
              <TabView v-model:active-index="demoData.activeTabIndex">
                <TabPanel header="Tab 1">
                  <p class="text-gray-600 dark:text-gray-400">
                    Content for the first tab. This demonstrates how tabs look with the current theme.
                  </p>
                </TabPanel>
                <TabPanel header="Tab 2">
                  <p class="text-gray-600 dark:text-gray-400">
                    Content for the second tab. You can switch between tabs to see the active state.
                  </p>
                </TabPanel>
                <TabPanel header="Tab 3">
                  <p class="text-gray-600 dark:text-gray-400">
                    Content for the third tab. Notice how the theme affects the tab styling.
                  </p>
                </TabPanel>
              </TabView>
            </div>
          </div>
        </div>
      </section>

      <!-- Data Display Section -->
      <section class="theme-preview__section">
        <div class="theme-preview__section-header">
          <h3 class="theme-preview__section-title">Data Display</h3>
          <p class="theme-preview__section-description">Cards, panels, and data presentation</p>
        </div>
        
        <div class="theme-preview__section-content">
          <!-- Cards -->
          <div class="theme-preview__group">
            <h4 class="theme-preview__group-title">Cards</h4>
            <div class="theme-preview__group-content">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <template #title>Sample Card</template>
                  <template #content>
                    <p class="text-gray-600 dark:text-gray-400">
                      This is a sample card component showing how cards appear with the current theme settings.
                    </p>
                  </template>
                  <template #footer>
                    <Button label="Action" size="small" />
                  </template>
                </Card>
                
                <Panel header="Sample Panel" toggleable>
                  <p class="text-gray-600 dark:text-gray-400">
                    This is a collapsible panel component. You can toggle it to see the expand/collapse animation.
                  </p>
                </Panel>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Feedback Section -->
      <section class="theme-preview__section">
        <div class="theme-preview__section-header">
          <h3 class="theme-preview__section-title">Feedback</h3>
          <p class="theme-preview__section-description">Messages and notifications</p>
        </div>
        
        <div class="theme-preview__section-content">
          <!-- Messages -->
          <div class="theme-preview__group">
            <h4 class="theme-preview__group-title">Messages</h4>
            <div class="theme-preview__group-content theme-preview__group-content--vertical">
              <Message severity="success">Success message example</Message>
              <Message severity="info">Info message example</Message>
              <Message severity="warn">Warning message example</Message>
              <Message severity="error">Error message example</Message>
            </div>
          </div>

          <!-- Toast triggers -->
          <div class="theme-preview__group">
            <h4 class="theme-preview__group-title">Toast Notifications</h4>
            <div class="theme-preview__group-content">
              <Button 
                label="Show Success Toast" 
                severity="success"
                size="small"
                @click="showToast('success')"
              />
              <Button 
                label="Show Info Toast" 
                severity="info"
                size="small"
                @click="showToast('info')"
              />
              <Button 
                label="Show Warning Toast" 
                severity="warning"
                size="small"
                @click="showToast('warn')"
              />
              <Button 
                label="Show Error Toast" 
                severity="danger"
                size="small"
                @click="showToast('error')"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.theme-preview {
  @apply h-full bg-white dark:bg-gray-900;
}

.theme-preview__header {
  @apply bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700;
  @apply px-6 py-4 sticky top-0 z-10;
}

.theme-preview__header-content {
  @apply flex items-center justify-between;
}

.theme-preview__title {
  @apply text-xl font-semibold text-gray-900 dark:text-white;
}

.theme-preview__status {
  @apply flex items-center gap-4;
}

.theme-preview__changes-indicator {
  @apply flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400;
}

.theme-preview__changes-indicator i {
  @apply text-xs animate-pulse;
}

.theme-preview__loading-indicator {
  @apply flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400;
}

.theme-preview__content {
  @apply p-6 space-y-8 overflow-y-auto;
}

.theme-preview__section {
  @apply bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700;
  @apply p-6 shadow-sm;
}

.theme-preview__section-header {
  @apply mb-6 pb-4 border-b border-gray-200 dark:border-gray-700;
}

.theme-preview__section-title {
  @apply text-lg font-semibold text-gray-900 dark:text-white mb-1;
}

.theme-preview__section-description {
  @apply text-sm text-gray-600 dark:text-gray-400;
}

.theme-preview__section-content {
  @apply space-y-6;
}

.theme-preview__group {
  @apply space-y-3;
}

.theme-preview__group-title {
  @apply text-sm font-medium text-gray-700 dark:text-gray-300;
}

.theme-preview__group-content {
  @apply flex flex-wrap items-center gap-3;
}

.theme-preview__group-content--vertical {
  @apply flex-col items-stretch;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .theme-preview__content {
    @apply p-4 space-y-6;
  }
  
  .theme-preview__section {
    @apply p-4;
  }
  
  .theme-preview__group-content {
    @apply gap-2;
  }
}
</style>