import { GameObject } from "./game-object.js";
import { fetchTemplates } from './utils/template-cache.js';
import Vector2 from '../math/vector2.js';

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

    update() {
        for (var gameObject of this.gameObjects) {
            gameObject.update();
        }
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
                    .filter(o => 'template' in o)
                    .map(o => o.template)
                    .filter(name => !this.templateCache[name])
            )
        ];
        if (neededTemplates.length > 0) {
            var fetched = await fetchTemplates(neededTemplates, 4);
            Object.assign(this.templateCache, fetched);
        }
        // Build objects
        var results = await Promise.all(objects.map(async objData => {
            //console.log('createGameObject', objData.name)
            if ('template' in objData) {
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

                var componentData = objData.componentData || {};

                // Merge components with deep-merge for data objects
                for (var comp in componentData) {
                    var templateComp = template.components[comp] || {};
                    var overrideComp = componentData[comp] || {};
                    var merged = {
                        ...templateComp,
                        ...overrideComp
                    };

                    var componentType = (merged.type || templateComp.type || overrideComp.type || '').toLowerCase();
                    if (componentType === 'script') {
                        var mergedData = {};
                        if (templateComp.data) {
                            Object.assign(mergedData, templateComp.data);
                        }
                        if (overrideComp.data) {
                            Object.assign(mergedData, overrideComp.data);
                        }

                        Object.entries(overrideComp).forEach(([key, value]) => {
                            if (key !== 'data' && key !== 'type' && key !== 'script' && value !== undefined) {
                                mergedData[key] = value;
                            }
                        });

                        merged.data = mergedData;
                    }

                    inputData.components[comp] = merged;
                }

                //fix size inheritance for hitbox component
                if (objData.size !== undefined) inputData.size = objData.size;

                // if a child object
                if (objData.parent) {
                    var parent = objData.parent;
                    inputData.parent = parent;
                    var templateOffset = objData.position || {x:0, y:0};
                    inputData.posOffset = new Vector2(templateOffset.x || 0, templateOffset.y || 0);
                    inputData.position = parent.position.add(inputData.posOffset);
                } 
                // set starting position
                else {
                    var templatePos = objData.position || {x:0, y:0};
                    inputData.position = new Vector2(templatePos.x || 0, templatePos.y || 0);
                }

                var newObj = new GameObject(inputData, undefined, this.engine);
                return newObj;

            } else {
                // Custom object

                //fix size inheritance for hitbox component
                if (objData.size !== undefined) objData.size = objData.size;
                
                // if a child object
                if (objData.parent) {
                    var parent = objData.parent;
                    var customOffset = objData.position || {x:0, y:0};
                    objData.posOffset = new Vector2(customOffset.x || 0, customOffset.y || 0);
                    objData.position = parent.position.add(objData.posOffset);
                } 
                // set starting position
                else {
                    var customPos = objData.position || {x:0, y:0};
                    objData.position = new Vector2(customPos.x || 0, customPos.y || 0);
                }

                var newObj = new GameObject(objData, undefined, this.engine);
                return newObj;
            }
        }));
        //console.log(results)
        for (var obj of results) {
            if (!obj) continue;
            this.registerGameObject(obj)
        }

        for (var obj of results) {
            if (!obj) continue;
            await obj.buildChildren(this);
        }

        var valid = results.filter(Boolean);

        // Wait for scripts to load, then call awake on the newly created objects only
        await Promise.all(valid.map(obj => obj.awaitScriptPromises()));
        valid.forEach(obj => obj.callComponentMethod('awake'));

        return Array.isArray(input) ? valid : valid[0] || null;
    }

    registerGameObject(gameObject) {
        //console.log(`gameObject registered: ${gameObject.name}`)
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