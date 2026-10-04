
export class TimeManager {
    constructor() {
        this.lastUpdateTime = performance.now();
        this.deltaTime = 0;
        this.timeScale = 1; // Default time scale
        this.timers = []; // Array to hold active timers
    }

    update() {
        var currentTime = performance.now();
        this.deltaTime = (currentTime - this.lastUpdateTime) * 0.001 * this.timeScale; // Convert to seconds and apply time scale
        this.lastUpdateTime = currentTime;
    }

    setTimeScale(scale) {
        if (scale < 0) {
            console.warn('Time scale cannot be negative. Setting to 0.');
            this.timeScale = 0;
        } else {
            this.timeScale = scale;
        }
    }

    setTimer(name, duration, callback) {
        var startTime = performance.now();
        var checkTimer = () => {
            var elapsedTime = (performance.now() - startTime) * 0.001 * this.timeScale; // Convert to seconds and apply time scale
            if (elapsedTime >= duration) {
                callback();
            } else {
                requestAnimationFrame(checkTimer);
            }
        };
        this.timers.push({ name, checkTimer });
        requestAnimationFrame(checkTimer);
    }
}
