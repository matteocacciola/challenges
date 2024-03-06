import { toRaw } from "vue"
import { defineStore } from "pinia"
import RolesApi from "../api/roles"
import type { RoleOutput } from "../graphql/types"

export const useConfigStore = defineStore("config", {
  state: () => ({
    roles: [],
  }),
  getters: {
    userRoles: (state): string[] => {
      const roles: RoleOutput[] = toRaw(state.roles)
      return roles.length ? roles.map((role) => role.name) : []
    }
  },
  actions: {
    async fetchUserRoles() {
      if (!this.roles.length) {
        this.roles = await RolesApi.getLoggedInUserRoles()
      }
    }
  }
})
