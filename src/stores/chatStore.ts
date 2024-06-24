// src/stores/chatStore.ts
import { defineStore } from 'pinia';
import { ref, Ref } from 'vue';
import { OpenAI } from 'openai';
import { CHATGPT_API_KEY } from '../variables';
import { useStopwatchStore } from './stopwatch';

const openai = new OpenAI({
    apiKey: CHATGPT_API_KEY,
    dangerouslyAllowBrowser: true,
});

export interface Message {
    text: string;
    sender: 'user' | 'system';
}

export const useChatStore = defineStore('chat', () => {
    const messages: Ref<Array<Message>> = ref([]);

    async function sendMessage(message: string): Promise<void> {
        const { pauseTimer, startTimer } = useStopwatchStore();

        // Pause the timer while the AI is thinking
        pauseTimer();

        messages.value.push({ text: message, sender: 'user' });
        try {
            const systemMessages = messages.value.filter(m => m.sender === 'system');
            const lastSystemMessage = systemMessages.length > 0 ? systemMessages.slice(-1)[0].text : "No previous message";
            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: 
                [
                    {
                        role: 'system',
                        content: `These are the previous messages sent. They are split by ;. The first message is the oldest: ${messages.value.filter(m => m.sender === 'user').map(m => m.text).join(';')}. The last message you sent is: ${lastSystemMessage}`
                    },
                    {
                      role: 'user', 
                      content: message 
                    },
                ],
                max_tokens: 450,
                stream: true
            });

            const initialSystemMessageIndex = messages.value.length;
            messages.value.push({ text: "", sender: 'system' });

            for await (let chunk of response) {
                messages.value[initialSystemMessageIndex].text += chunk.choices[0]?.delta?.content || "";
            }
        } catch (error) {
            console.error("Failed to send message to OpenAI:", error);
        } finally {
            console.log("starting time");
            // Resume the timer after the AI has responded.
            startTimer();
        }
    }

    return { messages, sendMessage };
});
