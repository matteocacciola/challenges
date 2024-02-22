export * from "./auth.store";
export * from "./notification.store";
export * from "./dynamic_sidebar.store";
export * from "./config.store";

import { createPinia } from "pinia";

export const pinia = createPinia();
