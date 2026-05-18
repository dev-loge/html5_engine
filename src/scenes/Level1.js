import { Scene } from '../engine/engine-parts/scene.js';
import Player from '../assets/templates/Player.js';
import Door from '../assets/templates/Door.js';

class Level1 extends Scene {
    constructor(engine) {
        super('Level1');
        this.engine = engine;

    }

    setupScene() {
        var gameObjects = [
            new Player(this.engine, 225, 225),

            new Door(this.engine, 0, 200, 25, 100, 'brown', 'Level2')
        ];

        gameObjects.forEach(obj => this.registerGameObject(obj));
    }

}

export default Level1;