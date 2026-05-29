import { Component } from '../engine-parts/component.js';

class Properties extends Component {
    constructor(gameObject, inputObject) {
        super(gameObject, inputObject);
        this.properties = inputObject || {position:{x: 0, y: 0}, width: 0, height: 0, color: 'black'};
    }

    update() {
        // Placeholder for any future logic related to properties, such as constraints or interactions
    }
}

export default Properties;