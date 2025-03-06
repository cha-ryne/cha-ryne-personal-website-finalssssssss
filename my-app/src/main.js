// src/main.js
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import store from './store'

// Import Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faLinkedin, faVuejs, faJava, faPython } from '@fortawesome/free-brands-svg-icons'
import { 
  faGraduationCap, 
  faLaptopCode, 
  faImages, 
  faHeart, 
  faStar, 
  faLink,
  faTh,
  faSquare,
  faPoll,
  faExternalLinkAlt
} from '@fortawesome/free-solid-svg-icons'

// Add icons
library.add(
  faLinkedin, faVuejs, faJava, faPython,
  faGraduationCap, faLaptopCode, faImages, faHeart, 
  faStar, faLink, faTh, faSquare, faPoll, faExternalLinkAlt
)

// Create router (even though we're using hash links for single page)
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: App
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
        top: 80 // Header offset
      }
    }
    return savedPosition || { top: 0 }
  }
})

// Create and mount the Vue application
const app = createApp(App)

// Register global components
app.component('font-awesome-icon', FontAwesomeIcon)

// Use plugins
app.use(store)
app.use(router)

// Mount app
app.mount('#app')