import { createApp } from "vue";
import App from "./App.vue";
import { routes } from "./router/index"
import { createRouter, createWebHistory } from "vue-router"
import { createStore } from "vuex"
import "./assets/tailwind.css";

const store = createStore({
  state () {
    return {
      copyYear: '',
    }
  },
  mutations: {
  }
})

const app = createApp(App)

const router = createRouter({
  history: createWebHistory(),
  routes,
})

app.use(router)
app.use(store)
app.mount('#app');
