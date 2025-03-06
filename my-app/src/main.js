// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import store from './store'

// Create and mount the Vue application
const app = createApp(App)

// Use Vuex store
app.use(store)

// Mount app
app.mount('#app')