<template>
    <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto sm:inline-flex space-x-2">
            <h1 class="text-xl font-semibold text-gray-900">
                Tour #{{ item.id }} - {{ item.name }}
            </h1>
        </div>
        <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none flex flex-row divide-x divide-solid divide-gray-200">
            <div>
                <button
                    type="button"
                    :class="[
                        'inline-flex border-gray-400 bg-white text-gray-700 items-center justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium shadow-sm sm:w-auto',
                        isSaving ? 'disabled:opacity-30 opacity-30 cursor-not-allowed' : 'hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
                    ]"
                    @click="goback()"
                    :disabled="isSaving"
                >
                    <ArrowLeftIcon class="h-6 w-4 mr-1" />
                    Back
                </button>
            </div>
        </div>
    </div>

    <Form :initial-values="item" :validation-schema="schema">
        <div class="overflow-hidden bg-white shadow sm:rounded-lg mt-4">
            <div class="px-4 py-5 sm:px-6">
                <div class="space-y-6 sm:space-y-5">
                    <SharedForm :item="item" :create-mode="false" />
                </div>
            </div>
        </div>
    </Form>

    <div class="flex justify-end pt-4 space-x-2">
        <button
            type="button"
            :class="[
                'inline-flex items-center justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium shadow-sm text-white bg-red-700 sm:w-auto',
                isSaving ? 'disabled:opacity-30 opacity-30 cursor-not-allowed' : 'hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
            ]"
            @click="updateItem"
            :disabled="isSaving"
        >
            Save
        </button>
    </div>
</template>
<script setup lang="ts">
import {ref, toRaw} from "vue";
import {useRoute} from "vue-router";
import {useRouter} from "vue-router";
import ToursAPI from "../../api/tours";
import {ArrowLeftIcon} from "@heroicons/vue/24/outline";
import {useNotificationStore} from "../../stores";
import SharedForm from "./SharedForm.vue";
import {Form} from "vee-validate";
import * as yup from "yup";

const notificationStore = useNotificationStore();

const schema = yup.object().shape({
    name: yup.string().required().label("Name"),
    startingDate: yup.date().required().label("Starting Date"),
    endingDate: yup.date().required().label("Ending Date"),
    price: yup.number().required().label("Price")
});

const route = useRoute();
const router = useRouter();
const item = ref({
    id: null,
    travelId: null,
    name: null,
    startingDate: null,
    endingDate: null,
    price: null
});

const goback = async () => {
  await router.push({name: "tours", params: {page: localStorage.getItem("currentPage") || "1"}});
}

let isSaving = false;

const updateItem = async () => {
    if (isSaving) {
        return;
    }

    try {
        schema.validateSync(item.value, {abortEarly: false});
    } catch (err) {
        let message = ""
        err.inner.forEach(error => {
            message += error.message + "<br>";
        });
        notificationStore.notifications.push({
            type: "error",
            description: message,
            timeout: 5000,
        });
        return;
    }

    isSaving = true;
    const { id, name, startingDate, endingDate, price } = item.value;
    const response = await ToursAPI.updateTour(id, name, startingDate, endingDate, price);
    if (response === false) {
        isSaving = false;
        return;
    }
    item.value = response;

    notificationStore.notifications.push({
        type: "success",
        description: "Tour updated",
        timeout: 5000,
    });
    isSaving = false;
};

const loadData = async () => {
    item.value = await ToursAPI.getTour(route.params.id as unknown as string);
};

loadData().then(() => document.title += " #" + route.params.id);
</script>
