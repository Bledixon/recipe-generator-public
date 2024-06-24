<script setup lang="ts">
import { useRecipeStore } from '../stores/recipe';
import SingleRecipe from './SingleRecipe.vue';
import { fillMissingFieldsForRecipe, rebuildRecipesFromCache } from '../api/chatGptSearch';
import { RecipePreview } from '../model/recipe';
import { onBeforeMount, ref } from 'vue';
import { Router, useRouter } from 'vue-router';
import { LayoutDefinition } from '../utils';
import MdiReload from '~icons/mdi/reload';
import LoadingSpinner from './LoadingSpinner.vue';

const recipeStore = useRecipeStore();
const recipes = recipeStore.possibleRecipes;

const selectedIndex = ref<number>();
const generatingRecipe = ref<boolean>(false);
const reloadingRecipes = ref<boolean>(false);
const errorOccurred = ref<boolean>(false);
const isBasicMode = ref<Boolean>(false);

let router:Router | null = null;

onBeforeMount(() => {
    router = useRouter();
    isBasicMode.value = recipeStore.layoutMode == LayoutDefinition.BASIC;
});

async function onClick(recipe:RecipePreview) {
    generatingRecipe.value = true;
    try {
        await fillMissingFieldsForRecipe(recipe);
    } catch (e) {
        errorOccurred.value = true;
        console.error(e);
        onClick(recipe);
        return;
    }
    errorOccurred.value = false;
    generatingRecipe.value = false;
    router?.push(isBasicMode.value ? '/overview' : '/ingredients');
}

async function reloadRecipes(): Promise<void> {
    // Basic workflow.
    reloadingRecipes.value = true;
    try {
        await rebuildRecipesFromCache();
    } catch (e) {
        errorOccurred.value = true;
        console.error(e);
        reloadRecipes();
        return;
    }
    reloadingRecipes.value = false;
}

</script>

<template>
    <div class="flex flex-col h-full">
        <div v-if="reloadingRecipes" class="w-full h-full flex flex-col justify-center items-center">
            <h2 class="text-center">Reloading recipes...</h2>
            <loading-spinner/>
        </div>
        <div v-else-if="generatingRecipe" class="w-full h-full flex flex-col justify-center items-center">
            <h2 class="text-center">Finishing generated recipe...</h2>
            <loading-spinner/>
            <h3 v-if="errorOccurred" class="text-center">Error occured, retrying..</h3>
        </div>
        <div v-else-if="recipes === undefined" class="flex justify-center align-middle gap-1 p-4 h-full w-full">
            <h2>Error displaying potential recipes!</h2>
            <p>Please try again.</p>
            <router-link to="/">Go home</router-link>
        </div>
        <div v-else class="flex flex-col justify-center items-center gap-1 p-1 h-full w-full overflow-scroll">
            <h2 class="font-bold text-xl">Generated Recipes</h2>
            <h6>Please choose one of the following:</h6>
            <div class="grow"></div>
            <single-recipe v-for="(recipe, index) in recipes" :key="recipe.id" 
                :id="recipe.id"
                :name="recipe.name" 
                :description="recipe.description"
                :difficulty="recipe.difficulty"
                :nationality="recipe.nationality"
                :duration="+recipe.duration_in_minutes"
                :is-selected="selectedIndex === index"
                :onclick="() => selectedIndex = index"
                />
            <button :onclick="reloadRecipes" class="flex flex-row gap-2 items-center justify-center"><mdi-reload/> Reload</button>
            <div class="grow"></div>
            <button :onclick="() => onClick(recipes[selectedIndex])" class="w-full md:w-1/2">Continue</button>
        </div>
    </div>
</template>

<style scoped></style>