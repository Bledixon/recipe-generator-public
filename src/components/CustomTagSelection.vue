<script setup lang="ts">
import { ref } from 'vue';
import { useRecipeStore } from '../stores/recipe';

const props = defineProps({
    categories: {
        type: Array<string>,
        required: true,
    }
});

const recipeStore = useRecipeStore();
const selectedCategories = ref<string[]>([]);

function addToSelectedCategories(category: string): void {
    let remove = selectedCategories.value.includes(category);
    if (remove) {
        selectedCategories.value = selectedCategories.value.filter((value) => value !== category);
    } else {
        selectedCategories.value.push(category);
    }
    recipeStore.setCategoryPreferences(category, remove);
}
</script>

<template>
    <div class="w-full p-1 flex flex-row flex-wrap gap-2">
        <div v-for="category in props.categories" class="p-2 text-[white] rounded select-none cursor-pointer" :class="selectedCategories.includes(category) ? 'bg-tertiary' : 'bg-secondary'"  :onclick="() => addToSelectedCategories(category)">
            {{ category }}
        </div>
    </div>
</template>

<style scoped>
</style>