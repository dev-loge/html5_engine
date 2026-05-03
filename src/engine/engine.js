class Engine {
    constructor(canvas) {
        this.canvas = canvas;
        this.renderer = new Renderer(canvas);
        this.input = new InputManager();
        this.scenes = [];
        this.currentScene = null;
    }

    start() {
        // onCreate happens before checking for scenes in case first scene is created in onCreate
        this.onCreate();
        if (this.currentScene == null && this.scenes.length > 0) {
            this.currentScene = this.scenes[0];

            //return true;
        } else {
            console.error('No scenes registered to start the engine.');

            //return false;
        }

        requestAnimationFrame(this.loop.bind(this));
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

    loop() {
        //=======UPDATE STAGE========
        //update input states
        this.input.update();

        // update game objects
        this.currentScene.gameObjects.forEach(gameObject => {
            gameObject.components.forEach(componentKey => {
                gameObject[componentKey].update();
            });
            /*
            if (gameObject.playerController && typeof gameObject.playerController === 'function') {
                gameObject.playerController();
            }
            //*/
            
        });

        //=======DRAW STAGE========
        this.renderer.renderFrame(this.currentScene);

        requestAnimationFrame(this.loop.bind(this));
    }

    //Placeholder functions
    onCreate() {
        return true;
    }
}