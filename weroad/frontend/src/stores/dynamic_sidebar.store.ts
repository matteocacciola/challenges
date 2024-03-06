import { defineStore } from "pinia"

export const useDynamicSidebarStore = defineStore("counter", {
  state: () => {
    let sidebar = JSON.parse(localStorage.getItem("weroad.sidebar"))
    if (!sidebar) {
      sidebar = {
        collapsed: true
      }
      localStorage.setItem("weroad.sidebar", JSON.stringify(sidebar))
    }
    return {
      sidebarOpen: false,
      sidebarCollapsed: sidebar.collapsed
    }
  },
  actions: {
    onClickSideBar() {
      this.sidebarOpen = !this.sidebarOpen
    },
    onClickCollapse() {
      const sidebar = JSON.parse(localStorage.getItem("weroad.sidebar"))
      sidebar.collapsed = !sidebar.collapsed
      localStorage.setItem("weroad.sidebar", JSON.stringify(sidebar))
      this.sidebarCollapsed = sidebar.collapsed
    }
  }
})
