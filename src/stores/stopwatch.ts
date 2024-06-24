// src/stores/stopwatchStore.ts
import { defineStore } from 'pinia';
import { Stopwatch } from '../utils/Stopwatch';

export const useStopwatchStore = defineStore('stopwatch', {
  state: () => ({
    stopwatch: new Stopwatch(),
    time: 0,
    intervalId: null as any,
  }),
  actions: {
    startTimer() {
      this.stopwatch.start();
      if (!this.intervalId) {
        this.intervalId = setInterval(() => {
          this.time = this.stopwatch.getTime();
        }, 100);
      }
    },
    pauseTimer() {
      this.stopwatch.pause();
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    },
    resetTimer() {
      this.stopwatch.reset();
      this.time = 0;
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    },
  },
});

export const useTotalStopwatchStore = defineStore('totalStopwatch', {
  state: () => ({
    stopwatch: new Stopwatch(),
    totalTime: 0,
    intervalId: null as any,
  }),
  actions: {
    startTotalTimer() {
      this.stopwatch.start();
      if (!this.intervalId) {
        this.intervalId = setInterval(() => {
          this.totalTime = this.stopwatch.getTime();
        }, 100);
      }
    },
    pauseTotalTimer() {
      this.stopwatch.pause();
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    },
    resetTotalTimer() {
      this.stopwatch.reset();
      this.totalTime = 0;
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    },
  },
});
