<template>
    <div class="mt-8 flex flex-col">
        <Pagination
            v-if="items?.length"
            :current-page="page.currentPage"
            :size="page.size"
            :items-on-page="page.itemsOnPage"
            :total-items="page.totalItems"
            :total-pages="page.totalPages"
            :route-name="route"
        />
        <Grid
            :columns="columns"
            :items="items"
            @add="add"
            @remove="remove"
        />
        <Pagination
            v-if="items?.length"
            :current-page="page.currentPage"
            :size="page.size"
            :items-on-page="page.itemsOnPage"
            :total-items="page.totalItems"
            :total-pages="page.totalPages"
            :route-name="route"
        />
    </div>
</template>
<script lang="ts">
import Grid from "./Grid.vue";
import type {GridColumn} from "../models/gridColumn";
import Pagination from "./Pagination.vue";
import type {Page} from "../models/page";

export default {
    name: "PagingGrid",
    emits: ["add", "remove"],
    props: {
        page: {
            type: Object as () => Page<any>
        },
        columns: Array<GridColumn>,
        items: Array,
        route: String,
    },
    components: {
        Pagination,
        Grid,
    },
    setup(prevProps, {emit}) {
        const add = (item: any) => {
            emit("add", item);
        };

        const remove = (item: any) => {
            emit("remove", item);
        };

        return {
            add,
            remove,
        };
    }
};
</script>