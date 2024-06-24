<script setup lang="ts">
import { onBeforeMount, ref, watch } from 'vue';
import CustomSlider from './CustomSlider.vue';
import CustomTagSelection from './CustomTagSelection.vue';
import { Router, useRouter } from 'vue-router';
import { generateRecipeWithPreferences } from '../api/chatGptSearch';
import { useRecipeStore } from '../stores/recipe';
import LoadingSpinner from './LoadingSpinner.vue';

const generatingRecipe = ref<boolean>(false);
const errorOccurred = ref<boolean>(false);

let errorCounter : number = 0;
let router:Router | null = null;

onBeforeMount(() => {
    router = useRouter();
    isFromIngredientPage.value = router.options.history.state.back === '/byingredients';
});

async function submitPreferences() : Promise<void> {
    generatingRecipe.value = true;
    try {
        await generateRecipeWithPreferences();
    } catch (e) {
        console.error(e);
        errorOccurred.value = true;
        if (errorCounter++ > 3) {
            errorOccurred.value = false;
            generatingRecipe.value = false;
            return;
        }
        submitPreferences();
        return;
    }
    errorOccurred.value = false;
    generatingRecipe.value = false;
    // Redirect to ingredients page after recipe object has been saved in store.
    router?.push('/overview');
}

const recipeNameModel = ref<string>("");
const isFromIngredientPage = ref<boolean>(false);

const recipeStore = useRecipeStore();

watch(recipeNameModel, (newRecipeName) => {
    recipeStore.recipeNameBuffer = newRecipeName;
});
</script>

<template>
    <div v-if="!generatingRecipe" class="h-full flex flex-col justify-center items-center gap-5">
        <div>
            <h1>Preferences</h1>
            <p>Do you have any additional preferences?</p>
        </div>
        <div class="flex-grow"></div>
        <div v-if="!isFromIngredientPage" class="flex flex-col w-1/2">
            <h3 class="text-xl font-bold">Recipe Name</h3>
            <input v-model="recipeNameModel" class="w-full rounded-lg p-2" type="text" placeholder="Type your text here.." />
        </div>
        <div class="flex-grow"></div>
        <div class="flex flex-col md:flex-row gap-5 overflow-hidden">
            <div class="w-full md:w-2/3 overflow-y-scroll">
                <h2 class="text-xl text-left font-bold mb-1">Spectrum</h2>
                <h3 class="text-left ">Leave a slider untouched to ignore it in the recipe generation.</h3>
                <h3 class="text-left font-medium mb-2">Double-Click to reset value.</h3>
                <custom-slider min-name="Low Calorie" max-name="High Calorie"/>
                <custom-slider min-name="Sweet" max-name="Savory"/>
                <custom-slider min-name="Simple" max-name="Complex"/>
                <custom-slider min-name="Authentic" max-name="Fusion"/>
                <custom-slider min-name="Mild" max-name="Spicy"/>
                <custom-slider min-name="Light" max-name="Heavy"/>
                <custom-slider min-name="Soft" max-name="Crunchy"/>
                <custom-slider min-name="Dry" max-name="Juicy"/>
                <custom-slider min-name="Cold" max-name="Hot"/>
            </div>
            <div class="w-full md:w-1/3 overflow-y-scroll">
                <h2 class="text-xl text-left font-bold mb-2">Categories</h2>
                <custom-tag-selection :categories="['Dairy-Free', 'Plant-Based', 'High Protein', 'Low Carb', 'Gluten-Free', 'Nut-Free', 'Vegan', 'Vegetarian', 'Sugar-Free', 'Egg-Free', 'Shellfish-Free', 'Soy-Free', 'Halal', 'Kosher', 'Under 2 hours', 'Under 1 hour', '15 minutes or less']"/>
            </div>
        </div>
        <div class="flex-grow"></div>
        <button :onclick="submitPreferences" class="w-full md:w-1/2">Generate</button>
    </div>
    <div v-else class="w-full h-full flex flex-col justify-center items-center text-secondary">
        <h2>Generating recipe...</h2>
        <loading-spinner />
        <h3 v-if="errorOccurred">Error occured, retrying..</h3>
    </div>
</template>

<style scoped>
</style>