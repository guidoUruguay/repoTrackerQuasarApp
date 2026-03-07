import { createApp } from "vue";
import { createPinia } from "pinia";
import { VueQueryPlugin } from "@tanstack/vue-query";
import { Quasar, Dark } from "quasar";
import router from "./router";
import i18n from "./locales";
import App from "./App.vue";

import "quasar/src/css/index.sass";
import "@quasar/extras/material-icons/material-icons.css";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(i18n);
app.use(VueQueryPlugin);
app.use(Quasar, {
  plugins: { Dark },
  config: {
    dark: true,
  },
});

Dark.set(true);

app.mount("#app");
