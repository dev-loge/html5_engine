import { getEngineInstance } from './engine-exports.js';

export class Component {
    constructor(gameObject, inputObject) {
        this.engine = getEngineInstance();
        this.gameObject = gameObject;
        this.inputObject = inputObject;
        this.isComponent = true; //used to identify component objects during update loop
    }
    
    update() {
        //Placeholder for component-specific update logic, to be overridden by subclasses
    }
}