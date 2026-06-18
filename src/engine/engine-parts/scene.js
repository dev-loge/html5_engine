import { GameObject } from "./game-object.js";
import { fetchTemplates } from './utils/template-cache.js';

export class Scene {
    constructor(name, sceneData, gameData, engine) {
        this.engine = engine;
        this.name = name;
        this.data = sceneData;
        this.gameObjects = [];
        this.nextObjectId = 0;
        this.templateCache = {};
    }

    // ======================== Scene Management ========================
    
    async setupScene() {
        // collect template names to fetch
        var templateNames = this.data.objects.filter(o => o.type === 'template').map(o => o.template);
        var templatesMap = await fetchTemplates(templateNames, 4);

        // build objects based on templates & custom data from scene file
        await this.createGameObject(this.data.objects)
    }

    async fetchTemplate(template) {
        var res = await fetch(`./assets/templates/${template}`);
        return await res.json();
    }

    reset() {
        // Clear all game objects from the registry
        this.gameObjects.forEach(obj => {
            this.engine.gameObjectRegistry.delete(obj.id);
        });
        this.gameObjects = [];
        this.nextObjectId = 0;
    }

    // ======================== GameObject Management ========================

    async createGameObject(input) {
        var objects = Array.isArray(input) ? input : [input];
        var neededTemplates = [
            ...new Set(
                objects
                    .filter(o => o.type === 'template')
                    .map(o => o.template)
                    .filter(name => !this.templateCache[name])
            )
        ];
        if (neededTemplates.length > 0) {
            var fetched = await fetchTemplates(neededTemplates, 4);
            Object.assign(this.templateCache, fetched);
        }

        // Build objects
        var results = objects.map(objData => {
            //console.log('createGameObject', objData.name)
            if (objData.type === 'template') {
                var template = this.templateCache[objData.template];
                if (!template) {
                    console.error('Failed to load template:', objData.template);
                    return null;
                }

                var inputData = JSON.parse(JSON.stringify(template));
                inputData.name =
                    objData.name ||
                    template.name ||
                    `GameObject_${Date.now()}`;

                // Merge components with deep-merge for data objects
                for (var comp in objData.templateData) {
                    var templateComp = template.components[comp] || {};
                    var overrideComp = objData.templateData[comp] || {};
                    var merged = {
                        ...templateComp,
                        ...overrideComp
                    };
                    // Deep merge data objects to preserve template defaults
                    if (templateComp.data && overrideComp.data) {
                        merged.data = { ...templateComp.data, ...overrideComp.data };
                    }
                    inputData.components[comp] = merged;
                }
                inputData.position = objData.position || {x:0, y:0};
                return new GameObject(inputData, undefined, this.engine);

            } else {
                // Custom object
                if (!objData.position) {
                    objData.position = {x:0, y:0};
                }

                return new GameObject(objData, undefined, this.engine);
            }
        });

        var valid = results.filter(Boolean);
        valid.forEach(obj => this.registerGameObject(obj));

        // call Awake methods on components
        this.callComponentMethod('awake');

        return Array.isArray(input) ? valid : valid[0] || null;
    }

    registerGameObject(gameObject) {
        if (gameObject) {
            gameObject.id = this.nextObjectId++;
            this.gameObjects.push(gameObject);
            // Add to engine's global registry
            this.engine.gameObjectRegistry.set(gameObject.id, gameObject);
            return true;
        } else {
            console.error('Failed to register game object:', gameObject);
            return false;
        }
    }

    callComponentMethod(methodName, ...args) {
        for (var i = 0, len = this.gameObjects.length; i < len; i++) {
            if (this.gameObjects[i]) this.gameObjects[i].callComponentMethod(methodName, ...args);
        }
    }
}