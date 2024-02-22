<template>
    <div
        :class="[
            font_class ?? 'text-xs',
            font_color_class ?? 'text-white',
            bg_color_class ?? 'bg-blue-500',
            width_class ?? 'w-8',
            height_class ?? 'h-8',
            'flex justify-center items-center rounded-full uppercase'
        ]"
    >
        {{ letters }}
    </div>
</template>
<script lang="ts" setup>
import {computed} from "vue";

const props = defineProps({
    name: String,
    bg_color_class: String,
    font_color_class: String,
    font_class: String,
    width_class: String,
    height_class: String,
});

const letters = computed(() => {
    if (props.name == null || props.name.length == 0)
        return "--";

    if (props.name.length == 1)
        return props.name.charAt(0).toUpperCase();

    let nameParts = props.name.split(" ");
    if (nameParts.length < 2) {
      return props.name.substring(0, 2).toUpperCase();
    }
    return nameParts[0].charAt(0) + nameParts[1].charAt(0);
});
</script>