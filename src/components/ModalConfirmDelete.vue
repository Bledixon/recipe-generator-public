<script setup lang="ts">
import { VueFinalModal } from 'vue-final-modal'
import { ref } from 'vue';
import IconMdiClose from '~icons/mdi/close'

const emit = defineEmits<{
(e: 'confirm'): void
}>()

const checkboxModalRef = ref<boolean>(false);

function confirmModal(): void {
    localStorage.setItem("show_delete_modal", checkboxModalRef.value ? "false" : "true");
    emit('confirm');
}

</script>

<template>
    <VueFinalModal
      class="flex justify-center items-center"
      content-class="flex flex-col max-w-xl p-4 bg-primary rounded-lg space-y-2"
      content-transition="vfm-slide-down"
      overlay-transition="vfm-fade"
      
    >
        <h1 class="text-3xl font-bold select-none">
            Confirm Delete
        </h1>
        <div class="text-lg mb-4 select-none">Are you sure you want to delete the most recent ingredient?</div>
        <div class="flex items-center">
            <input type="checkbox" id="dismissModalCheckbox" class="" v-model="checkboxModalRef" />
            <label for="dismissModalCheckbox" class="text-lg pl-2">Don't show this again.</label>
        </div>
        <button :onclick="confirmModal">
            Confirm
        </button>
    </VueFinalModal>
  </template>

<style scoped>
.close-modal-button {
    position: absolute;
    top: 0;
    right: 0;
    padding: 0.5rem;
    background-color: transparent;
    border: none;
    cursor: pointer;
}
</style>