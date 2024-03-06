<template>
    <div class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5" v-if="createMode">
        <label class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">Travel</label>
        <Select
            v-model="item.travelId"
            name="travel"
            :items="mappedTravels"
        />
    </div>
    <div class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
        <label class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">Name</label>
        <Field v-model="item.name" name="name" type="text" />
    </div>
    <div class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
        <label class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">Price</label>
        <Field v-model="item.price" name="description" type="text" />
    </div>
    <div class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
        <label class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">Starting Date</label>
        <DatePicker v-model="item.startingDate" :value="item.startingDate"></DatePicker>
    </div>
    <div class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
        <label class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">Ending Date</label>
        <DatePicker v-model="item.endingDate" :value="item.endingDate"></DatePicker>
    </div>
</template>
<script setup lang="ts">
import Field from "../../components/forms/Field.vue"
import { onBeforeMount, shallowRef } from "vue"
import { useRouter } from "vue-router"
import TravelsApi from "../../api/travels"
import { useNotificationStore } from "../../stores"
import Select from "../../components/forms/Select.vue"
import DatePicker from "../../components/forms/DatePicker.vue"
import "@vuepic/vue-datepicker/dist/main.css"

const props = defineProps<{
  item: {
    id: string | undefined
    travelId: string
    name: string
    price: number
    startingDate: Date
    endingDate: Date
  }
  createMode: boolean
}>()

let mappedTravels = shallowRef([])
const notificationStore = useNotificationStore()
const router = useRouter()

onBeforeMount(async () => {

  if (props.createMode) {
    const travels = await TravelsApi.getAll()
    if (!travels.length) {
      notificationStore.notifications.push({
        type: "error",
        description: "No travel available. Please, create a travel before adding a tour.",
        timeout: 5000
      })
      await router.push({ name: "travel-new" })
    }
    mappedTravels.value = travels.map((travel) => ({
      id: travel.id,
      value: travel.name
    }))
  }
})
</script>
