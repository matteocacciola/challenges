import { createApp } from "vue"
import { createPinia } from "pinia"
import App from "./App.vue"
import { router } from "./router"
import directives from "./directives"
import "./assets/main.scss"

const app = createApp(App)

directives(app)

app.use(createPinia())
app.use(router)
app.mount("#app")
