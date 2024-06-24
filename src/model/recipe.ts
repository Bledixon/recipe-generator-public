export class Step {
    id: string;
    description: string;

    constructor(id: string, description: string) {
        this.id = id;
        this.description = description;
    }

    /**
     * Converts a JSON string to a Step object.
     * @param json The JSON string to convert.
     * @returns Step object.
     */
    static fromJSON(json: string): Step {
        const jsonObject = JSON.parse(json);
        return new Step(jsonObject.id, jsonObject.description);
    }

    /**
     * Converts a JSON string to an array of Step objects.
     * @param json The JSON string to convert.
     * @returns Step array.
     */
    static multipleFromJSON(json: string): Step[] {
        const jsonObject = JSON.parse(json);
        return jsonObject.map((step: any) => Step.fromJSON(JSON.stringify(step)));
    }

    /**
     * Converts this object to a JSON string.
     * @returns JSON string representation of this object.
     */
    toJSON(): string {
        const obj = {
            id: this.id,
            description: this.description,
        };

        return JSON.stringify(obj);
    }

    toObj(): any {
        return {
            id: this.id,
            description: this.description,
        };
    }
}

export class Ingredient {
    id: string;
    name: string;
    nationality: string;
    amount: number;
    measurement: string;
    dietary_restrictions: string[];

    constructor(id: string, name: string, nationality: string, amount: number, measurement: string, dietary_restrictions: string[]) {
        this.id = id;
        this.name = name;
        this.nationality = nationality;
        this.amount = amount;
        this.measurement = measurement;
        this.dietary_restrictions = dietary_restrictions;
    }

    /**
     * Edits the amount of this ingredient.
     * @param newAmount New amount of this ingredient.
     */
    editAmount(newAmount: number) {
        this.amount = newAmount;
    }

    /**
     * Edits the measurement of this ingredient.
     * @param newMeasurement New measurement of this ingredient.
     */
    editMeasurement(newMeasurement: string) {
        this.measurement = newMeasurement;
    }

    /**
     * Converts a JSON string to an Ingredient object.
     * @param json The JSON string to convert.
     * @returns Ingredient object.
     */
    static fromJSON(json: string): Ingredient {
        const jsonObject = JSON.parse(json);
        return new Ingredient(
            jsonObject.id,
            jsonObject.name,
            jsonObject.nationality,
            jsonObject.amount,
            jsonObject.measurement,
            jsonObject.dietary_restrictions
        );
    }

    /**
     * Converts a JSON string to an array of Ingredient objects.
     * @param json The JSON string to convert.
     * @returns Ingredient array.
     */
    static multipleFromJSON(json: string): Ingredient[] {
        const jsonObject = JSON.parse(json);
        return jsonObject.map((ingredient: any) => Ingredient.fromJSON(JSON.stringify(ingredient)));
    }

    /**
     * Converts this object to a JSON string.
     * @returns JSON string representation of this object.
     */
    toJSON(): string {
        const obj = {
            id: this.id,
            name: this.name,
            nationality: this.nationality,
            amount: this.amount,
            measurement: this.measurement,
            dietary_restrictions: this.dietary_restrictions,
        };

        return JSON.stringify(obj);
    }

    toObj(): any {
        return {
            id: this.id,
            name: this.name,
            nationality: this.nationality,
            amount: this.amount,
            measurement: this.measurement,
            dietary_restrictions: this.dietary_restrictions,
        };
    }
}

export class Recipe {
    id: string;
    name: string;
    description: string;
    servings: number;
    duration_in_minutes: string;
    difficulty: string;
    nationality: string;
    ingredients: Ingredient[];
    steps: Step[];
    tags: string[];

    constructor(id: string, name: string, description: string, servings: number, duration_in_minutes: string, difficulty: string, nationality: string, ingredients: Ingredient[], steps: Step[], tags: string[]) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.servings = servings;
        this.duration_in_minutes = duration_in_minutes;
        this.difficulty = difficulty;
        this.nationality = nationality;
        this.ingredients = ingredients;
        this.steps = steps;
        this.tags = tags;
    }

    /**
     * Converts a JSON string to a Recipe object.
     * @param json The JSON string to convert.
     * @returns Recipe object.
     */
    static fromJSON(json: any): Recipe {
        const jsonObject = JSON.parse(json);
        return new Recipe(
            jsonObject.id,
            jsonObject.name,
            jsonObject.description,
            jsonObject.servings,
            jsonObject.duration_in_minutes,
            jsonObject.difficulty,
            jsonObject.nationality,
            jsonObject.ingredients.map((ingredient: any) => new Ingredient(
                ingredient.id,
                ingredient.name,
                ingredient.nationality,
                ingredient.amount,
                ingredient.measurement,
                ingredient.dietary_restrictions
            )),
            jsonObject.steps.map((step: any) => new Step(step.id, step.description)),
            jsonObject.tags
        );
    }

    /**
     * Converts a JSON string to an array of Recipe objects.
     * @param json The JSON string to convert.
     * @returns Recipe array.
     */
    static multipleFromJSON(json:any): Recipe[] {
        const jsonObject = JSON.parse(json);
        return jsonObject.map((recipe: any) => Recipe.fromJSON(JSON.stringify(recipe)));
    }

    /**
     * Converts this object to a JSON string.
     * @returns JSON string representation of this object.
     */
    toJSON(): string {

        const obj = {
            id: this.id,
            name: this.name,
            description: this.description,
            servings: this.servings,
            duration_in_minutes: this.duration_in_minutes,
            difficulty: this.difficulty,
            nationality: this.nationality,
            ingredients: this.ingredients.map(ingredient => ingredient.toObj()),
            steps: this.steps.map(step => step.toObj()),
            tags: this.tags,
        };
    
        return JSON.stringify(obj);
    }

    toMinimizedJSON(): string {
        const obj = {
            id: this.id,
            name: this.name,
            description: this.description,
            ingredients: this.ingredients.map(ingredient => ingredient.toObj()),
            steps: this.steps.map(step => step.toObj()),
        }

        return JSON.stringify(obj);
    }

    editRecipeAspects(jsonString: any) {
        // Parse the unescaped JSON string into a JavaScript object
        const data = JSON.parse(jsonString);

        // Handle ingredients
        if (data.ingredients) {
            data.ingredients.forEach(ingredientData => {
                if (ingredientData.remove) {
                    this.removeIngredient(ingredientData.id);
                    return;
                }
                const newIngredient = new Ingredient(
                    ingredientData.id,
                    ingredientData.name,
                    ingredientData.nationality,
                    ingredientData.amount,
                    ingredientData.measurement,
                    ingredientData.dietary_restrictions,
                );

                // Try to get index incase the ingredient already exists.
                const ingredientIndex = this.getIngredientIndex(ingredientData.id);
                if (ingredientIndex === -1) {
                    this.ingredients.push(newIngredient);
                    return;
                }
                this.editIngredient(ingredientIndex, newIngredient);
            });
        }

        // Handle steps
        if (data.steps) {
            data.steps.forEach(stepData => {
                if (stepData.remove) {
                    this.removeStep(stepData.id);
                    return;
                }
                const newStep = new Step(
                    stepData.id,
                    stepData.description
                );

                const stepIndex = this.getStepIndex(stepData.id);
                this.editStep(stepIndex, newStep);
            });
        }

        if (data.duration_in_minutes) {
            this.editDuration(data.duration_in_minutes);
        }

        if (data.servings) {
            this.editServings(data.servings);
        }
    }

    /**
     * Edits the name of this recipe.
     * @param newName New name of this recipe.
     */
    editName(newName: string) {
        this.name = newName;
    }

    /**
     * Edits the description of this recipe.
     * @param newDescription New description of this recipe.
     */
    editDescription(newDescription: string) {
        this.description = newDescription;
    }

    /**
     * Edits the servings of this recipe.
     * @param newServings New servings of this recipe.
     */
    editServings(newServings: number) {
        this.servings = newServings;
    }

    /**
     * Edits the duration of this recipe.
     * @param newDuration New duration of this recipe.
     */
    editDuration(newDuration: string) {
        this.duration_in_minutes = newDuration;
    }

    /**
     * Edits the difficulty of this recipe.
     * @param newDifficulty New difficulty of this recipe.
     */
    editDifficulty(newDifficulty: string) {
        this.difficulty = newDifficulty;
    }

    /**
     * Edits the nationality of this recipe.
     * @param newNationality New nationality of this recipe.
     */
    editNationality(newNationality: string) {
        this.nationality = newNationality;
    }

    /**
     * Edits a step of this recipe.
     * @param stepIndex Step index to edit.
     * @param newStep New step.
     */
    editStep(stepIndex: number, newStep: Step) {
        if (stepIndex >= 0 && stepIndex < this.steps.length) {
            this.steps.splice(stepIndex, 1, newStep);
        }
    }

    /**
     * Edits a ingredients of this recipe.
     * @param ingredientIndex Ingredient index to edit.
     * @param newIngredient New ingredient.
     */
    editIngredient(ingredientIndex: number, newIngredient: Ingredient) {
        if (ingredientIndex >= 0 && ingredientIndex < this.ingredients.length) {
            const oldIngredient = this.ingredients[ingredientIndex];
            let alteredIngredient = new Ingredient(
                newIngredient.id,
                newIngredient.name ?? oldIngredient.name,
                newIngredient.nationality ?? "Universal",
                newIngredient.amount ?? oldIngredient.amount,
                newIngredient.measurement,
                newIngredient.dietary_restrictions ?? oldIngredient.dietary_restrictions,
            );
            this.ingredients.splice(ingredientIndex, 1, alteredIngredient);
        }
    }

    /**
     * Remove a ingredient from this recipe.
     * @param ingredientId Ingredient to remove.
     */
    removeIngredient(ingredientId: string) {
        const ingredientIndex = this.getIngredientIndex(ingredientId);
        if (ingredientIndex !== -1) {
            this.ingredients.splice(ingredientIndex, 1);
        }
    }

    /**
     * Edits a tag of this recipe.
     * @param tagIndex Tag index to edit.
     * @param newTag New tag.
     */
    editTag(tagIndex: number, newTag: string) {
        if (tagIndex >= 0 && tagIndex < this.tags.length) {
            this.tags[tagIndex] = newTag;
        }
    }

    /**
     * Gets the index of a tag.
     * @param tag TagId to get the index of.
     * @returns Index of the tag.
     */
    getTagIndex(tag: string): number {
        return this.tags.indexOf(tag);
    }

    /**
     * Gets the index of an ingredient.
     * @param ingredientId IngredientId to get the index of.
     * @returns Index of the ingredient.
     */
    getIngredientIndex(ingredientId: string): number {
        return this.ingredients.findIndex(ingredient => ingredient.id === ingredientId);
    }

    /**
     * Checks if this recipe contains an ingredient.
     * @param ingredientName Name of the ingredient to check.
     * @returns True if this recipe contains the ingredient, false otherwise.
     */
    containsIngredient(ingredientName: string) {
        return this.ingredients.map(ingredient => ingredient.name).includes(ingredientName);
    }

    /**
     * Checks if this recipe contains an ingredient by id.
     * @param ingredientId Id of the ingredient to check.
     * @returns True if this recipe contains the ingredientId, false otherwise.
     */
    containsIngredientId(ingredientId: string) {
        return this.getIngredientIndex(ingredientId) !== -1;
    }

    /**
     * Returns the ingredient with the given id.
     * @param ingredientId Id of the ingredient to get.
     * @returns Ingredient with the given id, undefined if not found.
     */
    getIngredient(ingredientId: string): Ingredient {
        return this.ingredients[this.getIngredientIndex(ingredientId)];
    }

    /**
     * Returns the index of a step with the given id.
     * @param stepId Id of the step to get the index of.
     * @returns Index of the step with the given id, -1 if not found.
     */
    getStepIndex(stepId: string): number {
        return this.steps.findIndex(step => step.id === stepId);
    }

    /**
     * Adds new step to this recipe.
     * @param step Step to add.
     */
    addStep(step: Step) {
        this.steps.push(step);
    }

    /**
     * Removes a step from this recipe.
     * @param stepId Id of the step to remove.
     */
    removeStep(stepId: string) {
        const stepIndex = this.getStepIndex(stepId);
        if (stepIndex !== -1) {
            this.steps.splice(stepIndex, 1);
        }
    }

    /**
     * Checks if this recipe contains a step.
     * @param step Step to check.
     * @returns True if this recipe contains the step, false otherwise.
     */
    containsStep(step: Step) {
        return this.steps.map(step => step.id).includes(step.id);
    }

    /**
     * Checks if this recipe contains the stepId.
     * @param stepId StepId to check.
     * @returns True if this recipe contains the stepId, false otherwise.
     */
    containsStepId(stepId: string) {
        return this.steps.some(step => step.id == stepId);
    }

    /**
     * Returns the step with the given id.
     * @param stepId Id of the step to get.
     * @returns Step with the given id, undefined if not found.
     */
    getStep(stepId: string) {
        return this.steps[this.getStepIndex(stepId)];
    }
}

export class RecipePreview {
    id: string;
    name: string;
    description: string;
    duration_in_minutes: string;
    difficulty: string;
    nationality: string;
    tags: string[];

    constructor(id: string, name: string, description: string, duration_in_minutes: string, difficulty: string, nationality: string, tags: string[]) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.duration_in_minutes = duration_in_minutes;
        this.difficulty = difficulty;
        this.nationality = nationality;
        this.tags = tags;
    }

    /**
     * Converts a JSON string to a RecipePreview object.
     * @param json The JSON string to convert.
     * @returns RecipePreview object.
     */
    static fromJSON(json: any): RecipePreview {
        const jsonObject = JSON.parse(json);
        return new RecipePreview(
            jsonObject.id,
            jsonObject.name,
            jsonObject.description,
            jsonObject.duration_in_minutes,
            jsonObject.difficulty,
            jsonObject.nationality,
            jsonObject.tags
        );
    }

    /**
     * Converts a JSON string to an array of RecipePreview objects.
     * @param json The JSON string to convert.
     * @returns RecipePreview array.
     */
    static multipleFromJSON(json:any): RecipePreview[] {
        const jsonObject = JSON.parse(json);
        if (jsonObject.recipes) {
            return jsonObject.recipes.map((recipe: any) => RecipePreview.fromJSON(JSON.stringify(recipe)));
        }
        return jsonObject.map((recipe: any) => RecipePreview.fromJSON(JSON.stringify(recipe)));
        
    }

    /**
     * Converts this object to a JSON string.
     * @returns JSON string representation of this object.
     */
    toJSON(): string {
        const obj = {
            id: this.id,
            name: this.name,
            description: this.description,
            duration_in_minutes: this.duration_in_minutes,
            difficulty: this.difficulty,
            nationality: this.nationality,
            tags: this.tags,
        };
    
        return JSON.stringify(obj);
    }
}