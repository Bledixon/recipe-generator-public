export function formatTimeInMinutesAndSeconds(milliseconds: number): string {
    const totalSeconds = milliseconds / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
  
    return `[${minutes.toString().padStart(2, '0')}] m [${seconds.toFixed(2).padStart(5, '0')}] s`;
}