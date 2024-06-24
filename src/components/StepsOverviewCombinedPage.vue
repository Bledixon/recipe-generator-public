<script setup lang="ts">
import { computed } from 'vue';
import { useRecipeStore } from '../stores/recipe';
import CustomGptInput from './CustomGptInput.vue';
import SingleStep from './SingleStep.vue';

const recipeStore = useRecipeStore();
const recipe = computed(() => recipeStore.recipe);
</script>

<template>
    <div class="flex flex-col h-screen gap-4">
        <div v-if="recipe !== undefined">
            <h2 class="font-bold text-xl">{{ recipe?.name }}</h2>
            <h6>Steps</h6>
        </div>
        <div v-if="recipe === undefined" class="flex justify-center align-middle gap-1 p-4 h-full w-full">
            <h2>Error displaying steps!</h2>
            <p>Please try again.</p>
            <router-link to="/">Go home</router-link>
        </div>
        <div v-else class="flex flex-col items-center gap-3 p-1 w-full overflow-y-scroll">
            <custom-gpt-input :is-ingredients="false" custom-class="w-4/5" :input-height="200" />
            <single-step v-for="(step, index) in recipe.steps" :key="step.id" 
                :id="step.id"
                :index="index"
                :description="step.description"
                :can-edit="false"/>
        </div>
        <router-link to="/cooking" class="w-full mb-6 h-20">
            <button>Start Cooking!</button>
        </router-link>
    </div>
</template>

<style scoped></style>