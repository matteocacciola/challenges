<template>
    <img v-if="mode == 'dark'" src="/logo-dark.png" alt="WeRoad">
    <img v-else src="/logo.png" alt="WeRoad">
</template>
<script lang="ts" setup>
const props = defineProps(["mode"])
</script>