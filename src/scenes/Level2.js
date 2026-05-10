import { Scene } from '../engine/engine-parts/scene.js';
import { GameObject } from '../engine/engine-parts/game-object.js';

class Level2 extends Scene {
    constructor(engine) {
        super('Level2');

        this.player = new GameObject(engine, {
            Properties: {  
                x: 225,
                y: 225,
                width: 50,
                height: 50,
                color: 'red'
            },
            PlayerController: {speed: 2},
            Hitbox: false
        });

        this.door = new GameObject(engine, {
            Properties: { 
                x: 475,
                y: 200,
                width: 25,
                height: 100,
                color: 'brown'
            },
            Hitbox: {
                type: 'onEnter',
                events: [
                    (self, other) => {
                        engine.goToScene('Level1');
                    }
                ]
            }
        });

        this.registerGameObject(this.door);

        this.registerGameObject(this.player);
    }
}

export default Level2;