<template>
    <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto sm:inline-flex space-x-2">
            <h1 class="text-xl font-semibold text-gray-900">
                User
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

    <Form v-slot="{ errors }" :initial-values="item" :validation-schema="schema">
        <div class="overflow-hidden bg-white shadow sm:rounded-lg mt-4">
            <div class="px-4 py-5 sm:px-6">
                <div class="space-y-6 sm:space-y-5">
                    <SharedForm
                        :item="item"
                        :create-mode="true"
                    />
                </div>
            </div>
        </div>
    </Form>

    <div class="flex justify-end pt-4 space-x-2">
        <button
            type="button"
            :class="[
                'inline-flex items-center justify-center rounded-md border border-transparent bg-red-700 px-4 py-2 text-sm font-medium text-white shadow-sm sm:w-auto',
                isSaving ? 'disabled:opacity-30 opacity-30 cursor-not-allowed' : 'hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
            ]"
            @click="saveItem"
            :disabled="isSaving"
        >
            Save
        </button>
    </div>
</template>
<script setup lang="ts">
import SharedForm from "./SharedForm.vue";
import {ref} from "vue";
import {Form} from "vee-validate";
import {ArrowLeftIcon} from "@heroicons/vue/24/outline";
import * as yup from "yup";
import {useNotificationStore} from "../../stores";
import UsersAPI from "../../api/users";
import {router} from "../../router";

const notificationStore = useNotificationStore();

const item = ref({
    email: null,
    password: null,
    role: null,
});

const schema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required(),
    role: yup.string().required()
});

let isSaving = false;

const goback = async () => {
  await router.push({name: "tours"});
}

const saveItem = async () => {
    if (isSaving) {
        return;
    }

    try {
        schema.validateSync(item.value, {abortEarly: false});
    } catch (err) {
        let message = "";
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
    const { email, password, role } = item.value;
    const response = await UsersAPI.createUser(email, password, [role]);
    if (response === false) {
        isSaving = false;
        return;
    }
    item.value = response;
    notificationStore.notifications.push({
        type: "success",
        description: "User created",
        timeout: 5000,
    });
    isSaving = false;
    router.push({name: "travels"});
};
</script>
