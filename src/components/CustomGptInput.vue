<script setup lang="ts">
import { ref } from 'vue';
import { changeIngredientForRecipe, changeIngredientsForRecipe, changeRecipe, changeStepForRecipe, changeStepsForRecipe } from '../api/chatGptSearch';
import LoadingSpinner from './LoadingSpinner.vue';

const props = defineProps({
    isIngredients: {
        type: Boolean,
        required: false,
    },
    isIngredient: {
        type: Boolean,
        required: false,
    },
    isStep: {
        type: Boolean,
        required: false,
    },
    editWholeRecipe: {
        type: Boolean,
        required: false,
    },
    customClass: {
        type: String,
        required: false,
    },
    inputHeight: {
        type: Number,
        required: false,
    },
    largeMode: {
        type: Boolean,
        required: false,
    },
    fillSides: {
        type: Boolean,
        required: false,
    },
});

const inputRef = ref();
const loadingChange = ref<boolean>(false);

async function onEnter(): Promise<void> {
    let ingredientChange = inputRef.value;
    if (ingredientChange === undefined || ingredientChange.value.length <= 2) {
        return;
    }
    loadingChange.value = true;
    await determineGptFunction(ingredientChange.value);
    loadingChange.value = false;
    inputRef.value = "";
}

const errorWhenGenerating = ref<boolean>(false);
let errorCounter : number = 0;

async function determineGptFunction(userChange : string): Promise<void> {
    try {
        if (props.editWholeRecipe) {
            await changeRecipe(userChange, true);
            return;
        }
        if (props.isIngredient) {
            await changeIngredientForRecipe(userChange);
        } else if (props.isIngredients) {
            await changeIngredientsForRecipe(userChange);
        } else if (props.isStep) {
            await changeStepForRecipe(userChange);
        } else {
            await changeStepsForRecipe(userChange);
        }
    } catch (ex) {
        errorWhenGenerating.value = true;
        console.error(ex);
        if (errorCounter++ < 3) {
            determineGptFunction(userChange);
            errorWhenGenerating.value = false;
            
        }
    }
}

const showPromptInfo = ref<boolean>(false);
</script>

<template>
    <h3 class="text-lg font-bold">Would you like to change anything?</h3>
    <div v-if="!loadingChange" class="flex flex-col w-full justify-center items-center">
        <div :class="`flex flex-row ${customClass} text-[black] gap-2 mt-2 ${largeMode ? 'flex-col items-center w-full' : ''}`">
            <textarea v-if="largeMode" ref="inputRef" v-on:keyup.enter="onEnter" :class="{ 'w-full md:w-3/4' : fillSides, 'w-full md:w-1/2' : !fillSides }"  class="bg-accent text-[black] rounded-lg p-2" placeholder="Type your text here.."></textarea>
            <input v-else ref="inputRef" v-on:keyup.enter="onEnter" class="w-3/4 md:w-5/6 bg-accent text-[black] rounded-lg p-2" type="text" placeholder="Type your text here.." />
            <button class="w-1/4 md:w-1/6 bg-accent text-[black] rounded-lg p-2" :onclick="onEnter">Submit</button>
        </div>
        <div v-if="editWholeRecipe" class="w-1/2 mb-2 flex flex-col items-center">
            <div :onclick="() => showPromptInfo = !showPromptInfo" class="bg-accent text-[black] p-1 rounded-md w-1/2">Click for system prompt information</div>
            <p v-if="showPromptInfo" class="text-md justify-normal">Every prompt entered has this system message attached: <b>[Given this recipe: 'RECIPE DATA'. 'YOUR QUERY'. Only provide the changed fields of the recipe. If an ingredient needs to be removed, add a "remove" field to the ingredient.]</b> to help with json mapping and consistency.</p>
        </div>
    </div>
    <div v-else class="text-secondary pl-2 flex items-center justify-center">
        Loading...
        <loading-spinner/>
        <p v-if="errorWhenGenerating">Error when generating request, retying..</p>
    </div>
</template>

<style scoped>
input::placeholder,
textarea::placeholder {
    color: black;
    opacity: 0.5;
}
</style>