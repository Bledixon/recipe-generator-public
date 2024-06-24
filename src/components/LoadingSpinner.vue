<script setup lang="ts">
import MdiFishFood from '~icons/mdi/fish-food';
</script>

<template>
    <svg class="animate-bob h-12 w-12 mt-2" viewBox="0 0 24 24">
        <MdiFishFood />
    </svg>
</template>

<style scoped>
@keyframes bob {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
}

.animate-bob {
  animation: bob 1s ease-in-out infinite;
}
</style>