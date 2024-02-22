<template>
    <div class="sticky top-0 z-10 bg-white pl-1 pt-1 md:hidden">
        <button
            type="button"
            class="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500"
            @click="sidebarStore.onClickSideBar()"
        >
            <span class="sr-only">Open sidebar</span>
            <Bars3Icon
                class="h-6 w-6"
                aria-hidden="true"
            />
        </button>
    </div>
</template>
<script setup lang="ts">
import {Bars3Icon} from "@heroicons/vue/24/outline";
import {dynamicSidebarStore} from "../stores";

const sidebarStore = dynamicSidebarStore();
</script>
