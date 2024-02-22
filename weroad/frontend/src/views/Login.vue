
<template>
    <div class="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div class="w-full max-w-md space-y-8">
            <div>
                <Logo class="text-center mx-auto w-auto" />
                <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                    Login
                </h2>
                <p class="mt-2 text-center text-sm text-gray-600" />
            </div>
            <div>
                <form class="space-y-6" action="#" method="POST">
                    <div>
                        <label for="email" class="block text-sm font-medium text-gray-700">
                            Email address
                        </label>
                        <div class="mt-1">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autocomplete="email"
                                required
                                class="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                v-model="email"
                            />
                        </div>
                    </div>
                    <div>
                        <label for="password" class="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <div class="mt-1">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autocomplete="current-password"
                                required
                                class="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                v-model="password"
                            />
                        </div>
                    </div>
                    <div>
                        <button
                            type="button"
                            class="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            @click="submit"
                        >
                            <span class="flex items center">
                                <LockClosedIcon class="w-5 h-5" aria-hidden="true" />
                                <span class="ml-2">Login</span>
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import { LockClosedIcon } from "@heroicons/vue/20/solid";
import { onBeforeMount, ref } from "vue";
import { useRouter } from "vue-router";
import LoginAPI from "../api/auth";
import {useAuthStore, useNotificationStore, userConfigStore} from "../stores";
import Logo from "../components/Logo.vue";

const router = useRouter();
const notificationStore = useNotificationStore();
const authStore = useAuthStore();

const email = ref("");
const password = ref("");

const submit = async () => {
  const response = await LoginAPI.login(email.value, password.value);
  if (response) {
    localStorage.setItem("token", JSON.stringify(response));
    authStore.updateState();
    await userConfigStore().fetchUserRoles();
    await router.push({ name: "tours" });
    return;
  }
  notificationStore.notifications.push({
    type: "error",
    description: "Invalid credentials. Please try again.",
    timeout: 5000,
  });
};

onBeforeMount(() => {
  if (authStore.getToken) {
    router.push({ name: "tours" });
  }
});

</script>