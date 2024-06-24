<script setup lang="ts">
import { useRecipeStore } from '../stores/recipe';
import { removeIngredientForRecipe, validateRecipe } from '../api/chatGptSearch';
import SingleIngredient from './SingleIngredient.vue';
import AddIngredient from './AddIngredient.vue';
import { computed, ref, watch } from 'vue';
import LoadingSpinner from './LoadingSpinner.vue';

const recipeStore = useRecipeStore();
const recipe = computed(() => recipeStore.recipe);
recipeStore.setUnresolvedServingChange(recipe.value?.servings ?? 4);
const isValidating = ref<boolean>(false);

const addIngredientRef = ref<InstanceType<typeof AddIngredient> | null>(null)

async function onClick() {
    isValidating.value = true;
    await validateRecipe();
    isValidating.value = false;
    addIngredientRef.value?.resetValues();
}

let oldServings = recipe?.value?.servings ?? 4;
let servingsRef = ref<number>(recipe?.value?.servings ?? 4);

watch(servingsRef, (newServings) => {
    recipeStore.setUnresolvedServingChange(newServings);
    if (newServings !== oldServings) {
        oldServings = newServings;
    }
});

async function removeIngredient(name : string) : Promise<void> {
    isValidating.value = true;
    await removeIngredientForRecipe(name);
    isValidating.value = false;
}
</script>

<template>
    <div class="flex flex-col h-full">
        <div v-if="recipe !== undefined">
            <h2 class="font-bold text-xl">{{ recipe?.name }}</h2>
            <h6>Ingredients</h6>
        </div>
        <div v-if="recipe === undefined" class="flex flex-col justify-center items-center gap-1 p-4">
            <h2 class="font-bold text-xl">Error displaying ingredients!</h2>
            <p>Recipe is invalid. Please try again.</p>
            <button class="w-1/4">
                <router-link to="/">Go home</router-link>
            </button>
        </div>
        <div v-else class="flex flex-col gap-2 items-center overflow-hidden">
            <div class="flex flex-col items-center my-4 gap-1 w-full md:w-1/2 overflow-y-auto">
                <div class="flex flex-row w-full items-center justify-center gap-2 mb-4">
                    <h6 class="text-lg">Servings</h6>
                    <input class="w-1/12 h-full rounded-md text-center" v-model="servingsRef">
                </div>
                <h2 class="text-lg"><b>Select</b> ingredients you want to change by clicking.</h2>
                <div class="flex flex-col items-center justify-center" v-if="isValidating">
                    <p>Validating...</p>
                    <loading-spinner />
                </div>
                <div v-else>
                    <add-ingredient ref="addIngredientRef" />
                    <single-ingredient v-for="ingredient in recipe.ingredients" :key="ingredient.id" 
                        :id="ingredient.id"
                        :name="ingredient.name" 
                        :amount="ingredient.amount"
                        :unit="ingredient.measurement"
                        :use-input-fields="true"
                        @remove-ingredient="removeIngredient"/>
                </div>
            </div>
        </div>
        <button :onclick="onClick" class="w-2/5 self-center my-4" :class="{ 'bg-accent text-[black]' : recipeStore.isPendingIngredientChanges, 'bg-secondary' : !recipeStore.isPendingIngredientChanges }" :disabled="!recipeStore.isPendingIngredientChanges">Validate</button>
        <div class="flex-grow"></div>
        <router-link to="/steps">
            <button class="w-1/2 bg-secondary">Continue</button>
        </router-link>
    </div>
</template>

<style scoped></style>