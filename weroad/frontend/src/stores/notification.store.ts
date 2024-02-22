import { defineStore } from "pinia";
import type { Notification } from "../models/notification";

export const useNotificationStore = defineStore("notification", {
  state: () => ({
    notifications: Array<Notification>(),
  }),
});
