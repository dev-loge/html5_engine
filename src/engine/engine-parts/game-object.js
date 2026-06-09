import { getComponent } from '../components/utils/index.js';
import { getEngineInstance } from './utils/engine-instance.js';

const mergeComponentInput = (templateInput = {}, overrideInput = {}) => ({
    ...templateInput,
    ...overrideInput
});

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
                console.warn(`Unknown component: ${componentType}`);
                return;
            }

            var componentInstance = new ComponentClass(this, inputData, this.engine, componentName);

            this.components[componentInstance.name] = componentInstance;
        });
        this.graphicComps = componentsList.filter(comp => this.components[comp].graphic);
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
        const lowerType = type.toLowerCase();
        return Object.values(this.components).filter(comp => comp.type === lowerType);
    }

    getProperty(key) {
        const propertiesComponent = this.getComponentByType('properties');
        if (propertiesComponent && propertiesComponent.properties[key] !== undefined) {
            return propertiesComponent.properties[key];
        } else {
            console.warn(`Property '${key}' not found in Properties component.`);
            return undefined;
        }    
    }

    setProperty(key, value) {
        var numericProps = ['width', 'height'];
        const propertiesComponent = this.getComponentByType('properties');
        
        if (!propertiesComponent) {
            console.error('GameObject does not have a Properties component');
            return;
        }

        switch(key) {
            case numericProps.find(prop => prop === key):
                if (typeof value !== 'number') {
                    console.error(`Invalid value for '${key}' property: expected a number, got ${typeof value}`);
                    return;
                }

                if (key === 'width' || key === 'height') {
                    // Ensure width and height are positive and do not exceed canvas dimensions
                    value = Math.max(1, Math.min(value, key === 'width' ? this.engine.canvas.width - this.getPosition('x') : this.engine.canvas.height - this.getPosition('y')));
                }

                break;
        }
        propertiesComponent.properties[key] = value;
    }

    getPosition(axis) {
        const propertiesComponent = this.getComponentByType('properties');
        if (!propertiesComponent) {
            console.warn('GameObject does not have a Properties component');
            return undefined;
        }
        
        if (axis) {
            switch(axis) {
                case 'x':
                    return propertiesComponent.properties.position.x;
                case 'y':
                    return propertiesComponent.properties.position.y;
                default:
                    console.warn(`Invalid axis for getPosition: ${axis}`);
                    return undefined;
            }
        } else return this.getProperty('position');
    }

    setPosition(x, y) {
        if (typeof x !== 'number' || typeof y !== 'number') {
            console.error(`Invalid values for setPosition: expected numbers, got ${typeof x} and ${typeof y}`);
            return;
        }
        const propertiesComponent = this.getComponentByType('properties');
        if (!propertiesComponent) {
            console.error('GameObject does not have a Properties component');
            return;
        }
        
        var size = this.getProperty('size');
        propertiesComponent.properties.position.x = Math.max(0, Math.min(x, this.engine.canvas.width - size.w));
        propertiesComponent.properties.position.y = Math.max(0, Math.min(y, this.engine.canvas.height - size.h));
    }
    
    destroy() {
        var scene = this.engine.currentScene;
        scene.gameObjects = scene.gameObjects.filter(obj => obj !== this);
        // Remove from global registry
        this.engine.gameObjectRegistry.delete(this.id);
        // Additional cleanup if necessary (e.g. removing references to this object in other components)
    }

    update() {
        // Placeholder for game object-specific update logic, to be overridden by subclasses
    }

}