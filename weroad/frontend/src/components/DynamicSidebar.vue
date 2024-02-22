<template>
    <TransitionRoot
        as="template"
        :show="sidebarStore.sidebarOpen"
    >
        <Dialog
            as="div"
            class="relative z-40 md:hidden"
            @close="sidebarStore.onClickSideBar()"
        >
            <TransitionChild
                as="template"
                enter="transition-opacity ease-linear duration-300"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="transition-opacity ease-linear duration-300"
                leave-from="opacity-100"
                leave-to="opacity-0"
            >
                <div class="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </TransitionChild>

            <div class="fixed inset-0 z-10 flex">
                <TransitionChild
                    as="template"
                    enter="transition ease-in-out duration-300 transform"
                    enter-from="-translate-x-full"
                    enter-to="translate-x-0"
                    leave="transition ease-in-out duration-300 transform"
                    leave-from="translate-x-0"
                    leave-to="-translate-x-full"
                >
                    <DialogPanel class="relative flex w-full max-w-xs flex-1 flex-col bg-gray-900">
                        <TransitionChild
                            as="template"
                            enter="ease-in-out duration-300"
                            enter-from="opacity-0"
                            enter-to="opacity-100"
                            leave="ease-in-out duration-300"
                            leave-from="opacity-100"
                            leave-to="opacity-0"
                        >
                            <div class="absolute top-0 right-0 -mr-12 pt-2">
                                <button
                                    type="button"
                                    class="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                    @click="sidebarStore.onClickSideBar()"
                                >
                                    <span class="sr-only">Close sidebar</span>
                                    <XMarkIcon
                                        class="h-6 w-6 text-white"
                                        aria-hidden="true"
                                    />
                                </button>
                            </div>
                        </TransitionChild>
                        <div class="h-0 flex-1 overflow-y-auto pt-5 pb-4">
                            <div class="flex flex-shrink-0 items-center px-4">
                                <Logo class="h-8 w-auto" mode="dark" />
                            </div>
                            <nav class="mt-5 space-y-1 px-2">
                                <router-link
                                    v-for="item in navig"
                                    :key="item.name"
                                    :to="item.href"
                                    :class="[item.current ? 'bg-gray-700 text-white pr-1' : 'px-2 text-gray-400 hover:bg-gray-500 hover:text-gray-100', 'group flex items-center py-2 text-sm font-medium rounded-md']"
                                >
                                    <div
                                        v-if="item.current"
                                        class="h-5 w-1 bg-red-700 mr-1"
                                    />
                                    <component
                                        :is="item.icon"
                                        :class="[item.current ? 'text-white' : 'text-gray-400 group-hover:text-gray-100', 'ml-1 mr-3 flex-shrink-0 h-6 w-6']"
                                        aria-hidden="true"
                                    />
                                    {{ item.name }}
                                </router-link>
                            </nav>
                        </div>
                    </DialogPanel>
                </TransitionChild>
                <div class="w-14 flex-shrink-0">
                    <!-- Force sidebar to shrink to fit close icon -->
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>
<script lang="ts">
import {useRoute} from "vue-router";
import {ref} from "vue";
import {XMarkIcon} from "@heroicons/vue/24/outline";
import {Dialog, DialogPanel, TransitionChild, TransitionRoot} from "@headlessui/vue";
import type {NavigationItem} from "../models/navigationItem";
import {dynamicSidebarStore} from "../stores";
import Logo from "../components/Logo.vue";

export default {
    components: {
        Logo,
        XMarkIcon,
        Dialog,
        DialogPanel,
        TransitionChild,
        TransitionRoot
    },
    props: {
        navigation: Array as () => Array<NavigationItem>,
    },
    emits: ["closeSideBar"],
    setup(props, {emit}) {
        const onCloseSideBar = () => {
            emit("closeSideBar")
        };

        return {onCloseSideBar};
    },
    data() {
        return {
            navig: ref<Array<NavigationItem>>([]),
            sidebarStore: dynamicSidebarStore()
        };
    },
    mounted() {
        const route = useRoute();
        this.navig = this.navigation?.map((item) => ({
            ...item,
            current: route.fullPath.startsWith(item.href),
        }));
    }
};
</script>
