<template>
    <div class="mt-2 flex flex-col">
        <div class="-my-2 -mx-4 overflow-x-auto">
            <div class="inline-block min-w-full py-2 align-middle md:px-4 ">
                <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                    <table class="min-w-full divide-y divide-gray-300">
                        <thead class="bg-gray-50">
                            <tr>
                                <th
                                    v-for="column in columns"
                                    scope="col"
                                    class="py-3.5 pl-4 pr-3 text-left text-xs font-semibold text-gray-900 sm:pl-6"
                                >
                                    {{ column.name }}
                                </th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200 bg-white">
                            <tr
                                v-for="item in [{},{},{}]"
                                v-if="items?.length === 0"
                            >
                                <template v-for="column in columns">
                                    <td class="whitespace-nowrap w-auto py-4 pl-4 pr-3 text-xs font-medium text-gray-900 sm:pl-6">
                                        <div class="animate-pulse h-2 bg-gray-300 rounded col-span-2" />
                                    </td>
                                </template>
                            </tr>
                            <tr
                                v-for="item in items"
                                v-if="items"
                                :key="item[columns[0] as any]"
                            >
                                <template v-for="column in columns">
                                    <td
                                        v-if="column.type === 'string[]' || column.type === 'string'"
                                        class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
                                    >
                                        {{ getItem(item, column) }}
                                    </td>
                                    <td
                                        v-else-if="column.type === 'url'"
                                        class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
                                    >
                                        <a
                                            v-if="getItem(item, column) != ''"
                                            :href="getItem(item, column)"
                                            target="_blank"
                                            class="text-red-700"
                                        >{{ getValue(item, column) }} <ArrowTopRightOnSquareIcon class="h-6 w-4 inline-flex" /></a>
                                    </td>
                                    <td
                                        v-else-if="column.type === 'local-url'"
                                        class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
                                    >
                                        <router-link
                                            v-if="getItem(item, column) != ''"
                                            :to="getItem(item, column)"
                                            class="text-red-700"
                                        >{{ getValue(item, column) }}</router-link>
                                    </td>
                                    <td v-else-if="column.type === 'edit'">
                                        <router-link
                                            :to="column.href + (item as any).id"
                                            class="text-red-700 hover:text-red-900"
                                        ><PencilSquareIcon class="h-6 w-5" /></router-link>
                                    </td>
                                    <td v-else-if="column.type === 'view'">
                                        <router-link
                                            :to="column.href + (item as any).id"
                                            class="text-red-700 hover:text-red-900"
                                        ><EyeIcon class="h-6 w-5" /></router-link>
                                    </td>
                                    <td v-else-if="column.type === 'add-event'">
                                        <router-link
                                            to=""
                                            :class="[
                                                column.subjectTo && item[column.subjectTo.field] === column.subjectTo.value
                                                    ? 'text-red-700 hover:text-red-900'
                                                    : 'text-gray-700 hover:text-gray-900 cursor-default'
                                            ]"
                                            @click="add($event, item, column)"
                                        >
                                          <Tooltip
                                            v-if="column.subjectTo && item[column.subjectTo.field] !== column.subjectTo.value && column.subjectTo.tooltip"
                                            :tooltipText="column.subjectTo.tooltip"
                                          >
                                            <PlusCircleIcon class="h-6 w-6" />
                                          </Tooltip>
                                          <PlusCircleIcon class="h-6 w-6" v-else />
                                        </router-link>
                                    </td>
                                    <td v-else-if="column.type === 'remove-event'">
                                        <router-link
                                            to=""
                                            :class="[
                                                column.subjectTo && item[column.subjectTo.field] === column.subjectTo.value
                                                    ? 'text-red-700 hover:text-red-900'
                                                    : 'text-gray-700 hover:text-gray-900 cursor-default'
                                            ]"
                                            @click="remove($event, item, column)"
                                        >
                                          <Tooltip
                                            v-if="column.subjectTo && item[column.subjectTo.field] !== column.subjectTo.value && column.subjectTo.tooltip"
                                            :tooltipText="column.subjectTo.tooltip"
                                          >
                                            <TrashIcon class="h-6 w-4" />
                                          </Tooltip>
                                          <TrashIcon class="h-6 w-4" v-else />
                                        </router-link>
                                    </td>
                                    <td
                                        v-else-if="column.type === 'flag'"
                                        class="py-4 pl-4 pr-3 sm:pl-6"
                                    >
                                        <span :class="'fi fi-' + item[column.key]" />
                                    </td>
                                    <td v-else-if="column.type === 'image'">
                                        <img class="w-24 p-2" :src="item[column.key]" alt="" />
                                    </td>
                                </template>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import type {GridColumn} from "../models/gridColumn";
import {
    PlusCircleIcon,
    TrashIcon,
    PencilSquareIcon,
    EyeIcon,
    ArrowTopRightOnSquareIcon
} from "@heroicons/vue/24/outline";
import Tooltip from "../components/Tooltip.vue"

export default {
    name: "Grid",
    props: {
        items: Array,
        columns: Array<GridColumn>,
    },
    components: {
      Tooltip,
        ArrowTopRightOnSquareIcon,
        PlusCircleIcon,
        TrashIcon,
        PencilSquareIcon,
        EyeIcon
    },
    emits: ["add", "remove"],
    setup(props, { emit }) {
        const add = (event:any, item: any, column: GridColumn) => {
            event.preventDefault();
            if (!column.subjectTo || item[column.subjectTo.field] === column.subjectTo.value) {
              emit("add", item);
            }
        };

        const remove = (event:any, item: any, column: GridColumn) => {
            event.preventDefault();
            if (!column.subjectTo || item[column.subjectTo.field] === column.subjectTo.value) {
              emit("remove", item);
            }
        };

        return {
            add,
            remove,
        };
    },
    computed: {
        getItem() {
            return (item: any, column: GridColumn) => {
                if (item[column.key] == undefined)
                    return "";

                if (column.type === "string") {
                    if (column.key.includes(".")) {
                        const keys = column.key.split(".");
                        return item[keys[0]][keys[1]];
                    }

                    return item[column.key];
                }

                if (column.type === "string[]") {
                    if (column.key.includes(".")) {
                        const keys = column.key.split(".");
                        const obj = item[keys[0]];
                        if (obj) {
                            return obj.map((o:any) => {
                                return o[keys[1]];
                            }).join(", ");
                        }
                    }

                    return item[column.key];
                }
                if (column.type === "url") {
                    return new URL(column.href.replace("{0}", item[column.key]));
                }
                if (column.type === "local-url") {
                    return column.href.replace("{0}", item[column.key]);
                }
                if (column.type === "edit") {
                    return column.href + item.id;
                }
                return "---";
            };
        },
        getValue() {
            return (item: any, column: GridColumn) => {
                if (column.value?.includes(".") && ["url", "local-url"].includes(column.type)) {
                    const keys = column.value.split(".");
                    return item[keys[0]][keys[1]] ?? "";
                }

                return item[column.value] ?? "";
            };
        }
    }
};
</script>