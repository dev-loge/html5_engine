import * as componentClasses from '../components/component-exports.js';
import { getEngineInstance } from './engine-exports.js';

export class GameObject {
    constructor(template, components) {
        this.engine = getEngineInstance();
        this.name = template.name || `GameObject_${Date.now()}`;
        console.log('Created GameObject: ', this.name);

        //Ensure Properties component always exists
        if (!template.components.Properties && !components.Properties)
            template.components.Properties = {};

        //validate template and load components
        var componentsList = [];
        if (template && template.components) componentsList = Object.keys(template.components);
        if (components) componentsList = [...new Set([...componentsList, ...Object.keys(components)])];
        componentsList.forEach(componentName => {
            if (componentClasses[componentName]) {
                var inputData = template.components[componentName] || {};
                if (components && components[componentName]) {
                    inputData = {...inputData, ...components[componentName]};
                }
                if (componentName === 'Properties' && this.name === 'Obstacle') {
                    console.log('Properties input data for Obstacle: ', inputData);
                }
                this[componentName] = new componentClasses[componentName](this, inputData);
            } else {
                console.warn(`Unknown component: ${componentName}`);
            }
        });
    }

    getProperty(key) {
        if (!(key in this.Properties.properties)) {
            console.warn(`Property ${key} does not exist on id ${this.id} (${this.name})`);
            return undefined;
        }
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
        this.Properties.properties.position.x = Math.max(0, Math.min(x, this.engine.canvas.width - this.getProperty('size').w));
        this.Properties.properties.position.y = Math.max(0, Math.min(y, this.engine.canvas.height - this.getProperty('size').h));
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