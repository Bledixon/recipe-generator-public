export class Stopwatch {
    private startTime: number;
    private elapsedTime: number;
    private running: boolean;

    constructor() {
        this.startTime = 0;
        this.elapsedTime = 0;
        this.running = false;
    }

    // Starts or resumes the timer
    start(): void {
        if (!this.running) {
            this.startTime = performance.now() - this.elapsedTime;
            this.running = true;
        }
    }

    // Pauses the timer
    pause(): void {
        if (this.running) {
            this.elapsedTime = performance.now() - this.startTime;
            this.running = false;
        }
    }

    // Returns the elapsed time in milliseconds
    getTime(): number {
        if (this.running) {
            return performance.now() - this.startTime;
        }
        return this.elapsedTime;
    }

    // Resets the timer
    reset(): void {
        this.elapsedTime = 0;
        this.running = false;
        this.startTime = 0;
    }
}
  