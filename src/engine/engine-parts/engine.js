//engine parts
import { Renderer } from './render.js';
import { InputManager } from './input.js';
import { TimeManager } from './time.js';
import { Scene } from './scene.js';
import { GameObject } from "./game-object.js";

//utils
import { fetchTemplates } from './utils/template-cache.js';

export class Engine {
    constructor(canvas) {
        this.canvas = canvas;
        canvas.addEventListener('contextmenu', (event) => {
            event.preventDefault();
        });
        this.renderer = new Renderer(canvas);
        this.input = new InputManager(canvas);
        this.time = new TimeManager();
        this.scenes = [];
        this.currentScene = null;
        this.gameObjectRegistry = new Map();  // Global registry for gameObject script access
        this.templateCache = {}; 
    }

    // ======================== Game Management ========================

    async start() {
        // Expose engine to global scope for script access
        window.__engine = this;

        // Load Settings
        var settingsRes;
        try {
            settingsRes = await fetch('./settings.json');
            this.settings = await settingsRes.json();
            if (!this.settings) 
                console.error('Failed to load settings.');
        } catch (error) {
            console.error('Error loading settings:', error);
        }

        // Initialize renderLayers
        if (!this.settings.renderLayers || this.settings.renderLayers.length === 0) {
            this.settings.renderLayers = [{ "name": "Default" }];
        }
        for (let i = 0; i < this.settings.renderLayers.length; i++) {
            if (!this.settings.renderLayers[i].name) {
                this.settings.renderLayers[i].name = `Layer ${i + 1}`;
            } else {
                if (this.settings.renderLayers[i].name === "Background" || this.settings.renderLayers[i].name === "UI") {
                    console.warn(`Render layer name "${this.settings.renderLayers[i].name}" is reserved.`);
                    this.settings.renderLayers[i].name = `Layer ${i + 1}`;
                }
            }
        }
        this.settings.renderLayers.splice(0, 0, { "name": "Background" });
        this.settings.renderLayers.push({ "name": "UI" });

        this.renderer.setRenderLayers(this.settings.renderLayers);

        // Load Scenes
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
            this.currentScene = this.scenes[0];
            await this.scenes[0].setupScene();
        } else if (this.scenes.length === 0) {
            console.error('No scenes registered to start the engine.');
        }

        // Start Loop
        await this.awaitScriptPromises();
        this.currentScene.callComponentMethod('start');
        requestAnimationFrame(this.loop.bind(this));
    }

    async loop() {
        //=======UPDATE STAGE========
        // guard against missing scene
        if (!this.currentScene) {
            console.warn('No scenes registered, ending loop.');
            return;
        }

        // update time
        this.time.update();

        // update game objects
        //console.log(this.gameObjectRegistry)
        this.currentScene.update();

        //update input states
        this.input.update();

        //=======DRAW STAGE========
        this.renderer.renderFrame(this.currentScene);

        requestAnimationFrame(this.loop.bind(this));
    }

    // ======================== Scene Management ========================

    registerScene(scene) {
        if (scene) {
            this.scenes.push(scene);
            return true;
        } else {
            console.error('Failed to register scene:', scene);
            return false;
        }
    }

    async goToScene(sceneName) {
        //console.log(`Attempting to switch to scene: ${sceneName}`);
        var scene = this.scenes.find(s => s.name === sceneName);
        //console.log(`Found scene: ${scene ? scene.name : 'None'}`);
        if (scene) {

            this.currentScene.reset();
            await scene.setupScene();
            this.currentScene = scene;

            // Call start on all components in the new scene
            await this.awaitScriptPromises();
            this.currentScene.callComponentMethod('start');

            return true;
        }
        return false;
    }

    // ======================== GameObject Management ========================

    

    

    // ======================== Component Management ========================

    // utility to force functions to wait for promises to resolve
    async awaitScriptPromises() {
        if (!this.currentScene) {
            console.warn ('No currentScene, cannot awaitScriptPromises')
            return false;
        }

        var scriptPromises = [];
        this.currentScene.gameObjects.forEach(gameObject => {
            Object.values(gameObject.components).forEach(component => {
                if (component && component.scriptPromise) {
                    scriptPromises.push(component.scriptPromise);
                }
            });
        });
        if (scriptPromises.length > 0) await Promise.all(scriptPromises);
    }
}