// import './assets/main.css'

import { createApp } from "vue";
import { createPinia } from "pinia";

// pinia-plugin-persistedstate
import piniaPluginPersistedState from "pinia-plugin-persistedstate";

import Antd from "ant-design-vue";
import "ant-design-vue/dist/reset.css";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(createPinia().use(piniaPluginPersistedState));
app.use(router);
app.use(Antd).mount("#app");
