import { defineStore } from "pinia";
import RolesApi from "../api/roles";

export const userConfigStore = defineStore("config", {
  state: () => ({
    roles: [],
    fetch: true,
  }),
  actions: {
    async fetchUserRoles() {
      this.fetch = false;
      this.roles = await RolesApi.getLoggedInUserRole();
    },
  },
});
