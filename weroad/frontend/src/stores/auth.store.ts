import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: null,
  }),
  getters: {
    getToken: (state) => state.token,
  },
  actions: {
    updateState() {
      this.token = JSON.parse(localStorage.getItem("token")) as string;
    },
    logout() {
      localStorage.removeItem("token");
      window.location.href = "/";
    },
  },
});
