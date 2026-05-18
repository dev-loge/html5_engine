import { Scene } from '../engine/engine-parts/scene.js';
import Player from '../assets/templates/Player.js';
import Door from '../assets/templates/Door.js';
import Obstacle from '../assets/templates/Obstacle.js';

class Level2 extends Scene {
    constructor(engine) {
        super('Level2');
        this.engine = engine;
        
    }

    setupScene() {
        var gameObjects = [
            new Player(this.engine, 225, 225),

            new Door(this.engine, 475, 200, 25, 100, 'brown', 'Level1'),

            new Obstacle(this.engine, 300, 150, 25, 200)
        ];
        console.log(this)
        gameObjects.forEach(obj => this.registerGameObject(obj));
    }

}

export default Level2;