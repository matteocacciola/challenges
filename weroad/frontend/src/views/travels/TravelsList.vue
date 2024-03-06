<template>
    <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
            <h1 class="text-xl font-semibold text-gray-900">
                Travels
            </h1>
            <p class="mt-2 text-sm text-gray-700" />
        </div>
        <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none flex flex-row divide-x divide-solid divide-gray-200">
            <div v-if="userRoles.includes('admin')">
              <router-link
                  to="/travels/new"
                  class="inline-flex items-center justify-center rounded-md border border-transparent
                    bg-gray-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto mx-2"
              >
                <PlusIcon class="h-6 w-4 mr-1" />
                Add
              </router-link>
            </div>
        </div>
    </div>

    <PagingGrid :items="items" :columns="columns" :page="pageResult" route="tours" @remove="deleteTravel" />
</template>

<script setup lang="ts">
import { shallowRef, onMounted, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { PlusIcon } from "@heroicons/vue/24/outline"
import type { GridColumn } from "../../models/gridColumn"
import PagingGrid from "../../components/PagingGrid.vue"
import { useNotificationStore, useConfigStore } from "../../stores"
import TravelsApi from "../../api/travels"
import "@vuepic/vue-datepicker/dist/main.css"

const route = useRoute()
const router = useRouter()

const pageResult = ref<any>({})
const items = shallowRef<Array<unknown>>([])
const currentPage = ref(parseInt(route.query?.page?.toString()))

const userRoles = useConfigStore().userRoles
const notificationStore = useNotificationStore()

const columns: GridColumn[] = [
  { name: "Slug", key: "slug", value: "slug", type: "string", href: null },
  { name: "Name", key: "name", value: "name", type: "string", href: null },
  { name: "Number of Days", key: "numberOfDays", value: "numberOfDays", type: "string", href: null },
  {
    name: "",
    key: "",
    href: "/travels/delete/",
    type: "remove-event",
    subjectTo: { field: "hasTours", value: false, tooltip: "This travel has tours. It cannot be deleted." }
  }
]

const loadTravels = async () => {
  items.value = null
  const { result, page, pageSize } = await TravelsApi.getTravels({ page: currentPage.value })
  const travels = result.items
  pageResult.value = {
    currentPage: page,
    size: pageSize,
    itemsOnPage: travels.length,
    totalItems: result.totalItems,
    totalPages: Math.ceil(result.totalItems / pageSize)
  }
  if (travels.length !== 0) {
    for (let t of travels) {
      t["hasTours"] = t.tours.length > 0
    }
    items.value = travels
  }
}

const deleteTravel = async (item) => {
  const result = await TravelsApi.deleteTravel(item.id)
  if (result.isDeleted) {
    notificationStore.notifications.push({
      type: "success",
      description: `"Travel "${item.name}" successfully deleted"`,
      timeout: 5000
    })
  } else {
    notificationStore.notifications.push({
      type: "error",
      description: `Something went wrong while deleting Travel "${item.name}". Please, contact the Administrator.`,
      timeout: 5000
    })
  }
  await loadTravels()
}

onMounted(async () => {
  await loadTravels()
})
</script>
