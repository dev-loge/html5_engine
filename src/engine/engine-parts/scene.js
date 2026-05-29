import { GameObject } from "./game-object.js";
import { getEngineInstance } from './engine-exports.js';

export class Scene {
    constructor(name, sceneData, gameData) {
        this.engine = getEngineInstance();
        this.name = name;
        this.data = sceneData;
        this.gameObjects = [];
        this.nextObjectId = 0;
    }

    async setupScene() {
        var gameObjects = this.data.objects.map(objData => {
            if (objData.type === 'template') {
                return this.fetchTemplate(objData.template).then(template => {
                    template.components.Properties.position = objData.templateData.position;
                    return new GameObject(template);
                })
            } else {
                //Custom object handling
            }
        });
        var objPromises = await Promise.all(gameObjects);
        objPromises.forEach(obj => this.registerGameObject(obj));
    }

    registerGameObject(gameObject) {
        if (gameObject) {
            gameObject.id = this.nextObjectId++;
            this.gameObjects.push(gameObject);
            return true;
        } else {
            console.error('Failed to register game object:', gameObject);
            return false;
        }
    }

    reset() {
        this.gameObjects = [];
        this.nextObjectId = 0;
    }

    async fetchTemplate(template) {
        var res = await fetch(`./assets/templates/${template}`);
        return await res.json();
    }
}