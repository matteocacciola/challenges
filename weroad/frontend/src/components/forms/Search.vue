<template>
    <div class="sticky top-0 z-10 flex h-10 shadow flex-shrink-0 ring-1 ring-black ring-opacity-5 md:rounded-lg bg-white px-4">
        <div class="flex flex-1 justify-between px-4 md:px-0">
            <div class="flex flex-1">
                <label
                    :for="'search-field-' + searchName"
                    class="sr-only"
                >Search</label>
                <div class="relative w-full text-gray-400 focus-within:text-gray-600">
                    <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center">
                        <MagnifyingGlassIcon
                            class="h-5 w-5"
                            aria-hidden="true"
                        />
                    </div>
                    <input
                        :id="'search-field-' + searchName"
                        @input="doSearch"
                        :value="modelValue"
                        :name="'search-field-' + searchName"
                        type="search"
                        placeholder="Search"
                        class="block h-full w-full border-transparent py-2 pl-8 pr-3 text-gray-900 placeholder-gray-500 focus:border-transparent focus:placeholder-gray-400 focus:outline-none focus:ring-0 sm:text-sm"
                    >
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { MagnifyingGlassIcon } from "@heroicons/vue/20/solid";

let timeoutId = null;
const emit = defineEmits(["update:modelValue"]);

defineProps<{
    modelValue: unknown
    searchName: string
}>();

async function doSearch(event) {
    if (timeoutId) {
        clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
        emit("update:modelValue", (event.target as any).value)
    }, 500);
}
</script>
