<script setup lang="ts">
import { onBeforeMount, onMounted, ref } from 'vue';
import { buildRecipeFromIngredientListAndPreferences, buildRecipeFromIngredientList } from '../api/chatGptSearch';
import { Router, useRouter } from 'vue-router';
import ModalConfirmDelete from './ModalConfirmDelete.vue';
import { useModal } from 'vue-final-modal';
import { useRecipeStore } from '../stores/recipe';
import { LayoutDefinition } from '../utils';
import LoadingSpinner from './LoadingSpinner.vue';

const ingredientsList = ref<string[]>([]);
const inputRef = ref<HTMLInputElement | null>(null);
const addButtonRef = ref<HTMLButtonElement | null>(null);

const recipeStore = useRecipeStore();

const { open, close } = useModal({
    component: ModalConfirmDelete,
    attrs: {
      onConfirm() {
        close();
        showModal = (localStorage.getItem("show_delete_modal") ?? "true") === "true";
        removeFromListByKey(true);
      },
    },
  })

function addToList(): void {
    if (inputRef.value == null) {
        return;
    }
    if (inputRef.value.value.trim() === '') {
        return;
    }
    if (ingredientsList.value.includes(inputRef.value.value)) {
        return;
    }

    ingredientsList.value.push(inputRef.value.value);
    inputRef.value.value = "";
    inputRef.value.focus();
}

function removeFromListByKey(force:boolean): void {
    if (inputRef.value == null) {
        return;
    }
    if (inputRef.value.value.length !== 0) {
        return;
    }
    if (ingredientsList.value.length === 0) {
        return;
    }
    if (!force && showModal) {
        open();
        return;
    }

    ingredientsList.value.pop();
}

function removeFromList(index:number): void {
    if (inputRef.value == null) {
        return;
    }

    ingredientsList.value.splice(index, 1);
}

let router:Router | null = null;

onBeforeMount(() => {
    router = useRouter();
});

let showModal = true;

const isBasicMode = ref<Boolean>(false);
const isPreferencesMode = ref<Boolean>(false);

onMounted(() => {
    inputRef.value?.addEventListener("keypress", function(event) {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        addButtonRef.value?.click();
    }
    });
    showModal = (localStorage.getItem("show_delete_modal") ?? "true") === "true"
    isBasicMode.value  = recipeStore.layoutMode == LayoutDefinition.BASIC;
    isPreferencesMode.value = recipeStore.layoutMode == LayoutDefinition.PREFERENCES;
})

const generatingRecipe = ref<boolean>(false);
const errorOccurred = ref<boolean>(false);
const textAreaModel = ref<string>("");
let errorCounter : number = 0;

async function submitIngredientsBasic(): Promise<void> {
    generatingRecipe.value = true;
    try {
        await buildRecipeFromIngredientListAndPreferences(textAreaModel.value)
    } catch (e) {
        errorOccurred.value = true;
        console.error(e);
        if (errorCounter++ > 3) {
            errorOccurred.value = false;
            generatingRecipe.value = false;
            return;
        }
        submitIngredientsBasic();
    }
    errorOccurred.value = false;
    generatingRecipe.value = false;
    // Redirect to ingredients page after recipe object has been saved in store.
    router?.push('/overview');
}

async function submitIngredients(): Promise<void> {
    if (ingredientsList.value.length === 0) {
        return;
    }
    // Preference modes has to go to different page.
    if (isPreferencesMode.value) {
        recipeStore.recipeIngredientsBuffer = ingredientsList.value.join(", ");
        router?.push('/preferences');
        return;
    }
    // Basic workflow.
    generatingRecipe.value = true;
    try {
        await buildRecipeFromIngredientList(ingredientsList.value);
    } catch (e) {
        errorOccurred.value = true;
        console.error(e);
        submitIngredients();
        return;
    }
    errorOccurred.value = false;
    generatingRecipe.value = false;
    // Redirect to ingredients page after recipe object has been saved in store.
    router?.push('/ingredients');
}

</script>

<template>
    <div v-if="!generatingRecipe" class="w-full h-full flex flex-col justify-center items-center gap-5">
        <div v-if="isBasicMode" class="h-full">
            <div class="flex flex-col gap-2 items-center h-full">
                <h2 class="text-xl font-bold">Generate Recipe through Ingredients</h2>
                <div class="flex-grow"></div>
                <p>Please enter a prompt containing ingredients & preferences</p>
                <textarea v-on:keyup.enter="submitIngredientsBasic" v-model="textAreaModel" class="w-full rounded-lg p-2 bg-secondary text-[white]" type="text" placeholder="Type your text here.." ></textarea>
                <div class="flex-grow"></div>
                <button :onclick="submitIngredientsBasic" class="w-full sm:w-3/4 mb-7">Go</button>
            </div>
        </div>
        <div v-else class="h-full">
            <h1>Enter Ingredient Names</h1>
            <ul class="w-full h-3/4 list-none list-inside overflow-scroll flex flex-col justify-end gap-1">
                <li v-for="(ingredient, index) in ingredientsList" :index="index" :key="ingredient">
                    <div class="w-full flex flex-row gap-2 justify-between items-center">
                        <div class="p-2 bg-accent rounded-lg w-full text-left text-[black]">{{ ingredient }}</div> 
                        <button class="px-4 py-2" :onclick="() => removeFromList(index)">x</button>
                    </div>
                </li>
            </ul>
            <div class="w-full h-12 flex gap-2 mt-4">
                <input v-on:keydown.backspace="() => removeFromListByKey(false)" v-on:keyup.enter="addToList" ref="inputRef" class="w-full rounded-lg p-2" type="text" placeholder="Mushroom" />
                <button ref="addButtonRef" :onclick="addToList">Add</button>
            </div>
        <button :onclick="submitIngredients" class="w-full mt-8">Go</button>
        </div>
    </div>
    <div v-else class="w-full h-full flex flex-col justify-center items-center text-secondary">
        <p>Generating recipe...</p>
        <loading-spinner />
        <h3 v-if="errorOccurred">Error occured, retrying..</h3>
    </div>
</template>

<style scoped>
textarea::placeholder {
  color: rgb(255, 213, 213);
}
</style>