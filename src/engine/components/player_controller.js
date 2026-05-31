import { Component } from '../engine-parts/component.js';

class PlayerController extends Component {
    constructor(gameObject, inputObject) {  
        super(gameObject, inputObject);
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
        Object.keys(this.controlScheme).forEach(key => {
            if (this.engine.input.isKeyDown(key)) {
                var direction = this.controlScheme[key];
                var axis = direction[1]; // 'x' or 'y'
                var sign = direction[0] === '+' ? 1 : -1;
                
                var currentX = this.gameObject.getPosition('x');
                var currentY = this.gameObject.getPosition('y');
                
                if (axis === 'x') {
                    this.gameObject.setPosition(currentX + sign * this.speed, currentY);
                } else if (axis === 'y') {
                    this.gameObject.setPosition(currentX, currentY + sign * this.speed);
                }
            }
        });
    }
}

export default PlayerController;