<template>
    <tr>
        <td
            v-for="column in columns"
            class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
        >
            {{ item[column.key] }}
        </td>
        <td>
            <router-link
                :to="'/products/' + item.id"
                class="text-red-600 hover:text-red-900"
            >Edit</router-link>
        </td>
    </tr>
</template>
<script lang="ts">
import type { GridColumn } from "../models/gridColumn"

export default {
  name: "GridItem",
  props: {
    item: Object,
    columns: Array<GridColumn>
  },
  setup() {
  }
}
</script>