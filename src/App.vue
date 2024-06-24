<script setup lang="ts">
import { ModalsContainer } from 'vue-final-modal'
import HomeButton from './components/HomeButton.vue'
</script>

<template>
   <home-button/>
   <router-view/>
   <ModalsContainer />
</template>

<style scoped></style>
