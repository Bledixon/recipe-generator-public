<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRecipeStore } from '../stores/recipe';
import IconAccountBox from '~icons/mdi/note-edit'

const props = defineProps({
    id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    unit: {
        type: String,
        required: true,
    },
    clickable: {
        type: Boolean,
        required: false,
    },
    useInputFields: {
        type: Boolean,
        required: false,
    },
});

const editMode = ref<boolean>(false);

const recipeStore = useRecipeStore();

function onClick(name: string) {
    if (!props.clickable) {
        return;
    }
    editMode.value = !editMode.value;
    recipeStore.setSelectedIngredients(name, !editMode.value);
}

let oldName = props.name;
let oldMeasures = props.amount + ' ' + props.unit;

let nameHasChanged = computed(() => {
    return nameModel.value.toLowerCase() !== oldName.toLowerCase();
});

let measuresHaveChanged = computed(() => {
    return measuresModel.value.toLowerCase() !== oldMeasures.toLowerCase();
});

const nameModel = ref<string>(oldName);
const measuresModel = ref<string>(oldMeasures);

watch(nameModel, (newN) => {
    if (newN.toLowerCase() != oldName.toLowerCase()) {
        recipeStore.setUnresolvedIngredientsValidation(props.id, measuresModel.value + " " + newN, false);
        return;
    }
    recipeStore.setUnresolvedIngredientsValidation(props.id, "", true);
});

watch(measuresModel, (newM) => {
    if (newM.toLowerCase() != oldMeasures.toLowerCase()) {
        recipeStore.setUnresolvedIngredientsValidation(props.id, newM + " " + nameModel.value, false);
        return;
    }
    recipeStore.setUnresolvedIngredientsValidation(props.id, "", true);
});

const emit = defineEmits<{
    (e: 'removeIngredient', name: string): void
}>();

const removeIngredient = async (name: string) => {
    emit("removeIngredient", name);
}

</script>

<template>
<div class="flex w-full py-1 justify-center gap-2">
    <div v-if="useInputFields" class="flex flex-row gap-2 justify-center">
        <input :class="{'bg-accent text-[black]' : measuresHaveChanged, 'bg-secondary text-primary' : !measuresHaveChanged}" class="w-1/4 md:w-2/6 p-2 rounded-lg text-left" placeholder="Type your text here.." v-model="measuresModel" />
        <input :class="{'bg-accent text-[black]' : nameHasChanged, 'bg-secondary text-primary' : !nameHasChanged}" class="w-3/4 md:w-3/6 p-2 rounded-lg text-lef" placeholder="Type your text here.." v-model="nameModel" />
        <button @click="removeIngredient(name)">X</button>
    </div>
    <div v-else :onclick="() => onClick(name)" :class="{'bg-accent text-[black]' : editMode, 'bg-secondary text-primary' : !editMode, 'cursor-pointer' : clickable}" class="flex flex-row justify-between w-full text-left p-2 items-center rounded-lg">
        <div>
            {{ amount }} {{ unit }} {{ name }}
        </div>
    </div>
</div>
</template>

<style scoped>
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>