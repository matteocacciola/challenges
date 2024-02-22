<template>
    <div
        :class="[
            { 'md:w-16': sidebarStore.sidebarCollapsed, 'md:w-64': !sidebarStore.sidebarCollapsed },
            'hidden md:h-full md:flex md:flex-col relative'
        ]"
    >
        <div
            class="flex min-h-0 flex-1 flex-col border-r bg-gray-800 border-gray-200 overflow-auto"
            style="height: 100vh"
        >
            <div class="flex flex-1 flex-col overflow-y-auto pb-4">
                <nav class="mt-3 flex-1 space-y-1 px-2">
                    <router-link
                        v-for="item in navig"
                        :key="item.name"
                        :to="item.href"
                        :title="item.name"
                        :class="[
                            item.current ? 'bg-gray-700 text-white pr-1' : 'px-2 text-gray-400 hover:bg-gray-500 hover:text-gray-100',
                            'group flex items-center py-2 text-sm font-medium rounded-md']"
                    >
                        <div
                            v-if="item.current"
                            class="h-5 w-1 bg-red-700 mr-1"
                        />
                        <component
                            :is="item.icon"
                            :class="[item.current ? 'text-white' : 'text-gray-400 group-hover:text-gray-100',
                                     'ml-1 flex-shrink-0 h-6 w-6']"
                            aria-hidden="true"
                        />
                        <div :class="[{ 'hidden': sidebarStore.sidebarCollapsed, 'block': !sidebarStore.sidebarCollapsed }, 'ml-2']">
                            {{ item.name }}
                        </div>
                    </router-link>
                    <button
                        type="button"
                        class="bg-red-700 border-gray-900 text-gray-100 flex w-6 h-6 rounded-full absolute -right-3
                            top-10 transform justify-center items-center font-extrabold hover:bg-red-900 hover:text-white"
                        @click="sidebarStore.onClickCollapse()"
                        :key="sidebarStore.sidebarCollapsed"
                    >
                        <ChevronRightIcon
                            v-if="sidebarStore.sidebarCollapsed"
                            class="w-4"
                        />
                        <ChevronLeftIcon
                            v-else
                            class="w-4"
                        />
                    </button>
                </nav>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import {ref, onMounted} from "vue";
import {useRoute} from "vue-router";
import {ChevronLeftIcon, ChevronRightIcon} from "@heroicons/vue/24/outline";
import type {NavigationItem} from "../models/navigationItem";
import {dynamicSidebarStore} from "../stores";

const sidebarStore = dynamicSidebarStore();

const route = useRoute();
const navig = ref<Array<NavigationItem>>([]);
const props = defineProps({
    navigation: Array<NavigationItem>,
});

onMounted(() => {
    navig.value = props.navigation?.map((item) => ({
        ...item,
        current: route.fullPath.startsWith(item.href),
    }));
});
</script>
