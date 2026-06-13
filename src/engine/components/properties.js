import { Component } from '../engine-parts/component.js';

class Properties extends Component {
    constructor(gameObject, inputObject, engine, desiredName = null) {
        super(gameObject, inputObject, engine, desiredName);

        if (!inputObject.position) inputObject.position = {x: 0, y: 0};

        this.properties = inputObject || {position:{x: 0, y: 0}};
    }
}

export default Properties;