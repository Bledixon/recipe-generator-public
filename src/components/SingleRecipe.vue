<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
    id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    nationality: {
        type: String,
        required: true,
    },
    difficulty: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    isSelected: {
        type: Boolean,
        required: false,
    },
});

</script>

<template>
    <div class="flex w-4/5 p-1 justify-center gap-2">
        <div :class="{ 'bg-accent text-[black]' : isSelected, 'bg-secondary text-primary' : !isSelected }" class="rounded-lg w-full  text-left flex flex-col items-center cursor-pointer">
            <div class="w-full p-4">
                <h3 class="text-lg font-bold">{{ props.name }}</h3>
                <p>{{ props.description }}</p>
            </div>
            <div class="p-4 w-full flex flex-row justify-between border-t-2">
                <p class="w-1/3 text-center">{{ props.nationality }}</p>
                <p class="w-1/3 text-center">{{ props.difficulty }}</p>
                <p class="w-1/3 text-center">{{ props.duration }} min</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>