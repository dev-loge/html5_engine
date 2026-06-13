import { getComponent } from '../components/utils/index.js';
import { getEngineInstance } from './utils/engine-instance.js';

var mergeComponentInput = (templateInput = {}, overrideInput = {}) => {
    var merged = { ...templateInput, ...overrideInput };
    // Deep merge data objects if both exist
    if (templateInput.data && overrideInput.data) {
        merged.data = { ...templateInput.data, ...overrideInput.data };
    }
    return merged;
};

export class GameObject {
    constructor(template, components, engine = getEngineInstance()) {
        this.engine = engine;
        this.name = template.name || `GameObject_${Date.now()}`;

        // Ensure Properties component always exists
        template.components = template.components || {};
        if (!template.components.Properties && !(components && components.Properties)) {
            template.components.Properties = {};
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

    getComponentByName(name) {
        if (!this.components[name]) console.error(`${name} component not found on ${this.name}`)
        return this.components[name]
    }

    getComponentByType(type) {
        const lowerType = type.toLowerCase();
        for (let componentName in this.components) {
            if (this.components[componentName].type === lowerType) {
                return this.components[componentName];
            }
        }
        return null;
    }

    getComponentsByType(type) {
        var lowerType = type.toLowerCase();
        return Object.values(this.components).filter(comp => comp.type === lowerType);
    }

    getProperty(key) {
        var propertiesComponent = this.getComponentByType('properties');
        if (!propertiesComponent) {
            console.error(`${this.name} does not have a Properties component`);
            return;
        }

        if (propertiesComponent.properties[key] !== undefined) {
            return propertiesComponent.properties[key];
        } else {
            console.warn(`${this.name}: Property '${key}' not found in Properties component.`);
            return undefined;
        }    
    }

    setProperty(key, value) {
        var propertiesComponent = this.getComponentByType('properties');
        if (!propertiesComponent) {
            console.error(`${this.name} does not have a Properties component`);
            return;
        }

        propertiesComponent.properties[key] = value;
    }

    getPosition(axis) {
        var propertiesComponent = this.getComponentByType('properties');
        if (!propertiesComponent) {
            console.error(`${this.name} does not have a Properties component`);
            return undefined;
        }
        
        if (axis) {
            switch(axis) {
                case 'x':
                    return propertiesComponent.properties.position.x;
                case 'y':
                    return propertiesComponent.properties.position.y;
                default:
                    console.warn(`${this.name}: Invalid axis for getPosition: ${axis}`);
                    return undefined;
            }
        } else return propertiesComponent.properties.position;
    }

    setPosition(x, y) {
        if (typeof x !== 'number' || typeof y !== 'number') {
            console.error(`${this.name}: Invalid values for setPosition: expected numbers, got ${typeof x} and ${typeof y}`);
            return;
        }
        const propertiesComponent = this.getComponentByType('properties');
        if (!propertiesComponent) {
            console.error(`${this.name}: does not have a Properties component`);
            return;
        }
        
        //var size = this.getProperty('size');
        propertiesComponent.properties.position.x = x;
        propertiesComponent.properties.position.y = y;
        if (false) {
            if (size.r) {
                propertiesComponent.properties.position.x = Math.max(0, Math.min(x, this.engine.canvas.width - size.r));
                propertiesComponent.properties.position.y = Math.max(0, Math.min(y, this.engine.canvas.height - size.r));
            } else {
                propertiesComponent.properties.position.x = Math.max(0, Math.min(x, this.engine.canvas.width - size.w));
                propertiesComponent.properties.position.y = Math.max(0, Math.min(y, this.engine.canvas.height - size.h));
            }
        }
    }
    
    destroy() {
        var scene = this.engine.currentScene;
        scene.gameObjects = scene.gameObjects.filter(obj => obj !== this);

        // Additional cleanup if necessary (e.g. removing references to this object in other components)

        this.engine.gameObjectRegistry.delete(this.id);
    }

    update() {
        // Placeholder for game object-specific update logic, to be overridden by subclasses
    }

}