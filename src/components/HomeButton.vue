<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { Router, useRouter } from 'vue-router';
import MdiHome from '~icons/mdi/home';

let router:Router | null = null;

onBeforeMount(() => {
    router = useRouter();
});
</script>

<template>
    <router-link v-if="router?.currentRoute.value.path !== '/'" to="/" class="home-button">
        <MdiHome class="home-icon text-secondary"/>
    </router-link>
</template>


<style scoped>
.home-button {
  position: absolute;
  top: 1.2rem;
  left: 1.2rem;
}

.home-icon {
  width: 48px;
  height: 48px;
}
</style>