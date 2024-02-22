<template>
    <div class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
        <label class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">Is Public?</label>
        <div>
            <div class="py-3 inline-block items-center justify-center">
                <Field
                    v-model="item.isPublic"
                    name="isPublic"
                    type="radio"
                    :value="true"
                    :readonly="!createMode"
                    id="isPublic.true"
                /> True
            </div>
            <div class="py-3 px-5 inline-block items-center justify-center">
                <Field
                    v-model="item.isPublic"
                    name="isPublic"
                    type="radio"
                    :value="false"
                    :readonly="!createMode"
                    id="isPublic.false"
                /> False
            </div>
        </div>
    </div>
    <div class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
        <label class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">Slug</label>
        <Field
            v-model="item.slug"
            name="slug"
            type="text"
            :readonly="!createMode"
        />
    </div>
    <div class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
        <label class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">Name</label>
        <Field
            v-model="item.name"
            name="name"
            type="text"
            :readonly="!createMode"
        />
    </div>
    <div class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
        <label class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">Description</label>
        <Field
            v-model="item.description"
            name="description"
            type="textarea"
            :readonly="!createMode"
        />
    </div>
    <div class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
        <label class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">Number of days</label>
        <Field
            v-model="item.numberOfDays"
            name="numberOfDays"
            type="number"
            :readonly="!createMode"
        />
    </div>
    <div class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
        <label class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">Moods</label>
        <div>
            <div v-for="key in Object.keys(item.moods)" class="py-3 items-center justify-center">
                <Field
                    v-model="item.moods[key]"
                    :name="`moods.${key}`"
                    type="number"
                    :readonly="!createMode"
                    :placeholder=key
                /> {{ capitalize(key) }}
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import Field from "@/components/forms/Field.vue";
import {capitalize} from "../../composables/utilities";

const props = defineProps<{
    item: Object
    createMode: boolean
}>();
</script>