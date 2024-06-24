<script setup lang="ts">
import { useRecipeStore } from '../stores/recipe';
import { ref, watch } from 'vue';

interface Props {
    class: string
    name: string
    id: string
    labelText: string
    options: Record<number, string>
    changeValue: (newVal: number) => void
}

const props = withDefaults(defineProps<Props>(), {
    class: '',
})

const recipeStore = useRecipeStore();
const selectModel = ref(recipeStore.layoutMode);

watch(selectModel, (newVal) => {
    if (newVal !== recipeStore.layoutMode) {
        props.changeValue(newVal);
    }
})
</script>

<template>
    <div class="flex flex-col">
    <label class="text-xl font-bold" :for="props.id">{{ labelText }}</label>
    <select style="-webkit-appearance: none;" :class="`${props.class} w-3/4 h-8 pl-4 border-2 border-secondary bg-primary bg-opacity-0`" v-model="selectModel" :name="props.name" :id="props.id">
        <option v-for="(value, key) in props.options" :value="key">{{ value }}</option>
    </select>
</div>
</template>

<style scoped>
</style>