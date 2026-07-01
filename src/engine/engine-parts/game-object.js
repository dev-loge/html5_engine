import { getComponent } from '../components/utils/index.js';
import Vector2 from '../math/vector2.js';

var mergeComponentInput = (templateInput = {}, overrideInput = {}) => {
    var merged = { ...templateInput, ...overrideInput };
    // Deep merge data objects if both exist
    if (templateInput.data && overrideInput.data) {
        merged.data = { ...templateInput.data, ...overrideInput.data };
    }
    return merged;
};

export class GameObject {
    constructor(template, components, engine) {
        this.engine = engine;
        // ======================== Build This ========================
        for (var key of Object.keys(template)) {
            if (key !== 'components') {
                var defaultVal = 0;
                switch (key) {
                    case 'name':
                        defaultVal = `GameObject_${Date.now()}`
                        break;
                    case 'position': 
                        defaultVal = new Vector2(0, 0)
                        break;
                    case 'posOffset':
                        defaultVal = new Vector2(0, 0)
                        break;
                }
                if (key === 'position' || key === 'posOffset') {
                    var coords = template[key] || defaultVal;
                    this[key] = new Vector2(coords.x || 0, coords.y || 0);
                } else {
                    this[key] = template[key] || defaultVal;
                }
            }
        }

        var templateComponentNames = template.components ? Object.keys(template.components) : [];
        var overrideComponentNames = components ? Object.keys(components) : [];
        var componentsList = [...new Set([...templateComponentNames, ...overrideComponentNames])];

        this.componentsList = componentsList;
        this.components = {};

        for (var componentName of componentsList) {
            var inputData = mergeComponentInput(
                template.components[componentName],
                components && components[componentName]
            );

            // Determine which component class to use
            var componentType = componentName;
            if (inputData && inputData.type) {
                componentType = inputData.type.charAt(0).toUpperCase() + inputData.type.slice(1);
            }

            var ComponentClass = getComponent(componentType);
            if (!ComponentClass) {
                console.warn(`${this.name}: Unknown component: ${componentType}`);
                return;
            }

            var componentInstance = new ComponentClass(this, inputData, engine, componentName);

            this.components[componentInstance.name] = componentInstance;
        }
        
        this.graphicComps = componentsList.filter(comp => this.components[comp].graphic);
    
        // ======================== Children Handling ========================
        // create children
        this.children = [];
        this._pendingChildDefs = [];
        
        if ('children' in template) {
            var scene = engine.currentScene;
            for (var child of template.children) {
                this._pendingChildDefs.push({...child, parent:this})
            }
        }



    }

    // ======================== Manage This ========================
    update() {
        // update position to be relative to parent's (if child)
        if ('parent' in this) {
            var parentPos = this.parent.position;
            this.position = parentPos.add(this.posOffset);
        }

        this.callComponentMethod('update')
    }

    destroy() {
        this.callComponentMethod('destroy');
        
        var scene = this.engine.currentScene;
        scene.gameObjects = scene.gameObjects.filter(obj => obj !== this && obj.parent !== this);

        // Additional cleanup if necessary (e.g. removing references to this object in other components)

        for (var child of this.children) this.engine.gameObjectRegistry.delete(child.id);
        this.engine.gameObjectRegistry.delete(this.id);
    }

    setProperty(key, value) {
        var lockedProperties = ['id', 'components'];
        if (lockedProperties.indexOf(key) > -1) {
            console.warn(`Property ${key} can only be read, not written to.`)
            return false;
        }

        if (key in this) {
            var keyType = typeof this[key];
            var valueType = typeof value;
            if (keyType !== valueType) {
                console.warn(`Cannot set property ${key} to ${value}: expected ${keyType}`)
                return false;
            }
        }

        //special property conditions
        var validated = false;
        switch(key) {
            case 'position': 
                if ('x' in value && 'y' in value) {
                    if (typeof value.x !== 'number' || typeof value.y !== 'number') {
                        console.error(`${this.name}: Invalid values for position: expected numbers, got ${typeof value.x} and ${typeof value.y}`);
                        return false;
                    } else {
                        value = new Vector2(value.x, value.y);
                        validated = true;
                    }
                }
                break;
            default:
                validated = true;
        }

        if (validated) this[key] = value
        return true;
    }

    // ======================== Manage Children ========================
    async buildChildren (scene) {
        if (!this._pendingChildDefs.length) return;

        var built = await Promise.all(this._pendingChildDefs.map(child => scene.createGameObject(child)));
        this.children.push(...built);
        this._pendingChildDefs = null;
    }

    getParent(index) {
        var depth = index || 0;
        // add logic to look up at parent's parent based on depth

        return this.parent;
    }

    getChildByName(name) {
        return this.children.find(child => child.name === name);
    }

    

    // ======================== Manage Components ========================
    async awaitScriptPromises() {
        var promises = Object.values(this.components)
            .filter(comp => comp && comp.scriptPromise)
            .map(comp => comp.scriptPromise);
        if (promises.length > 0) await Promise.all(promises);
    }

    callComponentMethod(methodName, ...args) {
        //this.engine.awaitScriptPromises()
        var components = this.components;
        if (components) {
            for (var componentKey in components) {
                if (!Object.prototype.hasOwnProperty.call(components, componentKey)) continue;
                if (typeof components[componentKey][methodName] !== 'function') {
                    //console.warn(`Component ${componentKey} of game object ${this.name} does not have method ${methodName}`);
                    continue;
                }
                components[componentKey][methodName](...args);
            }
        } else {
            console.warn(`${this} is missing components.`);
        }
    }

    // returns a single component
    getComponentByName(name) {
        if (!this.components[name]) console.error(`${name} component not found on ${this.name}`)
        return this.components[name]
    }

    // returns an array of components
    getComponentsByType(type) {
        var lowerType = type.toLowerCase();
        return Object.values(this.components).filter(comp => comp.type === lowerType);
    }
}