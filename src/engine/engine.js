class Engine {
    constructor(canvas) {
        this.canvas = canvas;
        this.canvasCtx = this.canvas.getContext('2d');
        this.input = new InputManager();
        this.scenes = [];
        this.currentScene = null;
    }

    start() {
        // onCreate happens before checking for scenes in case first scene is created in onCreate
        this.onCreate();
        if (this.currentScene == null && this.scenes.length > 0) {
            this.currentScene = this.scenes[0];

            return true;
        } else {
            console.error('No scenes registered to start the engine.');

            return false;
        }
    }

    registerScene(scene) {
        if (scene) {
            this.scenes.push(scene);
            return true;
        } else {
            console.error('Failed to register scene:', scene);
            return false;
        }
    }

    //Placeholder functions
    onCreate() {
        return true;
    }
}