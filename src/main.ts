import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './assets/main.css'
import { useAuthStore } from './stores/auth';

const app = createApp(App);
const pinia = createPinia();

// Use Pinia for global state management
app.use(pinia)
app.use(router)

const authStore = useAuthStore();
authStore.init();


app.mount('#app')