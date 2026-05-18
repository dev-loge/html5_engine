import { GameObject } from '../../engine/engine-parts/game-object.js';

class Player extends GameObject {
    constructor(engine, x, y) {
        super(engine, {
            Properties: {
                x: x,
                y: y,
                width: 50,
                height: 50,
                color: 'blue'
            },
            PlayerController: { speed: 2 },
            Hitbox: false
        });
    }
}

export default Player;