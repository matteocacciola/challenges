import { createRouter, createWebHistory } from "vue-router"
import { systemRoutes } from "./system"
import { toursRoutes } from "./tours"
import { travelsRoutes } from "./travels"
import { usersRoutes } from "./users"
import { useAuthStore, useConfigStore } from "../stores"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...systemRoutes, ...toursRoutes, ...travelsRoutes, ...usersRoutes]
})

const DEFAULT_TITLE = "WeRoad -"
router.beforeEach(async (to, from, next) => {
  document.title = DEFAULT_TITLE + (to.meta.title ? ` ${to.meta.title}` : "")

  const authStore = useAuthStore()
  const configStore = useConfigStore()

  let userRoles = [];
  await configStore.fetchUserRoles()
  userRoles = configStore.userRoles

  // get the route matching the path
  const route = to.matched.find((record) => record.path === to.path)
  if (route && route.meta.role) {
    if (authStore.getToken) {
      if (userRoles.includes(route.meta.role as string)) {
        next()
        return
      }
      next("/forbidden")
      return
    }
    authStore.logout()
    next("/")
    return
  }
  next()
})

export { router }
