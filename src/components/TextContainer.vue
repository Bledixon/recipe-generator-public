<script setup lang="ts">
const props = defineProps({
    title: {
        type: String,
        required: true,
    },
    subtitle: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
});
</script>

<template>
    <div class="flex flex-col text-left gap-3 pl-4 pt-4">
        <h2 class="text-5xl">{{ props.title }}</h2>
        <h6 class="text-2xl">{{ props.subtitle }}</h6>
        <p>{{ props.content }}</p>
    </div>
</template>

<style scoped></style>
