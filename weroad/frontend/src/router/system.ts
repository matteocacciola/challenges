export const systemRoutes = [
  {
    path: "/login",
    name: "login",
    component: () => import("../views/Login.vue"),
    meta: {
      requiresAuth: false,
      layout: "AuthLayout",
      title: "Login"
    }
  },
  {
    path: "/forbidden",
    name: "forbidden-error",
    component: () => import("../views/errors/Forbidden.vue"),
    meta: {
      requiresAuth: true,
      title: "Forbidden"
    }
  },
  {
    path: "/not-found",
    name: "notfound-error",
    component: () => import("../views/errors/NotFound.vue"),
    meta: {
      requiresAuth: true,
      title: "Page not found"
    }
  },
  {
    path: "/error",
    name: "internal-error",
    component: () => import("../views/errors/Internal.vue"),
    meta: {
      requiresAuth: true,
      title: "Internal error"
    }
  }
]
