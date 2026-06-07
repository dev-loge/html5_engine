import { Component } from '../engine-parts/component.js';

class Properties extends Component {
    constructor(gameObject, inputObject, engine, desiredName = null) {
        super(gameObject, inputObject, engine, desiredName);
        this.properties = inputObject || {position:{x: 0, y: 0}, size: {w: 0, h: 0}, color: 'black'};
    }
}

export default Properties;