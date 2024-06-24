import '../style.css'
import { useRecipeStore } from '../stores/recipe'
import { createRouter, createWebHashHistory, Router } from 'vue-router'
import IndexPage from '../components/IndexPage.vue'
import EnterRecipePage from '../components/EnterRecipePage.vue'
import EnterIngredientsPage from '../components/EnterIngredientsPage.vue'
import EnterPreferencesPage from '../components/EnterPreferencesPage.vue'
import IngredientsOverviewPage from '../components/IngredientsOverviewPage.vue'
import IngredientsOverviewCombinedPage from '../components/IngredientsOverviewCombinedPage.vue'
import RecipesOverviewPage from '../components/RecipesOverviewPage.vue'
import StepsOverviewPage from '../components/StepsOverviewPage.vue'
import StepsOverviewCombinedPage from '../components/StepsOverviewCombinedPage.vue'
import DetailedStepPage from '../components/DetailedStepPage.vue'
import RecipeOverviewPage from '../components/RecipeOverviewPage.vue'
import { LayoutDefinition } from '../utils'
import IngredientsValidationPage from '../components/IngredientsValidationPage.vue'
import { useStopwatchStore, useTotalStopwatchStore } from '../stores/stopwatch';
import StepsValidationPage from '../components/StepsValidationPage.vue'
import ChatGPTPage from '../components/ChatGPTPage.vue'

const routes = [
    {
        path: '/',
        name: "Index",
        component: IndexPage
    },
    { 
        path: '/byrecipe', 
        name: "ByRecipe",
        component: EnterRecipePage 
    },
    {
        path: "/byingredients",
        name: "ByIngredients",
        component: EnterIngredientsPage
    },
    {
        path: "/preferences",
        name: "Preferences",
        component: EnterPreferencesPage
    },
    {
        path: "/ingredients",
        name: "Ingredients",
        component: IngredientsOverviewPage
    },
    {
        path: "/ingredients/combined",
        name: "IngredientsCombined",
        component: IngredientsOverviewCombinedPage
    },
    {
        path: "/recipes",
        name: "Recipes",
        component: RecipesOverviewPage
    },
    {
        path: "/steps",
        name: "Steps",
        component: StepsOverviewPage
    },
    {
        path: "/steps/combined",
        name: "StepsCombined",
        component: StepsOverviewCombinedPage
    },
    {
        path: "/cooking",
        name: "Cooking",
        component: DetailedStepPage
    },
    {
        path: "/overview",
        name: "Overview",
        component: RecipeOverviewPage
    },
    {
        path: "/validate/ingredients",
        name: "ValidateIngredients",
        component: IngredientsValidationPage
    },
    {
        path: "/validate/steps",
        name: "ValidateSteps",
        component: StepsValidationPage
    },
    {
        path: '/chat',
        name: 'Chat',
        component: ChatGPTPage,
    },
]

// Create the router instance and pass the `routes` option
const router: Router = createRouter({
    // Provide the history implementation to use. We are using the hash history for simplicity here.
    history: createWebHashHistory(),
    routes, // short for `routes: routes`
});

router.beforeEach((to, from, next) => {
    if (from.name === "Index") {
        const { startTimer } = useStopwatchStore();
        startTimer();
        const { startTotalTimer } = useTotalStopwatchStore();
        startTotalTimer();
    }
    const store = useRecipeStore();
    let layoutMode = store.layoutMode;

    // Basic combined ingredient & steps view.
    if (layoutMode == LayoutDefinition.BASIC) {
        if (to.name === "Ingredients") {
            next({ name: "IngredientsCombined" });
            return;
        }
        if (to.name === "Steps") {
            next({ name: "StepsCombined" });
            return;
        }
    }
    // Enter preferences before recipe generation.
    else if (layoutMode == LayoutDefinition.PREFERENCES) {
        if (to.name === "Recipes" || to.name === "ByRecipe") {
            next({ name: "Preferences" });
            return;
        }
    }
    // Validate user input.
    else if (layoutMode == LayoutDefinition.VALIDATION) {
        if (to.name === "Ingredients") {
            next({ name: "ValidateIngredients" });
            return;
        }
        if (to.name === "Steps") {
            next({ name: "ValidateSteps" });
            return;
        }
    }
    // Combined input variant.
    /*else if (layoutMode == LayoutDefinition.COMBINED) {
        if (to.name === "ByRecipe") {
            next({ name: "Preferences" });
            return;
        }
        if (to.name === "Overview") {
            next({ name: "ValidateIngredients" });
            return;
        }
    }*/

    next();
});

export default router