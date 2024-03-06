<template>
    <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
            <h1 class="text-xl font-semibold text-gray-900">
                Tours
            </h1>
            <h2>
              Pick a travel slug to view tours
            </h2>
            <p class="mt-2 text-sm text-gray-700" />
        </div>
        <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none flex flex-row divide-x divide-solid divide-gray-200">
            <div>
                <button
                    v-if="hasFilters"
                    type="button"
                    class="inline-flex items-center justify-center rounded-md border border-gray-400 text-gray-700
                        px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2
                        focus:ring-gray-500 focus:ring-offset-2 sm:w-auto mx-2"
                    @click="resetFilters"
                >
                    <XMarkIcon class="h-6 w-4 mr-1" />
                    Reset filters
                </button>
                <button
                    type="button"
                    class="inline-flex items-center justify-center rounded-md border border-transparent
                        bg-red-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-900 focus:outline-none
                        focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:w-auto mx-2"
                    @click="loadTours"
                >
                    <ArrowPathIcon class="h-6 w-4 mr-1" />
                    Reload
                </button>
            </div>
            <div v-if="userRoles.includes('admin')">
              <router-link
                  to="/tours/new"
                  class="inline-flex items-center justify-center rounded-md border border-transparent
                    bg-gray-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto mx-2"
              >
                <PlusIcon class="h-6 w-4 mr-1" />
                Add
              </router-link>
            </div>
        </div>
    </div>

    <div class="sm:grid sm:grid-cols-3 sm:gap-4 pt-4">
        <div>
            <div class="block text-sm font-medium leading-6 text-gray-900">
                Travel Slug
            </div>
            <Select
                v-model="searchParams.slug"
                name="slug"
                :items="slugs"
            />
        </div>
        <div>
            <div class="block text-sm font-medium leading-6 text-gray-900">
                Price From
            </div>
            <Search
                :search-name="'price-from'"
                :search-term="searchParams.priceFrom as String"
                v-model="searchParams.priceFrom"
            />
        </div>
        <div>
          <div class="block text-sm font-medium leading-6 text-gray-900">
            Price To
          </div>
          <Search
              :search-name="'price-to'"
              :search-term="searchParams.priceTo as String"
              v-model="searchParams.priceTo"
          />
        </div>
        <div>
            <div class="block text-sm font-medium leading-6 text-gray-900">
                Starting Date
            </div>
            <DatePicker v-model="searchParams.startingDate" :value="searchParams.startingDate"></DatePicker>
        </div>
        <div>
            <div class="block text-sm font-medium leading-6 text-gray-900">
                Ending Date
            </div>
            <DatePicker v-model="searchParams.endingDate" :value="searchParams.endingDate"></DatePicker>
        </div>
    </div>
    <PagingGrid v-if="searchParams.slug" :items="items" :columns="columns" :page="pageResult" route="tours" />
</template>

<script setup lang="ts">
import { shallowRef, onMounted, ref, watch, onBeforeMount } from "vue"
import { useRoute, useRouter, onBeforeRouteUpdate } from "vue-router"
import { ArrowPathIcon, XMarkIcon, PlusIcon } from "@heroicons/vue/24/outline"
import type { GridColumn } from "../../models/gridColumn"
import ToursAPI from "../../api/tours"
import PagingGrid from "../../components/PagingGrid.vue"
import Search from "../../components/forms/Search.vue"
import { useNotificationStore, useConfigStore } from "../../stores"
import { getCleanObject } from "../../composables/utilities"
import DatePicker from "../../components/forms/DatePicker.vue"
import TravelsApi from "../../api/travels"
import Select from "../../components/forms/Select.vue"
import "@vuepic/vue-datepicker/dist/main.css"

const route = useRoute()
const router = useRouter()

const pageResult = ref<any>({})
const items = shallowRef<Array<unknown>>([])
const searchParams = ref({ ...route.query })
const currentPage = ref(parseInt(route.query?.page?.toString()))

let slugs = shallowRef([])

const userRoles = useConfigStore().userRoles

const notificationStore = useNotificationStore()

const columns: GridColumn[] = [
  { name: "Id", key: "id", value: "id", type: "string", href: null },
  { name: "Name", key: "name", type: "string", href: null },
  { name: "Starting Date", key: "startingDate", type: "string", href: null },
  { name: "Ending Date", key: "endingDate", type: "string", href: null },
  { name: "Price", key: "priceWithCurrency", type: "string", href: null }
]

if (userRoles.includes("editor")) {
  columns.push({ name: "", key: "", href: "/tours/", type: "view" })
}

const resetFilters = () => searchParams.value = {}

const hasFilters = ref(false)

const loadTours = async () => {
  items.value = null
  const { slug, priceFrom, priceTo, startingDate, endingDate } = searchParams.value
  if (!slug) {
    return
  }
  const { result, page, pageSize } = await ToursAPI.getTours({
    slug: slug as string,
    page: currentPage.value,
    pageSize: 10,
    priceFrom: priceFrom ? parseFloat(priceFrom as string) : undefined,
    priceTo: priceTo ? parseFloat(priceTo as string) : undefined,
    startingDate: startingDate ? new Date(startingDate as string) : undefined,
    endingDate: endingDate ? new Date(endingDate as string) : undefined
  })
  const tours = result.items
  pageResult.value = {
    currentPage: page,
    size: pageSize,
    itemsOnPage: tours.length,
    totalItems: result.totalItems,
    totalPages: Math.ceil(result.totalItems / pageSize)
  }
  if (tours.length !== 0) {
    tours.forEach((tour) => {
      tour["priceWithCurrency"] = `${tour.price} ${tour.currency}`
    })
    items.value = tours
  }
}

watch(searchParams, async () => {
  currentPage.value = 1
  const filters = getCleanObject(searchParams.value)
  hasFilters.value = Object.keys(filters).length > 0
  await router.push({ name: "tours", query: filters as Record<string, string> })
}, { deep: true })

onMounted(async () => {
  await loadTours()
})

onBeforeRouteUpdate(async (to, from, next) => {
  currentPage.value = parseInt(to.query?.page?.toString())
  await loadTours()
  next()
})

onBeforeMount(async () => {
  const travels = await TravelsApi.getAll()
  if (!travels.length) {
    notificationStore.notifications.push({
      type: "error",
      description: "No travel available. Please, create a travel before listing tours",
      timeout: 5000
    })
    return
  }
  slugs.value = travels.map((travel) => ({
    id: travel.slug,
    value: travel.slug
  }))
})
</script>
