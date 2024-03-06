import { defineStore } from "pinia"
import { Client, cacheExchange, fetchExchange } from "@urql/core"
import { useAuthStore } from "./auth.store"

export const useGraphqlStore = defineStore("graphql", () => {
  const authStore = useAuthStore()

  return {
    client: new Client({
      url: import.meta.env.VITE_API_BASE_URL,
      fetchOptions: () => ({
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + authStore.getToken
        }
      }),
      exchanges: [cacheExchange, fetchExchange]
    })
  }
})
