import * as EngineParts from './engine/engine-parts/engine-exports.js';

const { Engine, Scene, GameObject } = EngineParts;
var canvas = document.getElementById('game-canvas');
var engine = new Engine(canvas);

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

//========Test Scene=========
class TestScene extends Scene {
    constructor() {
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
                events: [
                    (self, other) => {
                        other.setProperty('color', getRandomColor());
                    }
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
            Hitbox: false
        });

        this.registerGameObject(this.player);
        this.registerGameObject(this.obstacle);
    }
}

//========Boot=========


engine.onCreate = function() {
    var testScene = new TestScene();
    engine.registerScene(testScene);
}

engine.start();