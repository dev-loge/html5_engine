import { getEngineInstance } from './utils/engine-instance.js';

export class Component {
    constructor(gameObject, inputObject) {
        this.engine = getEngineInstance();
        this.gameObject = gameObject;
        this.inputObject = inputObject;
    }
    
    update() {
        //Placeholder for component-specific update logic, to be overridden by subclasses
    }
}