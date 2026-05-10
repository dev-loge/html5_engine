import { Scene } from '../src/engine/engine-parts/scene.js';
import { GameObject } from '../src/engine/engine-parts/game-object.js';

class TestScene extends Scene {
    constructor(engine) {
        super('Test Scene');

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
                type: 'onExit',
                events: [
                    /*
                    (self, other) => {
                        other.setProperty('color', getRandomColor());
                    }
                    //*/
                ]

            }
        });

        this.obstacle = new GameObject(engine, {
            Properties: { 
                x: 200,
                y: 200,
                width: 100,
                height: 50,
                color: 'blue'
            },
            Hitbox: {
                type: 'onEnter',
                events: [
                    (self, other) => {
                        console.log('Player entered obstacle hitbox, switching to Test Scene 2');
                        engine.goToScene('Test Scene2');
                    }
                ]
            }
        });

        this.registerGameObject(this.player);
        this.registerGameObject(this.obstacle);
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

export default TestScene;