export class Component {
    constructor(engine, gameObject, inputObject) {
        this.engine = engine;
        this.gameObject = gameObject;
        this.inputObject = inputObject;
    }
    
    update() {
        //Placeholder for component-specific update logic, to be overridden by subclasses
    }
}