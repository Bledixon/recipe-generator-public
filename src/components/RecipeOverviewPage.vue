<script setup lang="ts">
import { useRecipeStore } from '../stores/recipe';
import SingleIngredient from './SingleIngredient.vue';
import SingleStep from './SingleStep.vue';
import CustomGptInput from './CustomGptInput.vue';
import { ref, computed } from 'vue';

const recipeStore = useRecipeStore();
const recipe = computed(() => recipeStore.recipe);

const showSteps = ref<boolean>(false);
</script>

<template>
    <div class="flex flex-col h-screen">
        <div v-if="recipe !== undefined">
            <h2 class="font-bold text-xl">{{ recipe.name }}</h2>
            <h6>Generated recipe overview.</h6>
            <h3 class="">Estimated cooking time: <b>{{ recipe.duration_in_minutes }} min</b></h3>
        </div>
        <div v-if="recipe === undefined" class="flex flex-col justify-center items-center gap-1 p-4">
            <h2 class="font-bold text-xl">Error displaying recipe!</h2>
            <p>Recipe is invalid. Please try again.</p>
            <button class="w-3/4 md:w-1/4">
                <router-link to="/">Go home</router-link>
            </button>
        </div>
        <div v-else class="flex flex-col md:flex-row justify-center gap-2 w-full mt-6 overflow-hidden">
            <button class="md:hidden w-4/5 self-center bg-accent text-[black] rounded" :onclick="() => showSteps = !showSteps">
                Show {{ showSteps ? "Ingredients" : "Steps" }}
            </button>
            <div :class="{'hidden md:block' : showSteps}" class="flex flex-col items-center gap-1 p-1 w-full md:w-1/2 overflow-x-scroll md:overflow-y-scroll">
                <h2 class="text-left w-full font-bold text-xl">Ingredients</h2>
                <single-ingredient v-for="ingredient in recipe.ingredients" :key="ingredient.id" 
                    :id="ingredient.id"
                    :name="ingredient.name" 
                    :amount="ingredient.amount"
                    :unit="ingredient.measurement"
                    :can-edit="false"
                />
            </div>
            <div :class="{'hidden md:block' : !showSteps}" class="flex flex-col items-center gap-1 p-1 w-full md:w-1/2 overflow-x-scroll md:overflow-y-scroll">
                <h2 class="text-left font-bold text-xl">Steps</h2>
                <single-step v-for="(step, index) in recipe.steps" :key="step.id" 
                    :id="step.id" 
                    :index="index"
                    :description="step.description" 
                    :can-edit="false" 
                />
            </div>
        </div>
        <div class="grow"></div>
        <div class="flex flex-col justify-center items-center mt-6">
            <custom-gpt-input :edit-whole-recipe=true :large-mode="true" custom-class="w-4/5 mb-4 md:mb-6" />
            <router-link to="/cooking" class="h-20 w-4/5">
                <button class="w-full md:w-1/2 bg-secondary">Start Cooking!</button>
            </router-link>
        </div>
    </div>
</template>

<style scoped></style>