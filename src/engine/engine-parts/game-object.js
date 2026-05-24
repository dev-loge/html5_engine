import * as componentClasses from '../components/component-exports.js';

export class GameObject {
    constructor(engine, template, components) {
        this.engine = engine;

        function loadComponents(componentsList) {
            componentsList.forEach(componentName => {
                if (componentClasses[componentName]) {
                    var inputData = template[componentName] || components[componentName] || {}; //is failing here if component is undefined
                    this[componentName] = new componentClasses[componentName](engine, this, inputData);
                } else {
                    console.warn(`Unknown component: ${componentName}`);
                }
            });
        }

        //Ensure Properties component always exists
        if (!template.Properties && !components.Properties)
            components.Properties = {'Properties': {}};

        //make sure template is valid & load components from it
        if (template !== null && typeof template === 'object' && !Array.isArray(template)) {
            this.name = template.name || `GameObject_${Date.now()}`;
            var templateComponents = Object.keys(template).splice(1);
            loadComponents.call(this, templateComponents);
        }

        //load additional components from components argument, if provided
        if (components && typeof components === 'object' && !Array.isArray(components)) {
            var additionalComponents = Object.keys(components).filter(c => !this.hasOwnProperty(c));
            loadComponents.call(this, additionalComponents);
        }
    }

    getProperty(key) {
        if (!(key in this.Properties.properties)) {
            console.warn(`Property ${key} does not exist on GameObject`);
            return undefined;
        }
        return this.Properties.properties[key];
    }

    setProperty(key, value) {
        var numericProps = ['x', 'y', 'width', 'height'];

        switch(key) {
            case numericProps.find(prop => prop === key):
                if (typeof value !== 'number') {
                    console.error(`Invalid value for '${key}' property: expected a number, got ${typeof value}`);
                    return;
                }

                if (key === 'x' || key === 'y') {
                    // Ensure the position stays within the canvas bounds
                    value = Math.max(0, Math.min(value, key === 'x' ? this.engine.canvas.width - this.getProperty('width') : this.engine.canvas.height - this.getProperty('height')));
                } else if (key === 'width' || key === 'height') {
                    // Ensure width and height are positive and do not exceed canvas dimensions
                    value = Math.max(1, Math.min(value, key === 'width' ? this.engine.canvas.width - this.getProperty('x') : this.engine.canvas.height - this.getProperty('y')));
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

    //this doesnt work
    addComponent(componentName, componentData) {
        if (this.componentsList.includes(componentName)) {
            console.warn(`GameObject already has component: ${componentName}`);
            return;
        }

        try {
            this.components[componentName] = componentData || {};
            this.componentsList = Object.keys(this.components);
        } catch (error) {
            console.error(`Error adding component ${componentName}:`, error);
        }
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