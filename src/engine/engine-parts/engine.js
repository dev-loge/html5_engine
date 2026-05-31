import { Renderer } from './render.js';
import { InputManager } from './input.js';
import { Scene } from './scene.js';
import { setEngineInstance, getEngineInstance } from './utils/engine-instance.js';

export class Engine {
    constructor(canvas) {
        if (getEngineInstance()) {
            console.warn('Engine instance already exists. Reusing the existing instance is recommended.');
        }
        setEngineInstance(this);
        this.canvas = canvas;
        this.renderer = new Renderer(canvas);
        this.input = new InputManager();
        this.scenes = [];
        this.currentScene = null;
    }

    static getInstance() {
        return getEngineInstance();
    }

    async start() {
        var res = await fetch('./engine/engine-parts/utils/scene-exports.json');
        var { files } = await res.json();

        var scenesData = await Promise.all(
            files.map(file => fetch(`./assets/scenes/${file}`).then(r => r.json()))
        )

        scenesData.forEach(sceneData => {
            //console.log('Loaded Scene: ', sceneData.name)
            this.registerScene(new Scene(sceneData.name, sceneData, undefined, this));
        });

        if (this.currentScene == null && this.scenes.length > 0) {
            this.scenes[0].setupScene();
            this.currentScene = this.scenes[0];
        } else if (this.scenes.length === 0) {
            console.error('No scenes registered to start the engine.');
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
        // guard against missing scene
        if (!this.currentScene) {
            console.warn('No scenes registered, ending loop.');
            return;
        }

        //update input states
        this.input.update();

        // update game objects
        for (var i = 0, len = this.currentScene.gameObjects.length; i < len; i++) {
            var gameObject = this.currentScene.gameObjects[i];
            var components = gameObject.components;
            for (var componentKey in components) {
                if (!Object.prototype.hasOwnProperty.call(components, componentKey)) continue;
                components[componentKey].update();
            }
        }

        //=======DRAW STAGE========
        this.renderer.renderFrame(this.currentScene);

        requestAnimationFrame(this.loop.bind(this));
    }
}