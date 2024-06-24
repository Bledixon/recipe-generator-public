<script setup lang="ts">
import { useRecipeStore } from '../stores/recipe';
import SingleIngredient from './SingleIngredient.vue';
import CustomGptInput from './CustomGptInput.vue';
import { computed } from 'vue';

const recipeStore = useRecipeStore();
const recipe = computed(() => recipeStore.recipe);
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
        <div v-else class="flex flex-row gap-2 overflow-hidden">
            <div class="w-1/2 my-4">
                <custom-gpt-input :large-mode="true" :is-ingredient="true" :fill-sides="true"></custom-gpt-input>
            </div>
            <div class="flex flex-col items-center my-4 gap-1 w-1/2 overflow-y-auto">
                <h2 class="text-lg"><b>Select</b> ingredients you want to change by clicking.</h2>
                <h2 class="text-md">Select none if you want to change more generalized aspects. (Cooking time, add/remove ingredients, ...).</h2>
                <single-ingredient class="select-none" v-for="ingredient in recipe.ingredients" :key="ingredient.id" 
                    :id="ingredient.id"
                    :name="ingredient.name" 
                    :amount="ingredient.amount"
                    :unit="ingredient.measurement"
                    :clickable="true"/>
            </div>
        </div>
        <div class="flex-grow"></div>
        <router-link to="/steps">
            <button class="w-1/2 bg-secondary">Continue</button>
        </router-link>
    </div>
</template>

<style scoped></style>