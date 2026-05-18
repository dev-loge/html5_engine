import { GameObject } from "../../engine/engine-parts/game-object.js";

class Obstacle extends GameObject {
    constructor(engine, x, y, width, height) {
        super(engine, {
            Properties: {
                x: x,
                y: y,
                width: width,
                height: height,
                color: 'red'
            },
            Hitbox: {
                type: 'onEnter',
                events: [
                    (self, other) => {
                        this.destroy();
                    }
                ]
            }
        });
    }
}

export default Obstacle;