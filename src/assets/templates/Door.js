import { GameObject } from "../../engine/engine-parts/game-object.js";

class Door extends GameObject {
    constructor(engine, x, y, width, height, color, targetScene) {
        super(engine, {
            Properties: {
                x: x,
                y: y,
                width: width,
                height: height,
                color: color
            },
            Hitbox: {
                type: 'onEnter',
                events: [
                    (self, other) => {
                        engine.goToScene(targetScene);
                    }
                ]
            }
        });
    }
}

export default Door;