<script setup lang="ts">
import { onMounted, ref, watch, watchEffect } from 'vue';
import { useRecipeStore } from '../stores/recipe';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../tailwind.config.js';

const fullConfig = resolveConfig(tailwindConfig);

const MIN_VALUE : number = -1;
const MAX_VALUE : number = 1;
const STEP : number = 0.01;
const DEFAULT_VALUE : number = (MIN_VALUE + MAX_VALUE) / 2;

const props = defineProps({
    minName: {
        type: String,
        required: true,
    },
    maxName: {
        type: String,
        required: true,
    },
});

const sliderRef = ref<HTMLInputElement | null>(null);
const recipeStore = useRecipeStore();

const currentSliderId = recipeStore.sliderId++;

function onSliderDoubleClick(): void {
    if (sliderRef.value == null) {
        return;
    }
    sliderRef.value.value = ((MIN_VALUE + MAX_VALUE) / 2).toString();
    updateSliderColorAndBoldness(null);
}

let isLeftBold = ref(false);
let isRightBold = ref(false);

function updateSliderColorAndBoldness(event: Event | null) {
  if (sliderRef.value == null) {
    return;
  }

  const value = parseFloat(sliderRef.value.value);

  isLeftBold.value = value < 0;
  isRightBold.value = value > 0;
}

const lastTap = ref(0);

function onTouchEnd(event: TouchEvent): void {
    if (sliderRef.value == null) {
        return;
    }

    const currentTime = Date.now();
    const tapLength = currentTime - lastTap.value;
    
    // Threshold time between taps in milliseconds (e.g., 300ms)
    if (tapLength < 400 && tapLength > 0) {
      // Detected double tap
      sliderRef.value.value = ((MIN_VALUE + MAX_VALUE) / 2).toString();
      updateSliderColorAndBoldness(null);
    }
    
    lastTap.value = currentTime;
}

function onMouseUp(event:Event): void {
    if (sliderRef.value == null) {
        return;
    }
    recipeStore.setSliderPreferences(currentSliderId, props.minName, props.maxName, parseFloat(sliderRef.value.value));
}

onMounted(() => {
    recipeStore.setSliderPreferences(currentSliderId, props.minName, props.maxName, DEFAULT_VALUE);
    updateSliderColorAndBoldness(null);
});

</script>

<template>
  <div class="w-full mb-4">
    <div class="flex flex-row justify-between items-center text-sm md:text-base lg:text-lg gap-1">
      <p :class="{'font-bold': isLeftBold}" class="w-1/5 text-left">{{ props.minName }}</p>
      <input type="range" :min="MIN_VALUE" :max="MAX_VALUE" :step="STEP" :value="DEFAULT_VALUE" ref="sliderRef" class="slider w-3/5 h-4" id="myRange" @mouseup="onMouseUp" @dblclick="onSliderDoubleClick" @touchend="onTouchEnd" @input="updateSliderColorAndBoldness">
      <p :class="{'font-bold': isRightBold}" class="w-1/5 text-right md:overflow-hidden md:whitespace-nowrap">{{ props.maxName }}</p>
    </div>
  </div>
</template>

<style scoped>

/* The slider itself */
.slider {
  -webkit-appearance: none;
  appearance: none;
  border-radius: 5px;   
  background: theme('colors.accent');
  outline: none;
  opacity: 1;
  -webkit-transition: .2s;
  transition: opacity .2s;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  box-shadow: none;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: theme('colors.secondary');
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: theme('colors.secondary');
  cursor: pointer;
}
</style>