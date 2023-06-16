import { createApp } from 'vue'
import { createPinia } from 'pinia'
import FloatingVue from 'floating-vue'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'

import App from './App.vue'
import router from './router'

import 'normalize.css'
import 'floating-vue/dist/style.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(FloatingVue)
app.use(autoAnimatePlugin)

app.mount('#app')
