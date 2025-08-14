# Паттерны компонентов и использование PrimeVue

## Стиль написания компонентов

### Composition API с Script Setup
```vue
<script setup>
// Импорты (если нужны явные)
import { motion } from 'motion-v'

// Props
const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

// Emits
const emit = defineEmits(['update', 'delete'])

// Композаблы и реактивные данные
const userStore = useUserStore()
const router = useRouter()
const toast = useToast()

const isLoading = ref(false)
const formData = reactive({
  name: '',
  email: '',
})

// Computed
const isValid = computed(() => {
  return formData.name && formData.email
})

// Methods
const handleSubmit = async () => {
  if (!isValid.value) return
  
  isLoading.value = true
  try {
    await submitData(formData)
    emit('update', formData)
    toast.add({
      severity: 'success',
      summary: 'Успех',
      detail: 'Данные сохранены',
    })
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: error.message,
    })
  } finally {
    isLoading.value = false
  }
}

// Lifecycle
onMounted(() => {
  // Инициализация
})

// defineOptions для метаданных
defineOptions({
  name: 'UserProfile',
})
</script>

<template>
  <div class="user-profile">
    <!-- Контент -->
  </div>
</template>

<style scoped>
.user-profile {
  @apply bg-white dark:bg-gray-800 rounded-lg p-6;
}
</style>
```

## Паттерны использования PrimeVue

### Формы с валидацией
```vue
<script setup>
const initialValues = ref({
  email: '',
  password: '',
})

const loginSchema = z.object({
  email: z.string().trim().email({ message: 'Введите корректный Email' }),
  password: z.string().trim().min(3, { message: 'Минимум 3 символа' }),
})

const loginResolver = zodResolver(loginSchema)

const handleSubmit = async (e) => {
  if (!e.valid) return
  
  const { email, password } = e.states
  // Обработка формы
}
</script>

<template>
  <Form
    class="flex flex-col items-center w-full max-w-md"
    :initialValues
    :resolver="loginResolver"
    @submit="handleSubmit"
  >
    <div class="mb-8 w-full">
      <FormField
        v-slot="$field"
        :validateOnValueUpdate="false"
        validateOnBlur
        name="email"
      >
        <FloatLabel class="app-input text-base">
          <InputText
            id="email"
            v-tooltip.top="{
              value: $field.error?.message,
              showDelay: 500,
            }"
            :invalid="$field?.invalid"
            fluid
            class="rounded-xl text-base"
          />
          <Message
            class="app-input-message"
            :severity="$field?.invalid ? 'error' : 'contrast'"
            variant="simple"
            v-if="$field?.invalid && $field.error?.message"
          >
            {{ $field.error?.message }}
          </Message>
          <label for="email">Email</label>
        </FloatLabel>
      </FormField>
    </div>
    
    <Button
      class="w-fit h-[3.25rem] p-4 rounded-xl text-base"
      type="submit"
      label="Отправить"
      :disabled="isLoading"
    />
  </Form>
</template>
```

### Таблицы данных
```vue
<script setup>
const data = ref([])
const loading = ref(false)
const selectedItems = ref([])

const columns = [
  { field: 'name', header: 'Имя' },
  { field: 'email', header: 'Email' },
  { field: 'status', header: 'Статус' },
]

const loadData = async () => {
  loading.value = true
  try {
    data.value = await fetchUsers()
  } finally {
    loading.value = false
  }
}

onMounted(loadData)
</script>

<template>
  <DataTable
    v-model:selection="selectedItems"
    :value="data"
    :loading="loading"
    selectionMode="multiple"
    dataKey="id"
    class="rounded-lg overflow-hidden"
    pt:table:class="border-collapse"
    pt:header:class="bg-gray-50 dark:bg-gray-700"
  >
    <Column selectionMode="multiple" headerStyle="width: 3rem" />
    
    <Column
      v-for="col in columns"
      :key="col.field"
      :field="col.field"
      :header="col.header"
      sortable
    />
    
    <Column header="Действия">
      <template #body="{ data }">
        <Button
          icon="pi pi-pencil"
          severity="info"
          text
          rounded
          @click="editItem(data)"
        />
        <Button
          icon="pi pi-trash"
          severity="danger"
          text
          rounded
          @click="deleteItem(data)"
        />
      </template>
    </Column>
  </DataTable>
</template>
```

### Диалоги и модальные окна
```vue
<script setup>
const visible = ref(false)
const confirm = useConfirm()

const showDialog = () => {
  visible.value = true
}

const confirmDelete = (item) => {
  confirm.require({
    message: `Удалить ${item.name}?`,
    header: 'Подтверждение удаления',
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined',
    acceptClass: 'p-button-danger',
    accept: () => {
      deleteItem(item)
    }
  })
}
</script>

<template>
  <Button label="Открыть диалог" @click="showDialog" />
  
  <Dialog
    v-model:visible="visible"
    modal
    header="Заголовок диалога"
    :style="{ width: '50vw' }"
    class="app-dialog"
  >
    <p>Содержимое диалога</p>
    
    <template #footer>
      <Button
        label="Отмена"
        severity="secondary"
        @click="visible = false"
      />
      <Button
        label="Сохранить"
        @click="handleSave"
      />
    </template>
  </Dialog>
</template>
```

## UI компоненты

### Анимированные контейнеры
```vue
<script setup>
const props = defineProps({
  preset: {
    type: String,
    default: 'fadeIn',
  },
  delay: {
    type: Number,
    default: 0,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const { createAnimationProps } = useAnimationPresets()

const animationProps = computed(() => {
  if (props.disabled) return {}
  return createAnimationProps(props.preset, {}, props.delay)
})
</script>

<template>
  <motion.div v-bind="animationProps" :class="containerClass">
    <slot />
  </motion.div>
</template>
```

### Списки с анимацией
```vue
<script setup>
const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  itemKey: {
    type: String,
    default: 'id',
  },
})

const { getListAnimationProps } = useAnimationPresets()
</script>

<template>
  <AnimatePresence>
    <motion.div
      v-for="(item, index) in items"
      :key="item[itemKey]"
      v-bind="getListAnimationProps(index)"
      class="list-item"
    >
      <slot :item="item" :index="index" />
    </motion.div>
  </AnimatePresence>
</template>
```

## Layout компоненты

### Основной макет
```vue
<script setup>
const props = defineProps({
  title: String,
  showHeader: {
    type: Boolean,
    default: true,
  },
  showSidebar: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <div class="app-layout min-h-screen bg-gray-50 dark:bg-gray-900">
    <header v-if="showHeader" class="app-header">
      <div class="container mx-auto px-4">
        <h1 v-if="title" class="text-2xl font-semibold">{{ title }}</h1>
        <slot name="header" />
      </div>
    </header>
    
    <div class="app-content flex">
      <aside v-if="showSidebar" class="app-sidebar">
        <slot name="sidebar" />
      </aside>
      
      <main class="app-main flex-1">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
.app-header {
  @apply bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 py-4;
}

.app-sidebar {
  @apply w-64 bg-white dark:bg-gray-800 shadow-sm border-r border-gray-200 dark:border-gray-700;
}

.app-main {
  @apply p-6;
}
</style>
```

## Рекомендации

### 1. Структура компонента
- Props в начале
- Emits после props
- Композаблы и реактивные данные
- Computed свойства
- Методы
- Lifecycle хуки
- defineOptions в конце

### 2. Именование
- Компоненты: PascalCase
- Props: camelCase
- Events: kebab-case
- CSS классы: kebab-case с префиксом app-

### 3. Стилизация
- Используйте Tailwind классы в template
- Scoped стили для кастомных стилей
- Префикс app- для глобальных классов

### 4. Доступность
- Используйте семантические HTML элементы
- Добавляйте aria-атрибуты где необходимо
- Поддерживайте навигацию с клавиатуры

### 5. Производительность
- Используйте v-memo для тяжелых списков
- Ленивая загрузка для больших компонентов
- Оптимизируйте реактивность с shallowRef/shallowReactive