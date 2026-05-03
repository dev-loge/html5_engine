class PlayerController extends Component {
    constructor(engine, gameObject) {  
        super(engine, gameObject);
        this.controlScheme = {
                            'w': '-y',
                            's': '+y',
                            'a': '-x',
                            'd': '+x',
                            'ArrowUp': '-y',
                            'ArrowDown': '+y',
                            'ArrowLeft': '-x',
                            'ArrowRight': '+x'
                        },
        this.speed = 0;
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
        engine.input.inputs.forEach(set => {
            console.log(this.gameObject)
            Object.keys(this.controlScheme).forEach(key => {
                if(engine.input[set].has(key)) {
                    /*
                        controlScheme: {
                            'w': '-y',
                            's': '+y',
                            'a': '-x',
                            'd': '+x',
                            'ArrowUp': '-y',
                            'ArrowDown': '+y',
                            'ArrowLeft': '-x',
                            'ArrowRight': '+x'
                        }

                    */
                    if (this.controlScheme[key][1] === 'x' || this.controlScheme[key][1] === 'y') {
                        var currentValue = this.gameObject.properties.getProperty(this.controlScheme[key][1]) || 0;
                        var newValue = currentValue + (this.controlScheme[key][0] === '+' ? 1 : -1) * this.speed;
                        this.gameObject.properties.setProperty(this.controlScheme[key][1], newValue)
                    }
                }
            });
        });
    }
}