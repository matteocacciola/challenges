<template>
    <Field
        v-slot="{ field, errors, errorMessage }"
        :name="name"
    >
        <input
            v-if="type === 'checkbox'"
            v-bind="field"
            :id="id || name"
            :type="type"
            :placeholder="placeholder"
            :checked="modelValue"
            :value="value"
            :class="[
                readonly ? 'bg-gray-200' : '',
                'h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500'
            ]"
            @input="$emit('update:modelValue', ($event.target as any).checked)"
        >

        <input
            v-if="type === 'radio'"
            v-bind="field"
            :id="id || name"
            :type="type"
            :placeholder="placeholder"
            :value="value"
            :class="[
                  readonly ? 'bg-gray-200' : '',
                  'h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500'
              ]"
            @input="$emit('update:modelValue', $event.target.value as any)"
        >

        <textarea
            v-else-if="type === 'textarea'"
            v-bind="field"
            :id="id || name"
            :placeholder="placeholder"
            :value="modelValue"
            :class="[
                readonly ? 'bg-gray-200' : '',
                'block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:max-w-xs sm:text-sm'
            ]"
            aria-invalid="true"
            :aria-describedby="name + '-error'"
            :readonly="readonly"
            :rows="rows ?? 10"
            :cols="cols ?? 20"
            @input="$emit('update:modelValue', ($event.target as any).value)"
        >
        </textarea>

        <input
            v-else
            v-bind="field"
            :id="id || name"
            :type="type"
            :placeholder="placeholder"
            :value="modelValue"
            :class="[
                readonly ? 'bg-gray-200' : '',
                'block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:max-w-xs sm:text-sm'
            ]"
            aria-invalid="true"
            :aria-describedby="name + '-error'"
            :readonly="readonly"
            @input="$emit('update:modelValue', ($event.target as any).value)"
        >
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
import {ExclamationCircleIcon} from "@heroicons/vue/20/solid";
import {Field} from "vee-validate";

const props = defineProps<{
    modelValue: unknown
    placeholder?: string
    id?: string
    name: string
    type: string
    readonly?: boolean
    value?: string | boolean
    rows?: number
    cols?: number
}>();
</script>
