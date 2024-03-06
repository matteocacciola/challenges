import type { CombinedError } from "@urql/core"
import { toRaw } from "vue"
import type { DocumentNode } from "graphql"
import { useAuthStore, useNotificationStore, useGraphqlStore } from "../stores"

const process = <U>(data: U, error: CombinedError): U | null => {
  if (data) {
    return toRaw(data)
  }

  const errorMessage = error.graphQLErrors?.[0]?.message || "Internal error. Please, contact the administrator."
  const errorCode = error.graphQLErrors?.[0]?.extensions?.code || 500

  const authStore = useAuthStore()
  const notificationStore = useNotificationStore()

  if (errorCode === 401) {
    authStore.logout()
    return null
  }

  if (errorCode == 403) {
    notificationStore.notifications.push({
      type: "error",
      description: "Forbidden",
      timeout: 5000
    })
    return null
  }

  if (errorCode == 404) {
    notificationStore.notifications.push({
      type: "error",
      description: "Not found",
      timeout: 5000
    })
    return null
  }

  if (errorCode >= 400 && errorCode < 500) {
    notificationStore.notifications.push({
      type: "error",
      description: "An error occurred. Please, try again later or contact the administrator.",
      timeout: 5000
    })
    return null
  }

  notificationStore.notifications.push({
    type: "error",
    description: errorMessage,
    timeout: 5000
  })
  return null
}

export async function mutate<T, U>(m: DocumentNode, args?: T): Promise<U | null> {
  const graphqlStore = useGraphqlStore()

  try {
    const { data, error } = await graphqlStore.client.mutation(m, args).toPromise()

    return process<U | null>(data, error)
  } catch (error) {
    console.error("Error storing data:", error)
  }
}

export async function query<T, U>(q: DocumentNode, args?: T): Promise<U | null> {
  const graphqlStore = useGraphqlStore()

  try {
    const { error, data } = await graphqlStore.client.query(q, args).toPromise()

    return process<U | null>(data, error)
  } catch (error) {
    console.error("Error fetching data:", error)
  }
}
