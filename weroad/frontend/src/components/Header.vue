<template>
    <Disclosure
        v-slot="{ open }"
        as="nav"
        class="bg-white shadow z-20"
    >
        <div class="mx-auto px-2">
            <div class="relative flex h-16 justify-between">
                <div class="flex flex-1">
                    <div class="flex flex-shrink-0 items-center">
                        <DynamicSidebarHamburger />
                        <router-link to="/">
                            <Logo class="h-8 pl-2 w-auto" />
                        </router-link>
                    </div>
                </div>
                <div class="absolute inset-y-0 right-0 flex items-center pr-5">
                    <!-- Profile dropdown -->
                    <Menu
                        as="div"
                        class="relative ml-1"
                    >
                        <div>
                          <MenuButton
                              class="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          >
                              <span class="sr-only">Open user menu</span>
                              <Avatar :name="name" />
                          </MenuButton>
                        </div>
                        <transition
                            enter-active-class="transition ease-out duration-200"
                            enter-from-class="transform opacity-0 scale-95"
                            enter-to-class="transform opacity-100 scale-100"
                            leave-active-class="transition ease-in duration-75"
                            leave-from-class="transform opacity-100 scale-100"
                            leave-to-class="transform opacity-0 scale-95"
                        >
                            <MenuItems
                                class="z-50 absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                            >
                                <MenuItem v-slot="{ active }" v-if="!authStore.token">
                                    <router-link
                                        :class="[active ? 'bg-gray-100' : '', 'px-4 py-2 text-sm text-gray-700 flex']"
                                        to="/login"
                                    >
                                        <ArrowLeftOnRectangleIcon class="h-5 w-5 mr-1" />
                                        Login
                                    </router-link>
                                </MenuItem>
                                <MenuItem v-slot="{ active }" v-else>
                                    <a
                                        :class="[active ? 'bg-gray-100' : '', 'px-4 py-2 text-sm text-gray-700 flex']"
                                        @click="authStore.logout()"
                                    >
                                        <ArrowRightOnRectangleIcon class="h-5 w-5 mr-1" />
                                        Logout
                                    </a>
                                  </MenuItem>
                            </MenuItems>
                        </transition>
                    </Menu>
                </div>
            </div>
        </div>
    </Disclosure>
</template>

<script setup lang="ts">
import { Disclosure, Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue"
import { ArrowRightOnRectangleIcon, ArrowLeftOnRectangleIcon } from "@heroicons/vue/24/outline"
import Avatar from "../components/Avatar.vue"
import DynamicSidebarHamburger from "../components/DynamicSidebarHamburger.vue"
import { useAuthStore } from "../stores"
import Logo from "../components/Logo.vue"

const authStore = useAuthStore()
</script>
