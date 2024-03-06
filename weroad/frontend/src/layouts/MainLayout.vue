<template>
    <!-- mobile sidebar -->
    <DynamicSidebar
        :navigation="navigation"
        @close-side-bar="sidebarStore.onClickSideBar()"
        :key="key"
    />
    <Header />

    <div
        id="main"
        class="flex h-full min-h-screen"
    >
        <div class="flex-none">
            <!-- desktop sidebar -->
            <Sidebar :navigation="navigation" :key="key" />
        </div>

        <div
            class="flex-1 flex-col overflow-auto"
            style="height: calc(100vh - 64px)"
        >
            <main class="flex-1">
                <div class="py-6">
                    <div class="mx-auto px-4 sm:px-6 md:px-8">
                        <div class="py-4">
                            <router-view />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref } from "vue"
import { useRouter, RouterView } from "vue-router"
import "vite/modulepreload-polyfill"
import Header from "../components/Header.vue"
import Sidebar from "../components/Sidebar.vue"
import DynamicSidebar from "@/components/DynamicSidebar.vue"
import type { NavigationItem } from "../models/navigationItem"
import { useDynamicSidebarStore, useConfigStore } from "../stores"
import { LifebuoyIcon, TicketIcon, UserPlusIcon } from "@heroicons/vue/24/outline"

const userRoles = useConfigStore().userRoles

const navigation: Array<NavigationItem> = [
  { name: "Tours", href: "/tours", icon: LifebuoyIcon, current: false },
  { name: "Travels", href: "/travels", icon: TicketIcon, current: false }
]
if (userRoles.includes("admin")) {
  navigation.push({ name: "Create User", icon: UserPlusIcon, href: "/users/new", current: false })
}

const sidebarStore = useDynamicSidebarStore()

const key = ref(0)

const router = useRouter()
router.afterEach((to, from) => {
  key.value += 1
})
</script>
