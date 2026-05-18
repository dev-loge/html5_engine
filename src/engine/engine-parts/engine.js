import { Renderer } from './render.js';
import { InputManager } from './input.js';
import * as Scenes from '../../scenes/scene-exports.js';

export class Engine {
    constructor(canvas) {
        this.canvas = canvas;
        this.renderer = new Renderer(canvas);
        this.input = new InputManager();
        this.scenes = [];
        this.currentScene = null;
    }

    start() {
        this.autoRegisterScenes();
        // onCreate happens before checking for scenes in case first scene is created in onCreate
        this.onCreate();
        if (this.currentScene == null && this.scenes.length > 0) {
            this.scenes[0].setupScene();
            this.currentScene = this.scenes[0];
        } else if (this.scenes.length === 0) {
            console.error('No scenes registered to start the engine.');
        }

        requestAnimationFrame(this.loop.bind(this));
    }

    autoRegisterScenes() {
        Object.values(Scenes).forEach(SceneClass => {
            if (typeof SceneClass !== 'function') {
                return;
            }

            try {
                var scene = new SceneClass(this);
                this.registerScene(scene);
            } catch (error) {
                console.error('Failed to auto-register scene:', SceneClass, error);
            }
        });
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

    goToScene(sceneName) {
        console.log(`Attempting to switch to scene: ${sceneName}`);
        var scene = this.scenes.find(s => s.name === sceneName);
        console.log(`Found scene: ${scene ? scene.name : 'None'}`);
        if (scene) {

            this.currentScene.reset();
            scene.setupScene();
            this.currentScene = scene;

            return true;
        }
        return false;
    }

    loop() {
        //=======UPDATE STAGE========
        //update input states
        this.input.update();

        // update game objects
        this.currentScene.gameObjects.forEach(gameObject => {
            gameObject.componentsList.forEach(componentKey => {
                gameObject[componentKey].update();
            });
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