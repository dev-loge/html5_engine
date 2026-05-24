import { Renderer } from './render.js';
import { InputManager } from './input.js';
import { Scene } from './scene.js';

export class Engine {
    constructor(canvas) {
        this.canvas = canvas;
        this.renderer = new Renderer(canvas);
        this.input = new InputManager();
        this.scenes = [];
        this.currentScene = null;
    }

    async start() {
        var res = await fetch('./scenes/scene-exports.json');
        var { files } = await res.json();

        var scenesData = await Promise.all(
            files.map(file => fetch(`./scenes/${file}`).then(r => r.json()))
        )

        scenesData.forEach(sceneData => {
            console.log('Loaded Scene: ', sceneData.name)
            this.registerScene(new Scene(this, sceneData.name, sceneData));
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
}