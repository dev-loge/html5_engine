var canvas = document.getElementById('game-canvas');
var engine = new Engine(canvas);

//========Test Scene=========
class TestScene extends Scene {
    constructor() {
        super('Test Scene');

        this.player = {
            components: ['properties', 'playerController'],
            //TODO: This is not working, write code in registerGameObject to define the properties and playerController objects on the game object
            properties: new Properties(engine, this, { 
                                                x: 50,
                                                y: 50,
                                                width: 50,
                                                height: 50,
                                                color: 'red'
                                            }),
            playerController: new PlayerController(engine, this.player),
        }


        this.obstacle = {
            components: [
                'properties'
            ],
            properties: new Properties(engine, this.obstacle, { 
                                                x: 200,
                                                y: 200,
                                                width: 100,
                                                height: 50,
                                                color: 'blue'
                                            })
        }

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