<template>
    <VueDatePicker
        :model-value="value"
        format="MMM dd, yyyy"
        :enable-time-picker="false"
        @change="$emit('update:modelValue', $event.target.value)"
    />
</template>
<script setup lang="ts">
import VueDatePicker from "@vuepic/vue-datepicker";

const props = defineProps<{
  value: Date
}>();
</script>