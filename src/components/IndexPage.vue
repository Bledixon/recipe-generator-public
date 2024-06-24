<script setup lang="ts">
import TextContainer from "./TextContainer.vue";
import MenuRight from '~icons/mdi/wrench';
import { useModal } from 'vue-final-modal';
import ModalOptions from './ModalOptions.vue';
import { CHATGPT_API_KEY } from '../variables'
import { onMounted, ref, watch } from "vue";
import { useStopwatchStore, useTotalStopwatchStore } from "../stores/stopwatch";
import { useRecipeStore } from "../stores/recipe";
import { LayoutDefinition } from "../utils";

const { open, close } = useModal({
    component: ModalOptions,
    attrs: {
      title: 'Options',
      onConfirm() {
        close()
      },
    },
  })

const isChatMode = ref<boolean>(false);

onMounted(() => {
  const stopWatchStore = useStopwatchStore();
  stopWatchStore.resetTimer();
  const totalStopWatchStore = useTotalStopwatchStore();
  totalStopWatchStore.resetTotalTimer();
  const recpieStore = useRecipeStore();
  isChatMode.value = recpieStore.layoutMode == LayoutDefinition.CHAT;

  watch(() => recpieStore.layoutMode, (newVal) => {
    isChatMode.value = newVal == LayoutDefinition.CHAT;
  })
})
</script>

<template>
    <div class="main-grid">
        <div class="main-grid-header">
            <div class="flex flex-row justify-center w-full">
                <text-container class="text-center pl-0" title="Recipe Generator" subtitle="How do you want to cook tonight?" content="" />
                <h2 v-if="CHATGPT_API_KEY == ''">No GPT key provided. Please add one in the .env.local field.</h2>
                <div :onclick="open" class="absolute p-3 right-4 top-4 sm:right-8 sm:top-8 cursor-pointer bg-accent rounded-full">
                    <menu-right height="40px" width="40px" class="text-primary" ></menu-right>
                </div>
            </div>
        </div>
        <router-link v-if="isChatMode" to="/chat" class="main-grid-body-two bg-secondary">
            <text-container title="Chat" subtitle="You want to chat with a recipe assistant" content="" />
        </router-link>
        <router-link v-if="!isChatMode" class="main-grid-body-one bg-secondary"
            to="/byrecipe">
            <text-container title="Recipe" subtitle="You already have a recipe in mind" content="" />
        </router-link>
        <router-link v-if="!isChatMode" class="main-grid-body-two bg-tertiary"
            to="/byingredients">
            <text-container title="Ingredients" subtitle="You only have ingredience and want to produce something"
                content="" />
        </router-link>
    </div>
</template>

<style scoped></style>
