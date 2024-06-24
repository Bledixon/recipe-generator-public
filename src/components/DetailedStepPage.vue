<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRecipeStore } from '../stores/recipe';
import MenuLeft from '~icons/mdi/menu-left'
import MenuRight from '~icons/mdi/menu-right'
import { type Step } from '../model/recipe';
import { LayoutOptions } from '../utils';
import { useStopwatchStore, useTotalStopwatchStore } from '../stores/stopwatch';
import { formatTimeInMinutesAndSeconds } from '../utils/Utils';

const recipeStore = useRecipeStore();
const recipe = recipeStore.recipe;
const currentStepIndex = ref<number>(0);
const currentStep = ref<Step>();
currentStep.value = recipe?.steps[currentStepIndex.value];

const { time, pauseTimer, resetTimer } = useStopwatchStore();
const { totalTime, pauseTotalTimer, resetTotalTimer } = useTotalStopwatchStore();

function addCompletionTimeToSessionCache() {
    // Pause the timer.
    pauseTimer();
    pauseTotalTimer();
    // Get the current date and time
    const now = new Date();
    const timestamp = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;

    const recipeStore = useRecipeStore();
    const layoutMode = recipeStore.layoutMode;

    const userName = localStorage.getItem('current_user') || 'User';

    // Format the log message
    let logMessage = `${timestamp} [${userName}] [${LayoutOptions[layoutMode]}]: Finished Task in: ${formatTimeInMinutesAndSeconds(time)}\n`;
    logMessage += `${timestamp} [${userName}] [${LayoutOptions[layoutMode]}]: Total Task time: ${formatTimeInMinutesAndSeconds(totalTime)}\n`;

    // Append the log message to the session storage
    const logCache = localStorage.getItem('log_cache') || '';
    localStorage.setItem('log_cache', logCache + logMessage);
    // Reset the timer as it is not needed anymore
    resetTimer();
    resetTotalTimer();
}

onMounted(() => {
    addCompletionTimeToSessionCache();
});

function nextStep(): void {
    // Check if recipe is undefined.
    if (recipe === undefined) {
        return;
    }
    // Check if current step is valid, otherwise set to first step.
    if (currentStepIndex.value < recipe.steps.length - 1) {
        currentStepIndex.value++;
    } else {
        currentStepIndex.value = 0;
    }
    // Set current step.
    currentStep.value = recipe.steps[currentStepIndex.value];
}

function previousStep(): void {
    // Check if recipe is undefined.
    if (recipe === undefined) {
        return;
    }
    // Check if current step is valid, otherwise set to last step.
    if (currentStepIndex.value > 0) {
        currentStepIndex.value--;
    } else {
        currentStepIndex.value = recipe.steps.length - 1;
    }
    // Set current step.
    currentStep.value = recipe.steps[currentStepIndex.value];
}

const currentIngredients = computed(() => {
    if (recipe === undefined) {
        return [];
    }
    return recipe.ingredients.filter(ing => {
        if (currentStep.value?.description.toLowerCase().includes(ing.name.toLowerCase().split(' ').pop()?.toLowerCase() ?? ing.name.toLowerCase())) {
            return ing;
        }
    });
});
</script>

<template>
<div class="flex flex-col items-center h-full w-full gap-4">
    <div v-if="recipe !== undefined && currentStep !== undefined">
        <h2 class="font-bold text-xl">{{ recipe?.name }}</h2>
        <h6>Step {{ currentStepIndex+1 }}</h6>
    </div>
    <div v-if="recipe === undefined || currentStep === undefined" class="flex justify-center align-middle gap-1 p-4 h-screen w-screen">
        <h2>Error displaying steps!</h2>
        <p>Please try again.</p>
        <router-link to="/">Go home</router-link>
    </div>
    <div v-else class="flex flex-col grow items-center gap-3 p-1 w-full text-justify overflow-scroll">
        <div>
            <h3 class="text-lg font-bold text-center">Ingredients</h3>
            <div v-if="currentIngredients.length > 2" class="flex flex-row gap-2">
                <div v-for="ingredient in currentIngredients" :key="ingredient?.id" class=" bg-secondary text-primary rounded-lg p-2">
                    <p class="text-sm">{{ ingredient?.amount }} {{ ingredient?.measurement }}</p>
                    <p class="font-bold">{{ ingredient?.name }}</p>
                </div>
            </div>
            <div v-else>
                <p>None needed in this step.</p>
            </div>
        </div>
        <div class="pt-4 w-4/5 text-2xl grow">
            <p v-if="recipe.steps[currentStepIndex-1] !== undefined" class="opacity-40 pb-3">{{ recipe.steps[currentStepIndex-1].description }}</p>
            <p>{{ currentStep?.description }}</p></div>
        <div class="flex flex-col gap-3 w-4/5 text-primary font-medium">
            <h6 v-if="recipe.steps[currentStepIndex+1]" class="bg-secondary rounded-lg p-2">Preview</h6>
            <div v-for="n in 2">
                <div class="bg-secondary rounded-lg p-2" :class="`opacity-${100-(n*30)}`" v-if="recipe.steps[currentStepIndex+n]">
                    <p>Step {{ currentStepIndex+n+1 }}</p>
                    <p>{{ recipe.steps[currentStepIndex+n].description }}</p>
                </div>
                <!-- Adding these so they are packaged in the vite build -->
                <div class="opacity-70 opacity-40"></div>
            </div>
        </div>
    </div>
    <div class="grid grid-cols-2 gap-4">
        <button class="flex flex-row items-center justify-end" @click="previousStep"><menu-left/> {{ currentStepIndex > 0 ? 'Previous' : 'Last' }}</button>
        <button class="flex flex-row items-center justify-start" @click="nextStep">{{ currentStepIndex < (recipe?.steps.length ?? 1) - 1 ? 'Next' : 'First'}} <menu-right/></button>
    </div>
</div>
</template>

<style scoped></style>