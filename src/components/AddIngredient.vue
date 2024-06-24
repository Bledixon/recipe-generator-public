<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRecipeStore } from '../stores/recipe';

const recipeStore = useRecipeStore();

let name = ref<string>("");
let measurement = ref<string>("");

watch(name, (nName) => {
    recipeStore.setValidationIngredient(measurement.value + " " + nName);
});

watch(measurement, (nMeasurement) => {
    recipeStore.setValidationIngredient(nMeasurement + " " + name.value);
});

function onClick() {
    isPreview.value = false;
}

const isPreview = ref<boolean>(true);

function resetValues() {
    name.value = "";
    measurement.value = "";
    isPreview.value = true;
}

defineExpose({
    resetValues,
});

</script>

<template>
<div class="flex w-full py-1 justify-center gap-2">
    <button v-if="isPreview" :onclick="() => onClick()" class="flex justify-between w-4/6 p-2 text-left items-center rounded-lg">
        + Add Ingredient
    </button>
    <div v-else class="flex flex-row gap-2 justify-center">
        <input class="w-1/4 md:w-2/6 p-2 rounded-lg text-left bg-accent text-[black]" v-model="name" />
        <input class="w-3/4 md:w-3/6 p-2 rounded-lg text-left bg-accent text-[black]" v-model="measurement" />
        <button :onclick="resetValues" class="bg-accent text-[black]">X</button>
    </div>
</div>
</template>

<style scoped>
</style>