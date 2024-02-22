import { createApp } from "vue";
import { pinia } from "./stores";
import App from "./App.vue";
import { router } from "./router";
import "./assets/main.scss";
import directives from "./directives";

const app = createApp(App);

directives(app);

app.use(pinia);
app.use(router);
app.mount("#app");
