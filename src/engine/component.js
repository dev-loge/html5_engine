class Component {
    constructor(engine, gameObject) {
        this.engine = engine;
        this.gameObject = gameObject;
    }
    
    update() {
        //Placeholder for component-specific update logic, to be overridden by subclasses
    }
}