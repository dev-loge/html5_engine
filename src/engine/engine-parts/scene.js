import { GameObject } from "./game-object.js";
import { getEngineInstance } from './utils/engine-instance.js';
import { fetchTemplates } from './utils/template-cache.js';

export class Scene {
    constructor(name, sceneData, gameData, engine = getEngineInstance()) {
        this.engine = engine;
        this.name = name;
        this.data = sceneData;
        this.gameObjects = [];
        this.nextObjectId = 0;
    }

    async setupScene() {
        // collect template names to fetch
        var templateNames = this.data.objects.filter(o => o.type === 'template').map(o => o.template);
        var templatesMap = await fetchTemplates(templateNames, 4);

        // build objects based on templates & custom data from scene file
        var gameObjects = this.data.objects.map(objData => {
            if (objData.type === 'template') {
                var template = templatesMap[objData.template];
                if (!template) {
                    console.error('Failed to load template:', objData.template);
                    return null;
                }

                var inputData = JSON.parse(JSON.stringify(template));
                inputData.name = objData.name || template.name || `GameObject_${Date.now()}`;
                for (var comp in objData.templateData) {
                    inputData.components[comp] = {...template.components[comp], ...objData.templateData[comp]};
                }
                return new GameObject(inputData, undefined, this.engine);
            } else {
                //Custom object handling
                return null;
            }
        });

        var objPromises = await Promise.all(gameObjects);
        objPromises.filter(Boolean).forEach(obj => this.registerGameObject(obj));
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