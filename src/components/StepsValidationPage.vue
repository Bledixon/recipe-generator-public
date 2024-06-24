<script setup lang="ts">
import { useRecipeStore } from '../stores/recipe';
import { changeMinutes, removeStepFromRecipe, validateRecipe } from '../api/chatGptSearch';
import SingleStep from './SingleStep.vue';
import { ref, computed } from 'vue';
import MdiCircleArrows from '~icons/mdi/circle-arrows';
import LoadingSpinner from './LoadingSpinner.vue';

const recipeStore = useRecipeStore();
const recipe = computed(() => recipeStore.recipe);
const isValidating = ref<boolean>(false);

async function onValidateRecipe() {
    isValidating.value = true;
    await validateRecipe();
    isValidating.value = false;
}

async function onMinutesChange(reduceTime : boolean = false) {
    isValidating.value = true;
    await changeMinutes(reduceTime);
    isValidating.value = false;
}

async function removeStep(name : string) : Promise<void> {
    isValidating.value = true;
    await removeStepFromRecipe(name);
    isValidating.value = false;
}
</script>

<template>
    <div class="flex flex-col h-full">
        <div v-if="recipe !== undefined">
            <h2 class="font-bold text-xl">{{ recipe?.name }}</h2>
            <h6>Steps</h6>
            <div class="flex flex-col w-full items-center justify-center gap-2 mb-4">
                <h6 class="text-lg">Estimated cooking time: {{ recipe.duration_in_minutes }} mins</h6>
                <div class="flex flex-row gap-2">
                    <button class="bg-accent text-[black]" :onclick="() => onMinutesChange(true)">Make it shorter</button>
                    <button class="bg-accent text-[black]" :onclick="() => onMinutesChange()">Make it longer</button>
                </div>
            </div>
        </div>
        <div v-if="recipe === undefined" class="flex flex-col justify-center items-center gap-1 p-4">
            <h2 class="font-bold text-xl">Error displaying steps!</h2>
            <p>Recipe is invalid. Please try again.</p>
            <button class="w-1/4">
                <router-link to="/">Go home</router-link>
            </button>
        </div>
        <div v-else class="flex flex-col gap-2 items-center overflow-hidden">
            <div class="flex flex-col items-center my-4 gap-1 w-full md:w-1/2 overflow-y-auto">
                <h2 class="text-lg"><b>Select</b> steps you want to change by clicking.</h2>
                <div class="flex flex-col items-center justify-center" v-if="isValidating">
                    <p>Validating...</p>
                    <loading-spinner/>
                </div>
                <div v-else class="w-full">
                    <single-step v-for="(step, index) in recipe.steps" :key="step.id" 
                        :id="step.id"
                        :index="index" 
                        :description="step.description"
                        :use-input-fields="true"
                        @remove-step="removeStep"/>
                </div>
            </div>
        </div>
        <button :onclick="onValidateRecipe" class="w-2/5 self-center my-4" :class="{ 'bg-accent text-[black]' : recipeStore.isPendingStepsChanges, 'bg-secondary' : !recipeStore.isPendingStepsChanges }" :disabled="!recipeStore.isPendingIngredientChanges">Validate</button>
        <div class="flex-grow"></div>
        <router-link to="/cooking">
            <button class="w-1/2 bg-secondary">Start Cooking!</button>
        </router-link>
    </div>
</template>

<style scoped></style>