<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { chatGptWebSearch, PROMPT_HEADER } from '../api/chatGptSearch';
import { useRouter, type Router } from 'vue-router';
import { LayoutDefinition } from '../utils';
import { useRecipeStore } from '../stores/recipe';
import LoadingSpinner from './LoadingSpinner.vue';

const inputRef = ref<HTMLInputElement | null>(null);
const generatingRecipe = ref<boolean>(false);
const errorOccurred = ref<boolean>(false);

const recipeStore = useRecipeStore();

let router:Router | null = null;

const isBasicMode = ref<boolean>(false);
const isBeforeGenerationMode = ref<boolean>(false);

onBeforeMount(() => {
    router = useRouter();
    isBasicMode.value = recipeStore.layoutMode == LayoutDefinition.BASIC;
    isBeforeGenerationMode.value = recipeStore.layoutMode == LayoutDefinition.PREFERENCES;
});

async function beginSearch() : Promise<void> {
    // Mostly just to remove TS error.
    if (inputRef.value?.value == null) {
        return;
    }
    // Not searching for anything.
    if (inputRef.value.value.trim() === '') {
        return;
    }
    // No recipe (most likely) only contains 2 letters.
    if (inputRef.value.value.length <= 2) {
        return;
    }
    if (isBeforeGenerationMode.value) {
        recipeStore.recipeNameBuffer = inputRef.value.value;
    } else {
        generatingRecipe.value = true;
        try {
            await chatGptWebSearch(inputRef.value.value);
        } catch (e) {
            console.error(e);
            errorOccurred.value = true;
            await beginSearch();
            return;
        }
        generatingRecipe.value = false;
    }
    // Redirect to ingredients page after recipe object has been saved in store.
    router?.push(isBasicMode.value ? '/overview' : '/ingredients');
}

const showPromptInfo = ref<boolean>(false);
</script>

<template>
    <div class="w-full h-full flex flex-col justify-center items-center gap-5">
        <div>
            <h1>Recipe</h1>
            <div v-if="isBasicMode">
                <p class="text-lg">Please enter your prompt to generate a recipe below.</p>
                <h3 class="text-md">Provide any preferences for your recipe now!</h3>
            </div>
            <p v-else class="text-lg">Please enter the recipe name below.</p>
        </div>
        <div v-if="!generatingRecipe" class="flex flex-col w-full items-center gap-2">
            <div class="w-full sm:w-1/2 flex gap-2">
                <input v-if="!isBasicMode" v-on:keydown.enter="beginSearch" ref="inputRef" class="w-full rounded-lg p-2" type="text" placeholder="Type your text here.." />
                <textarea v-else v-on:keydown.enter="beginSearch" ref="inputRef" class="w-full rounded-lg p-2 bg-secondary text-primary" type="text" :placeholder="'Type your text here..'"></textarea>
                <button :onclick="beginSearch">Go</button>
            </div>
            <div class="w-1/2" v-if="isBasicMode">
                <div :onclick="() => showPromptInfo = !showPromptInfo" class="bg-accent text-[black] p-1 rounded-md">Click for system prompt information</div>
                <p v-if="showPromptInfo" class="text-md justify-normal">Every prompt entered has this system message attached: <b>[{{ PROMPT_HEADER }}]</b> to help with json mapping and consistency.</p>
            </div>
        </div>
        <div v-else class="w-full h-full flex flex-col justify-center items-center text-secondary">
            <h2>Generating recipe...</h2>
            <loading-spinner />
            <h3 v-if="errorOccurred">Error occured, retrying..</h3>
        </div>
    </div>
</template>

<style scoped>
textarea::placeholder {
  color: rgb(255, 213, 213);
}
</style>