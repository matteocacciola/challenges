<template>
    <div class="flex items-center justify-between border-t border-gray-200 bg-transparent py-3">
        <div class="flex flex-1 justify-between sm:hidden">
            <router-link
                class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                to="#"
            >Previous</router-link>
            <router-link
                class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                to="#"
            >Next</router-link>
        </div>
        <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
                <p class="text-sm text-gray-700">
                    Showing
                    {{ " " }}
                    <span class="font-medium">{{ (currentPage - 1) * size + 1 }}</span>
                    {{ " " }}
                    to
                    {{ " " }}
                    <span class="font-medium">{{ getLastElementNumber($props) }}</span>
                    {{ " " }}
                    of
                    {{ " " }}
                    <span class="font-medium">{{ totalItems }}</span>
                    {{ " " }}
                    results
                </p>
            </div>
            <div>
                <nav
                    aria-label="Pagination"
                    class="isolate inline-flex -space-x-px rounded-md shadow-sm"
                >
                    <router-link
                        v-if="currentPage > 1 && totalPages > 5"
                        :to="{ name: routeName, query: { ...getQueryParams(), page: currentPage - 1 } }"
                        class="relative inline-flex items-center rounded-l-md border border-gray-300 bg-transparent px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
                    >
                        <span class="sr-only">Previous</span>
                        <ChevronLeftIcon
                            aria-hidden="true"
                            class="h-5 w-5"
                        />
                    </router-link>
                    <!-- Generated: Page numbers -->
                    <div
                        v-for="(pageNum, index) in getPaginationPages($props)"
                        :key="index"
                    >
                        <router-link
                            :aria-current="pageNum === currentPage ? 'page' : null"
                            :class="{
                                'z-10 bg-red-50 border-red-500 text-red-600': pageNum === currentPage,
                                'rounded-l-md': (totalPages <= 5 || currentPage === 1) && index === 0 && index < 5,
                                'rounded-r-md': hasFivePagesLeft($props) && index === getPaginationPages($props).length - 1,
                                'hidden md:inline-flex':
                                    getPaginationPages($props).length > 5 && index > 2 && index < getPaginationPages($props).length - 3,
                            }"
                            :to="{ name: routeName, query: { ...getQueryParams(), page: pageNum } }"
                            class="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
                        >{{ pageNum }}</router-link>
                        <span
                            v-if="getPaginationPages($props).length > 5 && index === 2"
                            class="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700"
                        >...</span>
                    </div>
                    <!-- End generated -->
                    <router-link
                        v-if="!hasFivePagesLeft($props) && totalPages > 5"
                        :to="{ name: routeName, query: { ...getQueryParams(), page: currentPage + 1 } }"
                        class="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
                    >
                        <span class="sr-only">Next</span>
                        <ChevronRightIcon
                            aria-hidden="true"
                            class="h-5 w-5"
                        />
                    </router-link>
                </nav>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import {onMounted} from "vue";
import {ChevronLeftIcon, ChevronRightIcon} from "@heroicons/vue/20/solid";
import {useRoute} from "vue-router";

const route = useRoute();

const props = defineProps({
    currentPage: Number,
    size: Number,
    itemsOnPage: Number,
    totalPages: Number,
    totalItems: Number,
    routeName: String,
});

onMounted(() => {
    // save the current page in the local storage
    localStorage.setItem("currentPage", props.currentPage.toString());
});

const getLastElementNumber = ({ currentPage, size, itemsOnPage, totalPages, totalItems }) => {
    if (currentPage === totalPages) return totalItems;
    if (itemsOnPage < size) return itemsOnPage;
    return (currentPage - 1) * size + size;
};

const hasFivePagesLeft = ({ currentPage, totalPages }) => {
    return totalPages - currentPage <= 4;
};

const getPaginationPages = ({ currentPage, totalPages }) => {
    if (totalPages > 1 && totalPages <= 4) {
        return range(1, totalPages, 1);
    }
    if (totalPages > 1 && hasFivePagesLeft({ currentPage, totalPages })) {
        return range(totalPages - 4, totalPages, 1);
    }
    if (totalPages > 5) {
        return range(currentPage, currentPage + 2, 1).concat(range(totalPages - 2, totalPages, 1));
    }
    if (totalPages === 1) {
        return [1];
    }
    return range(1, totalPages, 1);
};

const range = (start, stop, step) => {
    return Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);
};

const getQueryParams = () => {
    if (!route.query)
        return {};

    const result = {};
    for (let entry of Object.entries(route.query)) {
        result[entry[0]] = encodeURIComponent(entry[1])
    }
    return result;
};
</script>
