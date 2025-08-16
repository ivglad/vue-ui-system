import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import registerPlugins from '@/plugins/index'
import '@/assets/styles/tailwind.css'
import '@/assets/styles/index.scss'

const pinia = createPinia()
const app = createApp(App)

app.use(router)
app.use(pinia)

registerPlugins(app)

app.mount('#app')
