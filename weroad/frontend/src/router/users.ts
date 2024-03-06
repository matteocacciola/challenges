export const usersRoutes = [
  {
    path: "/users/new",
    name: "user-new",
    component: () => import("../views/users/UserCreate.vue"),
    meta: {
      role: "admin",
      title: "New User"
    }
  }
]
