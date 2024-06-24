<script lang="ts" setup>
import { onUpdated, ref } from 'vue';
import { useChatStore, type Message } from '../stores/chatStore';
import { useRecipeStore } from '../stores/recipe';
import { LayoutOptions } from '../utils';
import { useStopwatchStore, useTotalStopwatchStore } from '../stores/stopwatch';
import { formatTimeInMinutesAndSeconds } from '../utils/Utils';

const store = useChatStore();
const newMessage = ref<string>('');
const chatContainer = ref<HTMLElement | null>(null);
const isGeneratingMessage = ref<boolean>(false);
const taskIsFinished = ref<boolean>(false);

const messages = store.messages as Message[];

async function handleSend() {
  if (newMessage.value.trim()) {
    isGeneratingMessage.value = true;
    await store.sendMessage(newMessage.value);
    addPromptToSessionCache(newMessage.value);
    newMessage.value = '';
    isGeneratingMessage.value = false;
  }
}

function addPromptToSessionCache(prompt : string) {
  // Get the current date and time
  const now = new Date();
  const timestamp = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;

  const recipeStore = useRecipeStore();
  const layoutMode = recipeStore.layoutMode;
  const userName = localStorage.getItem('current_user') || 'User';

  // Format the log message
  const logMessage = `${timestamp} [${userName}] [${LayoutOptions[layoutMode]}]: ${prompt}\n`;

  // Append the log message to the session storage
  const logCache = localStorage.getItem('log_cache') || '';
  localStorage.setItem('log_cache', logCache + logMessage);
}

function addCompletionTimeToSessionCache() {
    const { time, pauseTimer, resetTimer } = useStopwatchStore();
    const { totalTime, pauseTotalTimer, resetTotalTimer } = useTotalStopwatchStore();

    // Pause the timer.
    pauseTimer();
    pauseTotalTimer();
    // Get the current date and time
    const now = new Date();
    const timestamp = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;

    const recipeStore = useRecipeStore();
    const layoutMode = recipeStore.layoutMode;

    const userName = localStorage.getItem('current_user') || 'User';

    // Format the log message
    let logMessage = `${timestamp} [${userName}] [${LayoutOptions[layoutMode]}]: Finished Task in: ${formatTimeInMinutesAndSeconds(time)}\n`;
    logMessage += `${timestamp} [${userName}] [${LayoutOptions[layoutMode]}]: Total Task time: ${formatTimeInMinutesAndSeconds(totalTime)}\n`;

    // Append the log message to the session storage
    const logCache = localStorage.getItem('log_cache') || '';
    localStorage.setItem('log_cache', logCache + logMessage);
    // Reset the timer as it is not needed anymore
    resetTimer();
    resetTotalTimer();
    taskIsFinished.value = true;
}

onUpdated(() => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
});
</script>

<template>
  <div v-if="taskIsFinished" class="flex flex-col w-full h-full justify-center items-center">
    <h2 class="font-bold text-xl">Task is finished!</h2>
    <button class="bg-accent text-[black]" @click="taskIsFinished = false">Go back to chat</button>
  </div>
  <div v-else class="w-full m-auto md:max-w-[650px] p-4 flex flex-col h-full overflow-hidden">
    <div ref="chatContainer" class="messages flex flex-col space-y-2 overflow-y-auto">
      <div v-for="(message, index) in messages" :key="index" class="whitespace-pre-wrap rounded-lg"
            :class="{'self-end bg-blue-200 p-2 rounded bg-secondary text-primary': message.sender === 'user',
                    'self-start bg-gray-200 p-2 rounded bg-accent text-[black] text-left': message.sender === 'system'}">
        {{ message.text }}
      </div>
    </div>
    <div class="flex-grow"></div>
    <div class="flex flex-col items-center gap-3 mt-4">
      <input v-model="newMessage" @keyup.enter="handleSend" class="border p-2 w-full rounded" placeholder="Type your message...">
      <button :disabled="isGeneratingMessage" @click="handleSend" class="bg-accent text-[black] p-2 w-1/2">Send</button>
      <button class="bg-accent text-[black]" @click="addCompletionTimeToSessionCache">Press when task is finished.</button>
    </div>
  </div>
</template>
  
<style scoped>
</style>
  