<template>
    <div>
        <Notification />
        <component :is="layout" />
    </div>
</template>
<script setup lang="ts">
import { ref, watch } from "vue"
import { useRoute } from "vue-router"
import { useAuthStore } from "./stores"

const route = useRoute()
const layout = ref("AuthLayout") // this is default layout if route meta is not set

useAuthStore().updateState()

watch(route, (to) => {
  if (to.meta.layout !== undefined) {
    layout.value = to.meta.layout.toString()
  } else {
    layout.value = "MainLayout"
  }
})

</script>
<script lang="ts">
import AuthLayout from "./layouts/AuthLayout.vue"
import Notification from "./components/Notification.vue"
import MainLayout from "./layouts/MainLayout.vue"

export default {
  components: {
    Notification,
    MainLayout,
    AuthLayout
  }
}
</script>