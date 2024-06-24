import { defineStore } from 'pinia'
import { Recipe, RecipePreview } from '../model/recipe'
import { ref, watch, type Ref, computed } from 'vue'
import { LayoutDefinition } from '../utils'

export const useRecipeStore = defineStore('recipe', () => {
    const recipe : Ref<Recipe | undefined>  = ref<Recipe>();
    const possibleRecipes : Ref<RecipePreview[] | undefined> = ref<RecipePreview[]>();
    const layoutMode : Ref<number> = ref<number>(+(localStorage.getItem("layout_mode") ?? LayoutDefinition.BASIC));
    const recipeNameBuffer : Ref<string> = ref<string>("");
    const recipeIngredientsBuffer : Ref<string> = ref<string>("");
    const sliderId : Ref<number> = ref<number>(0);
    const sliderPreferences: Ref<Array<{ minName: string, maxName: string, value: number }>> = ref([]);
    const categoryPreferences: Ref<String[]> = ref([]);
    const selectedIngredients: Ref<String[]> = ref([]);
    const selectedSteps: Ref<String[]> = ref([]);
    const unresolvedIngredientsChanges: Ref<{[key: string]: string} | null> = ref<{ [key: string]: string } | null>(null);
    const unresolvedStepsChanges: Ref<{[key: string]: string} | null> = ref<{ [key: string]: string } | null>(null);
    const unresolvedServingsChange: Ref<number> = ref<number>(0);
    const validationAddIngredient: Ref<string> = ref<string>("");

    function setUnresolvedIngredientsValidation(key : string, value : string, remove: boolean) {
        if (unresolvedIngredientsChanges.value === null) {
            unresolvedIngredientsChanges.value = {};
        }
        if (remove) {
            delete unresolvedIngredientsChanges.value[key];
        } else {
            unresolvedIngredientsChanges.value[key] = value;
        }
    }

    function setUnresolvedStepsValidation(key : string, value : string, remove: boolean) {
        if (unresolvedStepsChanges.value === null) {
            unresolvedStepsChanges.value = {};
        }
        if (remove) {
            delete unresolvedStepsChanges.value[key];
        } else {
            unresolvedStepsChanges.value[key] = value;
        }
    }

    function getUnresolvedIngredientsValidation(): [string, string][] {
        if (unresolvedIngredientsChanges.value === null) {
            return [];
        }
        return Object.entries(unresolvedIngredientsChanges.value);
    }

    function getUnresolvedStepsValidation(): [string, string][] {
        if (unresolvedStepsChanges.value === null) {
            return [];
        }
        return Object.entries(unresolvedStepsChanges.value);
    }

    function getUnresolvedServingValidation(): number {
        return unresolvedServingsChange.value;
    }

    function setUnresolvedServingChange(value: number) {
        unresolvedServingsChange.value = value;
    }

    function setValidationIngredient(value: string) {
        validationAddIngredient.value = value;
    }

    function changeLayoutMode(newmode : number): void {
        layoutMode.value = newmode;
    }

    const pendingValidationIngredientsChanges = computed(() => {
        // Check if changes have been made.
        if (unresolvedIngredientsChanges.value === null) {
            return false;
        }
        // Check if value has keys, then validate it's at least one.
        const keys = Object.keys(unresolvedIngredientsChanges.value)
        if (keys === undefined) {
            return false;
        }
        return keys.length > 0;
    })

    const pendingValidationStepsChanges = computed(() => {
        // Check if changes have been made.
        if (unresolvedStepsChanges.value === null) {
            return false;
        }
        // Check if value has keys, then validate it's at least one.
        const keys = Object.keys(unresolvedStepsChanges.value)
        if (keys === undefined) {
            return false;
        }
        return keys.length > 0;
    })

    const isPendingIngredientChanges = computed(() => {
        return pendingValidationIngredientsChanges.value || validationAddIngredient.value.trim() != "" || unresolvedServingsChange.value != recipe.value?.servings;
    });

    const isPendingStepsChanges = computed(() => {
        return pendingValidationStepsChanges.value;
    });

    function resetValidationChanges() {
        validationAddIngredient.value = "";
        unresolvedIngredientsChanges.value = null;
        unresolvedStepsChanges.value = null;
        unresolvedServingsChange.value = 0;
    }

    function setSliderPreferences(sliderId: number, minName: string, maxName: string, value: number): void {
        sliderPreferences.value[sliderId] = { minName, maxName, value };
    }

    function setCategoryPreferences(category: string, remove:boolean):void {
        if (remove) {
            categoryPreferences.value = categoryPreferences.value.filter((x) => x !== category);
        } else {
            categoryPreferences.value.push(category);
        }
    }

    function setSelectedIngredients(ingredient: string, remove:boolean):void {
        if (remove) {
            selectedIngredients.value = selectedIngredients.value.filter((x) => x !== ingredient);
        } else {
            selectedIngredients.value.push(ingredient);
        }
    }

    function setSelectedSteps(stepId: string, remove:boolean):void {
        if (remove) {
            selectedSteps.value = selectedSteps.value.filter((x) => x !== stepId);
        } else {
            selectedSteps.value.push(stepId);
        }
    }

    function getSliderPreferencesAsString(): string {
        return sliderPreferences.value.map((x) => `[${x.minName}] [${x.maxName}] [${x.value}]`).join("; ");
    }

    function resetSliderPreferences(): void {
        sliderPreferences.value = [];
    }

    function resetCategoryPreferences(): void {
        categoryPreferences.value = [];
    }

    function getCategoryPreferencesAsString(): string {
        return categoryPreferences.value.join("; ");
    }

    function getSelectedIngredientsAsString(): string {
        const res = selectedIngredients.value.join("; ");
        selectedIngredients.value = [];
        return res;
    }

    function getSelectedStepsAsString(): string {
        const res = selectedSteps.value.join("; ");
        selectedSteps.value = [];
        return res;
    }

    watch(layoutMode, (newmode) => {
        localStorage.setItem("layout_mode", newmode.toString());
    });

    return { recipe, possibleRecipes, layoutMode, validationAddIngredient, pendingValidationIngredientsChanges, pendingValidationStepsChanges, setUnresolvedIngredientsValidation, setUnresolvedStepsValidation, resetValidationChanges, getUnresolvedIngredientsValidation, getUnresolvedStepsValidation, setValidationIngredient, changeLayoutMode, setSliderPreferences, setCategoryPreferences, setSelectedIngredients, setSelectedSteps, getCategoryPreferencesAsString, getSelectedIngredientsAsString, getSelectedStepsAsString, recipeNameBuffer, recipeIngredientsBuffer, sliderPreferences, sliderId, getSliderPreferencesAsString, resetSliderPreferences, resetCategoryPreferences, isPendingIngredientChanges, isPendingStepsChanges, getUnresolvedServingValidation, setUnresolvedServingChange }
})