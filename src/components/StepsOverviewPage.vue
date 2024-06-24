<script setup lang="ts">
import { useRecipeStore } from '../stores/recipe';
import SingleStep from './SingleStep.vue';
import CustomGptInput from './CustomGptInput.vue';
import { computed } from 'vue';

const recipeStore = useRecipeStore();
const recipe = computed(() => recipeStore.recipe);
</script>

<template>
    <div class="flex flex-col h-full gap-4">
        <div v-if="recipe !== undefined">
            <h2 class="font-bold text-xl">{{ recipe?.name }}</h2>
            <h6>Steps</h6>
            <h3 class="">Estimated cooking time: <b>{{ recipe.duration_in_minutes }} min</b></h3>
        </div>
        <div v-if="recipe === undefined" class="flex justify-center align-middle gap-1 p-4 h-screen w-screen">
            <h2>Error displaying steps!</h2>
            <p>Please try again.</p>
            <router-link to="/">Go home</router-link>
        </div>
        <div v-else class="flex flex-row gap-2 flex-grow overflow-hidden">
            <div class="w-1/2 my-4">
                <custom-gpt-input :large-mode="true" :is-step="true" :fill-sides="true"></custom-gpt-input>
            </div>
            <div class="w-1/2 my-4 flex flex-col items-center gap-1 overflow-y-auto">
                <h2 class="text-lg"><b>Select</b> steps you want to change by clicking.</h2>
                <single-step v-for="(step, index) in recipe.steps" :key="step.id"
                    :id="step.id"
                    :index="index"
                    :description="step.description"
                    :clickable="true"/>
            </div>
        </div>
        <router-link to="/cooking">
            <button class="w-1/2 bg-secondary">Start Cooking!</button>
        </router-link>
    </div>
</template>

<style scoped></style>