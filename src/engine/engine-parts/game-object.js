import { getComponent } from '../components/utils/index.js';

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

        for (var key of Object.keys(template)) {
            if (key !== 'components') {
                var defaultVal = 0;
                switch (key) {
                    case 'name':
                        defaultVal = `GameObject_${Date.now()}`
                    case 'position': 
                        defaultVal = {x:0, y:0}
                }
                this[key] = template[key] || defaultVal;
            }
        }

        var templateComponentNames = template.components ? Object.keys(template.components) : [];
        var overrideComponentNames = components ? Object.keys(components) : [];
        var componentsList = [...new Set([...templateComponentNames, ...overrideComponentNames])];

        this.componentsList = componentsList;
        this.components = {};

        componentsList.forEach(componentName => {
            var inputData = mergeComponentInput(
                template.components[componentName],
                components && components[componentName]
            );

            // Determine which component class to use
            let componentType = componentName;
            if (inputData && inputData.type) {
                componentType = inputData.type.charAt(0).toUpperCase() + inputData.type.slice(1);
            }

            var ComponentClass = getComponent(componentType);
            if (!ComponentClass) {
                console.warn(`${this.name}: Unknown component: ${componentType}`);
                return;
            }

            var componentInstance = new ComponentClass(this, inputData, this.engine, componentName);

            this.components[componentInstance.name] = componentInstance;
        });
        this.graphicComps = componentsList.filter(comp => this.components[comp].graphic);
    }

    // ======================== Manage This ========================
    destroy() {
        var scene = this.engine.currentScene;
        scene.gameObjects = scene.gameObjects.filter(obj => obj !== this);

        // Additional cleanup if necessary (e.g. removing references to this object in other components)

        this.engine.gameObjectRegistry.delete(this.id);
    }

    setProperty(key, value) {
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

    // ======================== Manage Components ========================
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