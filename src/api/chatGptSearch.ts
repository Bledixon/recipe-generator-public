import { CHATGPT_API_KEY } from '../variables'
import Recipe_Json from "../model/recipe.json";
import { Recipe, RecipePreview } from "../model/recipe";
import OpenAI from "openai";
import { useRecipeStore } from '../stores/recipe';
import { LayoutOptions } from '../utils';
import { useStopwatchStore } from '../stores/stopwatch';

const openai = new OpenAI({ 
    apiKey: CHATGPT_API_KEY,
    dangerouslyAllowBrowser: true,
});

export const PROMPT_HEADER = `You are a chef in a restaurant. All your knowledge revolves around cooking. You know substitutes for any ingredient and you know how to cook any dish. You are only using european measures. Any american measure you see will be converted to european measures. You only provide valid json objects, no additional text. This is the JSON format: ${JSON.stringify(Recipe_Json)}. Do not add any new fields.`

function addPromptsToSessionCache(prompt : string) {
  // Get the current date and time
  const now = new Date();
  const timestamp = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;

  const recipeStore = useRecipeStore();
  const layoutMode = recipeStore.layoutMode;
  const userName = localStorage.getItem('current_user') || 'User';

  // Format the log message
  const logMessage = `${timestamp} [${userName}] [${LayoutOptions[layoutMode]}]: ${prompt}\n`;

  // Append the log message to the session storage
  const logCache = localStorage.getItem('log_cache') || '';
  localStorage.setItem('log_cache', logCache + logMessage);
}

export async function chatGptWebSearch(query:string) {
  const { pauseTimer, startTimer } = useStopwatchStore();

  // Pause timer as we are waiting for the response.
  pauseTimer();

  let finalPrompt = `Chef, I need a recipe that best fits this description: ${encodeURIComponent(query)}. Please do not provide any additional text, only the recipe as Json.`
  
  addPromptsToSessionCache(query);

  const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system", 
          content: PROMPT_HEADER
        },
        { 
          role: "user", 
          content: finalPrompt 
        }], 
      model: "gpt-3.5-turbo",
      response_format: {"type": "json_object"}
    });

  const recipeStore = useRecipeStore();
  console.log(completion.choices[0].message.content);
  recipeStore.recipe = Recipe.fromJSON(completion.choices[0].message.content);

  // Resume timer as we have received the response.
  startTimer();
}

export async function changeRecipe(query:string, basicMode:boolean) {
  const { pauseTimer, startTimer } = useStopwatchStore();

  // Pause timer as we are waiting for the response.
  pauseTimer();

  let recipeStore = useRecipeStore();
  if (recipeStore.recipe == null) {
    return;
  }

  let finalPrompt = `Given this recipe: '${recipeStore.recipe.toJSON()}' adjust the recipe to meet the specific requirements as described: '${query}'. If you change an ingredient, be sure to also change affected steps. Only provide the changed fields of the recipe. If an ingredient needs to be removed, add a "remove" field to the ingredient.`;

  addPromptsToSessionCache(query);

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system", 
        content: PROMPT_HEADER 
      },
      { 
        role: "user", 
        content: finalPrompt 
      }], 
      model: "gpt-3.5-turbo",
      response_format: {"type": "json_object"}
  });
  let answer = completion.choices[0].message.content
  if (answer == null || answer == "") {
    return;
  }
  console.log(answer);
  recipeStore.recipe.editRecipeAspects(answer);

  // Resume timer as we have received the response.
  startTimer();
}

export async function changeIngredientForRecipe(query:string) {
  const { pauseTimer, startTimer } = useStopwatchStore();

  // Pause timer as we are waiting for the response.
  pauseTimer();

  let recipeStore = useRecipeStore();
  if (recipeStore.recipe == null) {
    return;
  }

  let ingredientsToChange = recipeStore.getSelectedIngredientsAsString();
  let finalPrompt = `Chef, I want to cook the following dish: ${recipeStore.recipe.toJSON()}. We need to change it according to fit this condition: ${query}.${ingredientsToChange.trim() == "" ? "" : ` It affects only these ingredients: ${ingredientsToChange}.`} Please find a solution for this recipe and change any affected steps. Make sure to include the appropriate ingredient names based on the specified condition, if needed. If an ingredient needs to be removed, add a remove key to the json. Please only provided the changed parts of the recipe. We are counting on your chef!`
  console.log(finalPrompt);

  addPromptsToSessionCache(query);

  const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system", 
          content: PROMPT_HEADER 
        },
        { 
          role: "user", 
          content: finalPrompt 
        }], 
      model: "gpt-3.5-turbo",
      response_format: {"type": "json_object"}
  });
  let answer = completion.choices[0].message.content
  if (answer == null || answer == "") {
    return;
  }
  console.log(answer);
  recipeStore.recipe.editRecipeAspects(answer);

  // Resume timer as we have received the response.
  startTimer();
}

export async function removeIngredientForRecipe(ingredient:string) {
  const { pauseTimer, startTimer } = useStopwatchStore();

  // Pause timer as we are waiting for the response.
  pauseTimer();

  let recipeStore = useRecipeStore();
  if (recipeStore.recipe == null) {
    return;
  }

  let finalPrompt = `Chef, I want to cook the following dish: ${recipeStore.recipe.toJSON()}. We need to remove the following ingredient: ${ingredient}. To remove the ingredient, simply add a 'remove' field to the affected ingredient. Change any affected steps. Only provide the changed parts of the recipe.`
  console.log(finalPrompt);

  const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system", 
          content: PROMPT_HEADER 
        },
        { 
          role: "user", 
          content: finalPrompt 
        }], 
      model: "gpt-3.5-turbo",
      response_format: {"type": "json_object"}
  });
  let answer = completion.choices[0].message.content
  if (answer == null || answer == "") {
    return;
  }
  console.log(answer);
  recipeStore.recipe.editRecipeAspects(answer);

  // Resume timer as we have received the response.
  startTimer();
}

export async function changeIngredientsForRecipe(query:string) {
  const { pauseTimer, startTimer } = useStopwatchStore();

  // Pause timer as we are waiting for the response.
  pauseTimer();

  let recipeStore = useRecipeStore();
  if (recipeStore.recipe == null) {
    return;
  }

  let finalPrompt = `Chef, I want to prepare the following dish: ${recipeStore.recipe.toMinimizedJSON()}. But the guest has the following problem: ${query}. Please find fitting alternativ ingredients to combat this problem and change any affected steps. Don't forget to include their previous id. Please only provided the changed pieces of the recipe. Do not change the any json key names of the recipe and do not introduce new fields. We are counting on your chef!`
  
  addPromptsToSessionCache(query);
  
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system", 
        content: PROMPT_HEADER 
      },
      { 
        role: "user", 
        content: finalPrompt 
      }], 
      model: "gpt-3.5-turbo",
      response_format: {"type": "json_object"}
  });
  let answer = completion.choices[0].message.content
  if (answer == null || answer == "") {
    return;
  }
  recipeStore.recipe.editRecipeAspects(answer);

  // Resume timer as we have received the response.
  startTimer();
}

export async function changeStepForRecipe(query:string) {
  const { pauseTimer, startTimer } = useStopwatchStore();

  // Pause timer as we are waiting for the response.
  pauseTimer();

  let recipeStore = useRecipeStore();
  if (recipeStore.recipe == null) {
    return;
  }

  let finalPrompt = `Chef, I want to cook the following dish: ${recipeStore.recipe.toJSON()}. We need to change it to fit this condition: ${query}. It affects only these steps: ${recipeStore.getSelectedStepsAsString()}. Please find a solution for this recipe and change any affected ingredients. Please only provide the changed parts of the recipe.`
  
  addPromptsToSessionCache(query);
  
  const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system", 
          content: PROMPT_HEADER 
        },
        { 
          role: "user", 
          content: finalPrompt 
        }], 
      model: "gpt-3.5-turbo",
      response_format: {"type": "json_object"}
  });
  
  console.log(completion.choices[0].message.content);
  recipeStore.recipe.editRecipeAspects(completion.choices[0].message.content);

  // Resume timer as we have received the response.
  startTimer();
}

export async function changeStepsForRecipe(query:string) {
  const { pauseTimer, startTimer } = useStopwatchStore();

  // Pause timer as we are waiting for the response.
  pauseTimer();

  let recipeStore = useRecipeStore();
  if (recipeStore.recipe == null) {
    return;
  }

  let finalPrompt = `I have the following recipe: ${recipeStore.recipe.toJSON()}. I'd like to implement the following thing relating the steps: ${query}. Please change the recipe accordinly to the new changes. Keep the order of the steps in tact. Alter any additional affected steps and ingredients if necessary.`
  
  addPromptsToSessionCache(query);

  const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system", 
          content: PROMPT_HEADER 
        },
        { 
          role: "user", 
          content: finalPrompt 
        }], 
      model: "gpt-3.5-turbo",
      response_format: {"type": "json_object"}
  });
  
  console.log(completion.choices[0].message.content);
  recipeStore.recipe.editRecipeAspects(completion.choices[0].message.content);

  // Resume timer as we have received the response.
  startTimer();
}

export async function removeStepFromRecipe(stepId:string) {
  const { pauseTimer, startTimer } = useStopwatchStore();

  // Pause timer as we are waiting for the response.
  pauseTimer();

  let recipeStore = useRecipeStore();
  if (recipeStore.recipe == null) {
    return;
  }

  let finalPrompt = `Chef, I want to cook the following dish: ${recipeStore.recipe.toJSON()}. We need to remove the step with the following id: ${stepId}. To remove the step, simply add a 'remove' field to the affected step. Remove any affected ingredients by setting a 'remove' field. Only provide the changed parts of the recipe.`
  console.log(finalPrompt);
  const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system", 
          content: PROMPT_HEADER 
        },
        { 
          role: "user", 
          content: finalPrompt 
        }], 
      model: "gpt-3.5-turbo",
      response_format: {"type": "json_object"}
  });
  let answer = completion.choices[0].message.content
  if (answer == null || answer == "") {
    return;
  }
  console.log(answer);
  recipeStore.recipe.editRecipeAspects(answer);

  // Resume timer as we have received the response.
  startTimer();
}

let ingredientListCache : string[] = [];

export async function buildRecipeFromIngredientList(query:string[]) {
  const { pauseTimer, startTimer } = useStopwatchStore();

  // Pause timer as we are waiting for the response.
  pauseTimer();

  let finalPrompt = `Hey chef, I have the following ingredients: ${query.join(", ")}. I need a recipe that incorporates these ingredients. You are allowed to add more ingredients. Please do not provide any additional text, only the recipe as Json.`
  ingredientListCache = query;

  addPromptsToSessionCache(query.join(", "));
  
  const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system", 
          content: PROMPT_HEADER 
        },
        { 
          role: "user", 
          content: finalPrompt 
        }], 
      model: "gpt-3.5-turbo",
      response_format: {"type": "json_object"}
  });

  const recipeStore = useRecipeStore();
  recipeStore.recipe = Recipe.fromJSON(completion.choices[0].message.content);

  // Resume timer as we have received the response.
  startTimer();
}

export async function buildRecipesFromIngredientList(query:string[]) {
  const { pauseTimer, startTimer } = useStopwatchStore();

  // Pause timer as we are waiting for the response.
  pauseTimer();

  let finalPrompt = `Hey chef, I have the following ingredients: ${query.join(", ")}. Please provide three recipes. If you can't find three, provide two recipes. `
  ingredientListCache = query;

  addPromptsToSessionCache(query.join(", "));
  
  const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system", 
          content: PROMPT_HEADER 
        },
        { 
          role: "user", 
          content: finalPrompt 
        }], 
      model: "gpt-3.5-turbo",
      response_format: {"type": "json_object"}
  });

  const recipeStore = useRecipeStore();
  recipeStore.possibleRecipes = RecipePreview.multipleFromJSON(completion.choices[0].message.content);

  // Resume timer as we have received the response.
  startTimer();
}

export async function rebuildRecipesFromCache() {
  const { pauseTimer, startTimer } = useStopwatchStore();

  // Pause timer as we are waiting for the response.
  pauseTimer();

  let finalPrompt = `Hey chef, I have the following ingredients: ${ingredientListCache.join(", ")}. Please provide three recipes. If you can't find three, provide two recipes.`

  addPromptsToSessionCache(`Reloading recipes with: ${ingredientListCache.join(", ")}`);
  
  const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system", 
          content: PROMPT_HEADER 
        },
        { 
          role: "user", 
          content: finalPrompt 
        }], 
      model: "gpt-3.5-turbo",
      response_format: {"type": "json_object"}
  });

  const recipeStore = useRecipeStore();
  recipeStore.possibleRecipes = RecipePreview.multipleFromJSON(completion.choices[0].message.content);

  // Resume timer as we have received the response.
  startTimer();
}

export async function buildRecipeFromIngredientListAndPreferences(query:string) {
  const { pauseTimer, startTimer } = useStopwatchStore();

  // Pause timer as we are waiting for the response.
  pauseTimer();

  let finalPrompt = `Hey chef, I have the following ingredients and preferences: ${query}. Please provide me a recipe that incorporates these ingredients and follows these preferences. Please do not provide any additional text, only the recipe as Json.`
  
  addPromptsToSessionCache(query);
  const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system", 
          content: PROMPT_HEADER 
        },
        { 
          role: "user", 
          content: finalPrompt 
        }], 
      model: "gpt-3.5-turbo",
      response_format: {"type": "json_object"}
  });

  console.log(completion.choices[0].message.content);
  const recipeStore = useRecipeStore();
  recipeStore.recipe = Recipe.fromJSON(completion.choices[0].message.content);

  // Resume timer as we have received the response.
  startTimer();
}

export async function buildRecipesFromIngredientListAndPreferences(query:string) {
  const { pauseTimer, startTimer } = useStopwatchStore();

  // Pause timer as we are waiting for the response.
  pauseTimer();

  let finalPrompt = `Hey chef, I have the following ingredients and preferences: ${query}. Provide three unique recipes based on these. For each recipe, fill in the following fields: id, name, description, duration_in_minutes, difficulty, nationality. Leave the rest of the fields blank. Do not provide detailed steps or ingredients. Each recipe has to be distinctly different from the others in terms of flavor, cuisine, or preparation method. Wrap all recipes in a JSON array.`
  
  addPromptsToSessionCache(query);
  const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system", 
          content: PROMPT_HEADER 
        },
        { 
          role: "user", 
          content: finalPrompt 
        }], 
      model: "gpt-3.5-turbo",
      response_format: {"type": "json_object"}
  });

  console.log(completion.choices[0].message.content);
  const recipeStore = useRecipeStore();
  recipeStore.possibleRecipes = RecipePreview.multipleFromJSON(completion.choices[0].message.content);

  // Resume timer as we have received the response.
  startTimer();
}

export async function fillMissingFieldsForRecipe(recipe:RecipePreview) {
  const { pauseTimer, startTimer } = useStopwatchStore();

  // Pause timer as we are waiting for the response.
  pauseTimer();

  let finalPrompt = `Hey chef, I have the following recipe preview: ${recipe.toJSON()}. Please fill in the missing fields. Don't forget to fill in steps and ingredients. Here as list of ingredients that was used to generate the recipe: ${ingredientListCache.join(", ")}. Feel free to add any additional ingredients that you think would fit the recipe.`
  const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system", 
          content: PROMPT_HEADER 
        },
        { 
          role: "user", 
          content: finalPrompt 
        }], 
      model: "gpt-3.5-turbo",
      response_format: {"type": "json_object"}
  });

  console.log(completion.choices[0].message.content);
  const recipeStore = useRecipeStore();
  recipeStore.recipe = Recipe.fromJSON(completion.choices[0].message.content);

  // Resume timer as we have received the response.
  startTimer();
}

export async function generateRecipeWithPreferences() {
  const { pauseTimer, startTimer } = useStopwatchStore();

  // Pause timer as we are waiting for the response.
  pauseTimer();

  let recipeStore = useRecipeStore();
  let finalPrompt = "";
  addPromptsToSessionCache(recipeStore.recipeNameBuffer);
  if (recipeStore.recipeIngredientsBuffer != "") {
    finalPrompt = finalPrompt + `Chef, we need to find a recipe that contains the following ingredients: ${recipeStore.recipeIngredientsBuffer}. Feel free to add any additional ingredients that you think would fit the recipe.`;
    addPromptsToSessionCache(recipeStore.recipeIngredientsBuffer);
  }
  else if (recipeStore.recipeNameBuffer != "") {
    finalPrompt = finalPrompt + `Chef, we need a recipe with this name: ${recipeStore.recipeNameBuffer}.`;
    addPromptsToSessionCache(recipeStore.recipeNameBuffer);
  }
  finalPrompt = finalPrompt + ` All ingredients must under all circumstances follow these categories: ${recipeStore.getCategoryPreferencesAsString()}. Make sure to include the appropriate ingredient names based on the specified categories.`;
  finalPrompt = finalPrompt + ` We also need to follow preferences: ${convertPreferencesToString(recipeStore.sliderPreferences)}. Be sure to adjust existing or add new ingredients and steps to fit these conditions, if needed.`;
  finalPrompt = finalPrompt + ` Please do not provide any additional text, only the recipe as Json.`

  addPromptsToSessionCache(`Categories: ${recipeStore.getCategoryPreferencesAsString()} Preferences: ${convertPreferencesToString(recipeStore.sliderPreferences)}`);
  const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system", 
          content: PROMPT_HEADER 
        },
        { 
          role: "user", 
          content: finalPrompt 
        }],
      model: "gpt-3.5-turbo",
      response_format: {"type": "json_object"}
  });
  
  console.log(completion.choices[0].message.content);
  recipeStore.recipe = Recipe.fromJSON(completion.choices[0].message.content);

  // Reset recipe buffers.
  recipeStore.recipeIngredientsBuffer = "";
  recipeStore.recipeNameBuffer = "";
  recipeStore.resetCategoryPreferences();
  recipeStore.resetSliderPreferences();
  // Resume timer as we have received the response.
  startTimer();
}

function convertPreferencesToString(preferences : Array<{ minName: string, maxName: string, value: number }>) {
  let result = "";
  preferences.map((preference) => {
    if (preference.value === 0) {
      return;
    }
    result = result + mapPreferenceToDescription(preference.value, preference.minName, preference.maxName) + ", ";
  });

  if (result.length > 0) {
    // Remove the last two characters
    result = result.substring(0, result.length - 2);
  }
  return result;
}

function mapPreferenceToDescription(value: number, categoryA: string, categoryB: string): string {
  if (value < -0.75) return `Strongly prefer ${categoryA} over ${categoryB}`;
  if (value < -0.5) return `Prefer ${categoryA} over ${categoryB}`;
  if (value < -0.25) return `Slightly prefer ${categoryA} over ${categoryB}`;
  if (value < 0) return `Neutral, with a slight leaning towards ${categoryA}`;
  if (value <= 0.25) return `Neutral, with a slight leaning towards ${categoryB}`;
  if (value <= 0.5) return `Slightly prefer ${categoryB} over ${categoryA}`;
  if (value <= 0.75) return `Prefer ${categoryB} over ${categoryA}`;
  return `Strongly prefer ${categoryB} over ${categoryA}`;
}

function parseIngredient(value : string) {
  const match = value.match(/(\d+)\s*(\w*)\s*(.+)/);
  let amount, measurement, name;

  if (match) {
      amount = parseInt(match[1], 10);
      measurement = match[2] || 'unit';
      name = match[3];
  }

  return { amount, measurement, name };
}

export async function validateRecipe() {
  const { pauseTimer, startTimer } = useStopwatchStore();

  // Pause timer as we are waiting for the response.
  pauseTimer();

  let recipeStore = useRecipeStore();
  if (recipeStore.recipe == null) {
    return;
  }

  let finalPrompt = `I have the following recipe: ${recipeStore.recipe.toJSON()}. `;
  // Change servings.
  let servings = recipeStore.getUnresolvedServingValidation();
  if (servings != 0 && servings !== recipeStore.recipe.servings) {
    finalPrompt = finalPrompt + `I want to change the servings to ${servings}. Please adjust every ingredient accordingly. Only provide the changed measurements and ids of the ingredients. Don't forget to update the servings field in the recipe json as well.`
  }
  // Add ingredient.
  if (recipeStore.validationAddIngredient !== "") {
    finalPrompt = finalPrompt + `I want to add the following ingredient: ${recipeStore.validationAddIngredient}. `;
  }
  // Change ingredients.
  if (recipeStore.pendingValidationIngredientsChanges) {
    finalPrompt = finalPrompt + "I also would like to change the following ingredients: ";
    for (const [key, value] of recipeStore.getUnresolvedIngredientsValidation()) {
      let {amount, measurement, name} = parseIngredient(value);
      finalPrompt = finalPrompt + `Ingredient with id: ${key}. Amount: ${amount}. Measurement: ${measurement}. Name: ${name}.`;
    }
  }
  // Change steps.
  if (recipeStore.pendingValidationStepsChanges) {
    finalPrompt = finalPrompt + "I would like to change the following steps: ";
    for (const [key, value] of recipeStore.getUnresolvedStepsValidation()) {
      finalPrompt = finalPrompt + `Step with id: ${key}. Step: ${value}.`;
    }
  }
  // Tell LLM to validate.
  finalPrompt = finalPrompt + `Please validate the recipe. Change any affected ingredients or steps. If a ingredient is added or changed, be sure to change the corresponsing step. Only provide the changed parts of the recipe.`;

  console.log(finalPrompt);

  const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system", 
          content: PROMPT_HEADER 
        },
        { 
          role: "user", 
          content: finalPrompt 
        }],
      model: "gpt-3.5-turbo",
      response_format: {"type": "json_object"}
  });
  
  recipeStore.resetValidationChanges();
  console.log(completion.choices[0].message.content);
  recipeStore.recipe.editRecipeAspects(completion.choices[0].message.content);

  // Resume timer as we have received the response.
  startTimer();
}

export async function changeServings(servings:number) {
  const { pauseTimer, startTimer } = useStopwatchStore();

  // Pause timer as we are waiting for the response.
  pauseTimer();

  let recipeStore = useRecipeStore();
  if (recipeStore.recipe == null) {
    return;
  }

  let finalPrompt = `I have the following recipe: ${recipeStore.recipe.toJSON()}. I want to change the servings to ${servings}. Please adjust every ingredient accordingly. Only provide the changed measurements and ids of the ingredients. Don't forget to update the servings field in the recipe json as well.`

  const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system", 
          content: PROMPT_HEADER 
        },
        { 
          role: "user", 
          content: finalPrompt 
        }], 
      model: "gpt-3.5-turbo",
      response_format: {"type": "json_object"}
  });
  let answer = completion.choices[0].message.content
  if (answer == null || answer == "") {
    return;
  }

  console.log(answer);
  recipeStore.recipe.editRecipeAspects(answer);
  // Resume timer as we have received the response.
  startTimer();
}

export async function changeMinutes(reduceTime:boolean = false) {
  const { pauseTimer, startTimer } = useStopwatchStore();

  // Pause timer as we are waiting for the response.
  pauseTimer();

  let recipeStore = useRecipeStore();
  if (recipeStore.recipe == null) {
    return;
  }

  let finalPrompt = `I have the following recipe: ${recipeStore.recipe.toJSON()}. I want to ${reduceTime ? "reduce" : "increase"} the cooking time. Please adjust steps accordingly. Only provide the changed steps. Don't forget to update the duration_in_minutes field in the recipe json as well.`
  console.log(finalPrompt);
  const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system", 
          content: PROMPT_HEADER 
        },
        { 
          role: "user", 
          content: finalPrompt 
        }], 
      model: "gpt-3.5-turbo",
      response_format: {"type": "json_object"}
  });
  let answer = completion.choices[0].message.content
  if (answer == null || answer == "") {
    return;
  }
  console.log(answer);
  recipeStore.recipe.editRecipeAspects(answer);
  console.log(recipeStore.recipe);
  // Resume timer as we have received the response.
  startTimer();
}