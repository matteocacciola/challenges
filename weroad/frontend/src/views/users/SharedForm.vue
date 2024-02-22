<template>
    <div class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
        <label class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">Email</label>
        <Field
            v-model="item.email"
            name="email"
            type="text"
            :readonly="!createMode"
        />
    </div>
    <div class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
        <label class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">Password</label>
        <Field
            v-model="item.password"
            name="password"
            type="text"
            :readonly="!createMode"
        />
    </div>
    <div class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5" v-if="createMode">
        <label class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">Role</label>
        <Select
            v-model="item.role"
            name="role"
            :items="mappedRoles"
        />
    </div>
</template>
<script setup lang="ts">
import Field from "../../components/forms/Field.vue";
import Select from "../../components/forms/Select.vue";
import ConstantsAPI from "../../api/constants";
import {onBeforeMount, shallowRef} from "vue";
import {useNotificationStore} from "../../stores";
import {useRouter} from "vue-router";

const props = defineProps<{
    item: Object
    createMode: boolean
}>();

const notificationStore = useNotificationStore();
const router = useRouter();

let mappedRoles = shallowRef([]);

onBeforeMount(async () => {
  const roles = await ConstantsAPI.roles();
  if (!roles.length) {
    notificationStore.notifications.push({
      type: "error",
      description: "No rorles available. Please, contact the administrator.",
      timeout: 5000,
    });
    await router.push({ name: "travels" });
  }
  mappedRoles.value = roles.map((travel) => ({
    id: travel.name,
    value: travel.name
  }));
});
</script>