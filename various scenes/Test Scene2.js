import { Scene } from '../src/engine/engine-parts/scene.js';
import { GameObject } from '../src/engine/engine-parts/game-object.js';

class TestScene2 extends Scene {
    constructor(engine) {
        super('Test Scene2');

        this.player = new GameObject(engine, {
            Properties: {  
                x: 50,
                y: 50,
                width: 50,
                height: 50,
                color: 'red'
            },
            PlayerController: false,
            Hitbox: {
                type: 'isColliding',
                events: [
                    /*
                    (self, other) => {
                        other.setProperty('color', getRandomColor());
                    }
                    //*/
                ]

            }
        });

        this.obstacle1 = new GameObject(engine, {
            Properties: { 
                x: 100,
                y: 200,
                width: 50,
                height: 50,
                color: 'blue'
            },
            Hitbox: {
                type: 'onEnter',
                events: [
                    (self, other) => {
                        engine.goToScene('Test Scene');
                    }
                ]
            }
        });

        this.obstacle2 = new GameObject(engine, {
            Properties: { 
                x: 300,
                y: 200,
                width: 50,
                height: 50,
                color: 'green'
            },
            Hitbox: false
        });

        this.registerGameObject(this.player);
        this.registerGameObject(this.obstacle1);
        this.registerGameObject(this.obstacle2);
    }
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

export default TestScene2;