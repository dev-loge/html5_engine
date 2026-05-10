import { Component } from '../engine-parts/component.js';

class PlayerController extends Component {
    constructor(engine, gameObject, inputObject) {  
        super(engine, gameObject);
        this.controlScheme = inputObject && inputObject.controlScheme ? inputObject.controlScheme : 
        {
            'w': '-y',
            's': '+y',
            'a': '-x',
            'd': '+x',
            'ArrowUp': '-y',
            'ArrowDown': '+y',
            'ArrowLeft': '-x',
            'ArrowRight': '+x'
        },
        this.speed = inputObject && inputObject.speed ? inputObject.speed : 3;
    }

    setControlScheme(scheme) {
        if (typeof scheme !== 'object' || scheme === null) {
            console.error(`Invalid control scheme: expected an object, got ${typeof scheme}`);
            return;
        }
        this.controlScheme = scheme;
    }

    setSpeed(speed) {
        if (typeof speed !== 'number' || speed < 0) {
            console.error(`Invalid speed value: expected a non-negative number, got ${speed}`);
            return;
        }
        this.speed = speed;
    }

    update() {
        //console.log(`Current Input states: ${this.engine.input.inputs.map(set => `${set}: [${[...this.engine.input[set]].join(', ')}]`).join('; ')}`);
        this.engine.input.inputs.forEach(set => {
            Object.keys(this.controlScheme).forEach(key => {
                if(this.engine.input[set].has(key)) {
                    if (this.controlScheme[key][1] === 'x' || this.controlScheme[key][1] === 'y') {
                        var currentValue = this.gameObject.getProperty(this.controlScheme[key][1]) || 0;
                        var newValue = currentValue + (this.controlScheme[key][0] === '+' ? 1 : -1) * this.speed;
                        this.gameObject.setProperty(this.controlScheme[key][1], newValue)
                    }
                }
            });
        });
    }
}

export default PlayerController;