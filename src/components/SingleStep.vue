<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { removeStepFromRecipe } from '../api/chatGptSearch';
import { useRecipeStore } from '../stores/recipe';

const props = defineProps({
    id: {
        type: String,
        required: true,
    },
    index: {
        type: Number,
        required: true,
    },
    description: {
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

const description = ref<string>(props.description);
let oldDescription = description.value;

watch(() => props.description, (newDescription) => {
  description.value = newDescription;
  oldDescription = newDescription;
})

const recipeStore = useRecipeStore();

function onClick(stepId: string) {
    if (!props.clickable) {
        return;
    }
    editMode.value = !editMode.value;
    recipeStore.setSelectedSteps(stepId, !editMode.value);
}

const editMode = ref<boolean>(false);

watch(description, (newD) => {
    if (newD.toLowerCase() !== oldDescription.toLowerCase()) {
        recipeStore.setUnresolvedStepsValidation(props.id, newD, false);
        return;
    }
    recipeStore.setUnresolvedStepsValidation(props.id, "", true);
});

let stepHasChanged = computed(() => {
    return description.value.toLowerCase() !== oldDescription.toLowerCase();
});

const textareaRef = ref<HTMLTextAreaElement | null>(null);

const autoGrow = () => {
    nextTick(() => {
        if (textareaRef.value) {
            textareaRef.value.style.height = 'auto';
            textareaRef.value.style.height = `${textareaRef.value.scrollHeight}px`;
        }
    });
};

onMounted(() => {
    autoGrow();
});


const emit = defineEmits<{
    (e: 'removeStep', id: string): void
}>();

const removeStep = async (id: string) => {
    emit("removeStep", id);
}
</script>

<template>
    <div class="flex flex-col w-full items-center gap-1 text-primary font-medium my-1">
        <div class="flex flex-row gap-2 w-full text-justify">
            <div :onclick="() => onClick(id)" :class="{'bg-accent text-[black]' : editMode, 'bg-secondary text-primary' : !editMode, 'cursor-pointer' : clickable}" class="w-1/6 rounded-md flex items-center justify-center">
                <p>{{ props.index+1 }}</p>
            </div>
            <div v-if="useInputFields" class="flex flex-row w-5/6 rounded-md justify-between items-center gap-2">
                <textarea ref="textareaRef" @input="autoGrow" :class="{'bg-accent text-[black]' : stepHasChanged, 'bg-secondary text-primary' : !stepHasChanged}" class="flex flex-row h-full w-5/6 p-4 rounded-md justify-between items-center gap-2" v-model="description" />
                <button :onclick="() => removeStep(props.id)" class="h-full">X</button>
            </div>
            <div v-else :onclick="() => onClick(id)" :class="{'bg-accent text-[black]' : editMode, 'bg-secondary text-primary' : !editMode, 'cursor-pointer' : clickable}" class="flex flex-row w-5/6 rounded-md p-4 justify-between items-center gap-2">
                <div>
                    <p>{{ description }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>