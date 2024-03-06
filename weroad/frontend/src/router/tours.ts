export const toursRoutes = [
  {
    path: "/tours",
    name: "tours",
    component: () => import("../views/tours/ToursList.vue"),
    meta: {
      title: "List of Tours"
    }
  },
  {
    path: "/tours/new",
    name: "tour-new",
    component: () => import("../views/tours/TourCreate.vue"),
    meta: {
      role: "admin",
      title: "New Tour"
    }
  },
  {
    path: "/tours/:id",
    name: "tour-edit",
    component: () => import("../views/tours/TourUpdate.vue"),
    meta: {
      role: "editor",
      title: "Product Instance detail"
    }
  }
]
