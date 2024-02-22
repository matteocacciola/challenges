<template>
    <Field
        v-slot="{ errors, errorMessage }"
        :name="name"
    >
        <select
            :id="name"
            class="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:max-w-xs sm:text-sm"
            :name="name"
            :value="modelValue"
            @change="$emit('update:modelValue', $event.target.value)"
            :multiple="isMultiple"
            :items="null"
        >
            <option key="" value="">Select a value</option>
            <option
                v-for="i in items"
                :key="i.id"
                :value="i.id"
            >
                {{ i.value }}
            </option>
        </select>
        <div
            v-if="errors.length > 0"
            class="mt-2 pointer-events-none inset-y-0 right-0 flex items-center pr-3"
        >
            <ExclamationCircleIcon
                class="h-5 w-5 text-red-500 text-xs align-middle"
                aria-hidden="true"
            />
            <label
                :id="name + '-error'"
                class="ml-2 text-sm text-red-600"
            >{{ errorMessage }}</label>
        </div>
    </Field>
</template>
<script setup lang="ts">
import {Field} from "vee-validate";
import {ExclamationCircleIcon} from "@heroicons/vue/20/solid";

const props = defineProps<{
    name: string
    items: any[]
    isMultiple?: boolean
    modelValue: any
}>();
</script>
