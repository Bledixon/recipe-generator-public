<script setup lang="ts">
import { VueFinalModal } from 'vue-final-modal'
import CustomDropdown from './CustomDropdown.vue';
import { LayoutOptions } from '../utils';
import { useRecipeStore } from '../stores/recipe';
import { ref, watch } from 'vue';

defineProps<{
title?: string
}>()

const emit = defineEmits<{
(e: 'confirm'): void
}>()

const recipeStore = useRecipeStore();


function downloadAndResetLogCache() {
  const logCache = localStorage.getItem('log_cache') || '';
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(logCache));
  element.setAttribute('download', 'log.txt');
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  localStorage.removeItem('log_cache');
}

const currentUser = ref<string>(localStorage.getItem('current_user') || 'User');

watch(currentUser, (newUser) => {
  localStorage.setItem('current_user', newUser);
});
</script>

<template>
    <VueFinalModal
      content-class="absolute bottom-0 w-full p-4 bg-primary dark:bg-gray-900 min-h-[18rem]"
      swipe-to-close="down"
      content-transition="vfm-slide-down"
      overlay-transition="vfm-fade"
    >
      <h1 class="text-3xl font-bold select-none">
        {{ title }}
      </h1>
      <div class="text-lg mb-4 select-none">Swipe down to close the modal</div>
      <custom-dropdown class="font-bold" name="layout" id="layoutDropdown" label-text="Interface Mode" :options="LayoutOptions" :change-value="recipeStore.changeLayoutMode"></custom-dropdown>
      <div class="flex flex-col">
        <label class="font-bold" for="userInput">Current User</label>
        <input class="w-1/2 text-secondary font-bold p-1 pl-4 rounded-md border-2 border-secondary" style="background-color: transparent;" name="userInput" v-model="currentUser" >
      </div>
      <button :onclick="downloadAndResetLogCache" class=" bg-secondary text-primary mt-2">Download Logs</button>
      <slot />
    </VueFinalModal>
  </template>