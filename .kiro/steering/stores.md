# Паттерны написания Pinia Store

## Composition API стиль

### Базовая структура store
```javascript
import { defineStore, acceptHMRUpdate } from 'pinia'
import { ref, computed, watch } from 'vue'

export const useUserStore = defineStore('userStore', () => {
  // ============================================================================
  // State (реактивные данные)
  // ============================================================================
  
  const user = ref(null)
  const isLoading = ref(false)
  const error = ref(null)
  
  // ============================================================================
  // Getters (computed свойства)
  // ============================================================================
  
  const isAuthenticated = computed(() => {
    return user.value !== null && user.value.accessToken
  })
  
  const userDisplayName = computed(() => {
    if (!user.value) return 'Гость'
    return user.value.name || user.value.email
  })
  
  // ============================================================================
  // Actions (методы)
  // ============================================================================
  
  const initUser = (userData) => {
    if (!userData) return
    user.value = userData
  }
  
  const resetUser = () => {
    user.value = null
    error.value = null
  }
  
  const updateUser = (updates) => {
    if (!user.value) return
    user.value = { ...user.value, ...updates }
  }
  
  // ============================================================================
  // Persistence (сохранение в localStorage)
  // ============================================================================
  
  const getUserFromLocalStorage = () => {
    try {
      const data = localStorage.getItem('user')
      return data ? JSON.parse(data) : null
    } catch (e) {
      console.error('Error parsing user data from localStorage:', e)
      localStorage.removeItem('user')
      return null
    }
  }
  
  const setUserToLocalStorage = () => {
    if (user.value) {
      localStorage.setItem('user', JSON.stringify(user.value))
    } else {
      localStorage.removeItem('user')
    }
  }
  
  // ============================================================================
  // Watchers (отслеживание изменений)
  // ============================================================================
  
  watch(user, setUserToLocalStorage, { deep: true })
  
  // ============================================================================
  // Initialization (инициализация)
  // ============================================================================
  
  // Инициализация при создании store
  initUser(getUserFromLocalStorage())
  
  // ============================================================================
  // Return (возвращаемые значения)
  // ============================================================================
  
  return {
    // State
    user,
    isLoading,
    error,
    
    // Getters
    isAuthenticated,
    userDisplayName,
    
    // Actions
    initUser,
    resetUser,
    updateUser,
  }
})

// ============================================================================
// HMR Support (поддержка горячей перезагрузки)
// ============================================================================

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
```

## Сложный store с API интеграцией

```javascript
import { defineStore, acceptHMRUpdate } from 'pinia'
import { ref, computed } from 'vue'

export const usePostsStore = defineStore('postsStore', () => {
  // ============================================================================
  // State
  // ============================================================================
  
  const posts = ref([])
  const currentPost = ref(null)
  const isLoading = ref(false)
  const error = ref(null)
  const pagination = ref({
    page: 1,
    limit: 10,
    total: 0,
  })
  
  // ============================================================================
  // Getters
  // ============================================================================
  
  const totalPages = computed(() => {
    return Math.ceil(pagination.value.total / pagination.value.limit)
  })
  
  const hasNextPage = computed(() => {
    return pagination.value.page < totalPages.value
  })
  
  const hasPrevPage = computed(() => {
    return pagination.value.page > 1
  })
  
  const getPostById = computed(() => {
    return (id) => posts.value.find(post => post.id === id)
  })
  
  // ============================================================================
  // Actions
  // ============================================================================
  
  const fetchPosts = async (page = 1) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await axios.get('/api/posts', {
        params: {
          page,
          limit: pagination.value.limit,
        },
      })
      
      posts.value = response.data.data
      pagination.value = {
        ...pagination.value,
        page,
        total: response.data.total,
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Ошибка загрузки постов'
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  const fetchPost = async (id) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await axios.get(`/api/posts/${id}`)
      currentPost.value = response.data.data
      
      // Обновляем пост в списке, если он там есть
      const index = posts.value.findIndex(post => post.id === id)
      if (index !== -1) {
        posts.value[index] = response.data.data
      }
      
      return response.data.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Ошибка загрузки поста'
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  const createPost = async (postData) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await axios.post('/api/posts', postData)
      const newPost = response.data.data
      
      // Добавляем новый пост в начало списка
      posts.value.unshift(newPost)
      pagination.value.total += 1
      
      return newPost
    } catch (err) {
      error.value = err.response?.data?.message || 'Ошибка создания поста'
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  const updatePost = async (id, updates) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await axios.put(`/api/posts/${id}`, updates)
      const updatedPost = response.data.data
      
      // Обновляем пост в списке
      const index = posts.value.findIndex(post => post.id === id)
      if (index !== -1) {
        posts.value[index] = updatedPost
      }
      
      // Обновляем текущий пост, если это он
      if (currentPost.value?.id === id) {
        currentPost.value = updatedPost
      }
      
      return updatedPost
    } catch (err) {
      error.value = err.response?.data?.message || 'Ошибка обновления поста'
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  const deletePost = async (id) => {
    isLoading.value = true
    error.value = null
    
    try {
      await axios.delete(`/api/posts/${id}`)
      
      // Удаляем пост из списка
      const index = posts.value.findIndex(post => post.id === id)
      if (index !== -1) {
        posts.value.splice(index, 1)
        pagination.value.total -= 1
      }
      
      // Очищаем текущий пост, если это он
      if (currentPost.value?.id === id) {
        currentPost.value = null
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Ошибка удаления поста'
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  const clearError = () => {
    error.value = null
  }
  
  const resetStore = () => {
    posts.value = []
    currentPost.value = null
    error.value = null
    pagination.value = {
      page: 1,
      limit: 10,
      total: 0,
    }
  }
  
  // ============================================================================
  // Return
  // ============================================================================
  
  return {
    // State
    posts,
    currentPost,
    isLoading,
    error,
    pagination,
    
    // Getters
    totalPages,
    hasNextPage,
    hasPrevPage,
    getPostById,
    
    // Actions
    fetchPosts,
    fetchPost,
    createPost,
    updatePost,
    deletePost,
    clearError,
    resetStore,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePostsStore, import.meta.hot))
}
```

## Паттерны использования в компонентах

### Базовое использование
```vue
<script setup>
const userStore = useUserStore()
const postsStore = usePostsStore()

// Реактивные данные из store
const { user, isAuthenticated } = storeToRefs(userStore)
const { posts, isLoading } = storeToRefs(postsStore)

// Методы можно использовать напрямую
const { resetUser } = userStore
const { fetchPosts, createPost } = postsStore

onMounted(() => {
  if (isAuthenticated.value) {
    fetchPosts()
  }
})
</script>
```

### Обработка ошибок
```vue
<script setup>
const postsStore = usePostsStore()
const toast = useToast()

const handleCreatePost = async (postData) => {
  try {
    await postsStore.createPost(postData)
    toast.add({
      severity: 'success',
      summary: 'Успех',
      detail: 'Пост создан',
    })
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: postsStore.error || 'Не удалось создать пост',
    })
  }
}
</script>
```

## Рекомендации

### 1. Структура store
- Группируйте код по секциям с комментариями
- State в начале
- Getters после state
- Actions после getters
- Вспомогательные функции в конце

### 2. Именование
- Store: `useFeatureStore`
- State: описательные имена (`isLoading`, `error`)
- Actions: глаголы (`fetchData`, `updateItem`)
- Getters: существительные или вопросы (`isAuthenticated`, `hasItems`)

### 3. Обработка ошибок
- Всегда устанавливайте `error` в `null` перед запросом
- Сохраняйте ошибки в state для отображения в UI
- Пробрасывайте ошибки для обработки в компонентах

### 4. Persistence
- Используйте watchers для автоматического сохранения
- Обрабатывайте ошибки парсинга JSON
- Очищайте localStorage при ошибках

### 5. HMR Support
- Всегда добавляйте поддержку горячей перезагрузки
- Используйте `acceptHMRUpdate` для каждого store

### 6. TypeScript (опционально)
```typescript
interface User {
  id: number
  name: string
  email: string
  accessToken?: string
}

export const useUserStore = defineStore('userStore', () => {
  const user = ref<User | null>(null)
  // ...
})
```