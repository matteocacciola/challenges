export const travelsRoutes = [
  {
    path: "/travels",
    name: "travels",
    component: () => import("../views/travels/TravelsList.vue"),
    meta: {
      title: "List of Travels"
    }
  },
  {
    path: "/travels/new",
    name: "travel-new",
    component: () => import("../views/travels/TravelCreate.vue"),
    meta: {
      role: "admin",
      title: "New Travel"
    }
  }
]
