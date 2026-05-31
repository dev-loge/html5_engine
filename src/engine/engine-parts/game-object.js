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
            var ComponentClass = getComponent(componentName);
            if (!ComponentClass) {
                console.warn(`Unknown component: ${componentName}`);
                return;
            }

            var inputData = mergeComponentInput(
                template.components[componentName],
                components && components[componentName]
            );
            this.components[componentName] = new ComponentClass(this, inputData);
            this[componentName] = this.components[componentName];
        });
    }

    getProperty(key) {
        /*
        if (!(key in this.Properties.properties)) {
            console.warn(`Property ${key} does not exist on id ${this.id} (${this.name})`);
            return undefined;
        }
        //*/
        //console.log(this);
        return this.Properties.properties[key];
    }

    setProperty(key, value) {
        var numericProps = ['width', 'height'];

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
            case 'color':
                if (typeof value !== 'string') {
                    console.error(`Invalid value for 'color' property: expected a string, got ${typeof value}`);
                    return;
                } else if (!/^#([0-9A-F]{3}){1,2}$/i.test(value) && !isValidColor(value)) {
                    console.error(`Invalid color format for 'color' property: expected a hex code or color name, got '${value}'`);
                    return;
                }   
                break;
        }
        this.Properties.properties[key] = value;
    }

    getPosition(axis) {
        //console.log(this.Properties);
        if (axis) {
            switch(axis) {
                case 'x':
                    return this.Properties.properties.position.x;
                case 'y':
                    return this.Properties.properties.position.y;
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
        var size = this.getProperty('size');
        this.Properties.properties.position.x = Math.max(0, Math.min(x, this.engine.canvas.width - size.w));
        this.Properties.properties.position.y = Math.max(0, Math.min(y, this.engine.canvas.height - size.h));
    }
    
    destroy() {
        var scene = this.engine.currentScene;
        scene.gameObjects = scene.gameObjects.filter(obj => obj !== this);
        // Additional cleanup if necessary (e.g. removing references to this object in other components)
    }

    update() {
        // Placeholder for game object-specific update logic, to be overridden by subclasses
    }

}

var isValidColor = (color) => {
    var s = new Option().style;
    s.color = color;
    return s.color !== '';
}