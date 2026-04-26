//========Test Scene=========
class TestScene extends Scene {
    constructor() {
        super('Test Scene');

        this.player = {
            x: 50,
            y: 50,
            width: 50,
            height: 50,
            color: 'red',
            speed: 3,
            controlScheme: {
                'w': '-y',
                's': '+y',
                'a': '-x',
                'd': '+x'
            },

            playerController: function() {
                Object.keys(engine.input)
                    .filter(key => engine.input[key] instanceof Set)
                    .forEach(set => {
                        Object.keys(this.controlScheme).forEach(dir => {
                            if(engine.input[set].has(dir)) {
                                this[this.controlScheme[dir][1]] += (this.controlScheme[dir][0] === '+' ? 1 : -1) * this.speed;
                            }
                            //keep the rectangle within the bounds of the canvas
                            this.x = Math.min(Math.max(this.x, 0), canvas.width - this.width);
                            this.y = Math.min(Math.max(this.y, 0), canvas.height - this.height);
                        });
                });
            },
            
            draw: function() {
                engine.canvasCtx.fillStyle = this.color;
                engine.canvasCtx.fillRect(this.x, this.y, this.width, this.height);
            }
        }
        this.obstacle = {
            objId: 'obstacle-rect',
            x: 200,
            y: 200,
            width: 100,
            height: 50,
            color: 'blue',
            draw: function() {
                engine.canvasCtx.fillStyle = this.color;
                engine.canvasCtx.fillRect(this.x, this.y, this.width, this.height);
            }
        }

        this.registerGameObject(this.player);
        this.registerGameObject(this.obstacle);
    }
}

//========Boot=========
var canvas = document.getElementById('game-canvas');
var engine = new Engine(canvas);

engine.onCreate = function() {
    var testScene = new TestScene();
    engine.registerScene(testScene);
}

engine.start();

var GameLoop = function() {
    //=======UPDATE STAGE========
        engine.currentScene.update();

        engine.input.update();

    //=======DRAW STAGE========
        engine.canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
        
        engine.currentScene.draw();
}

setInterval(GameLoop, 1000/60);


/*
var testScene = new Scene('Test Scene');
engine.registerScene(testScene);
engine.currentScene = testScene;
//*/

/*
var contRect = {
    objId: 'controllable-rect',
    x: 50,
    y: 50,
    width: 50,
    height: 50,
    color: 'red',
    speed: 3,
    controlScheme: {
        'w': '-y',
        's': '+y',
        'a': '-x',
        'd': '+x'
    },

    playerController: function() {
        Object.keys(engine.input)
            .filter(key => engine.input[key] instanceof Set)
            .forEach(set => {
                Object.keys(this.controlScheme).forEach(dir => {
                    if(engine.input[set].has(dir)) {
                        this[this.controlScheme[dir][1]] += (this.controlScheme[dir][0] === '+' ? 1 : -1) * this.speed;
                    }
                    //keep the rectangle within the bounds of the canvas
                    this.x = Math.min(Math.max(this.x, 0), canvas.width - this.width);
                    this.y = Math.min(Math.max(this.y, 0), canvas.height - this.height);
                });
        });
    },
    
    draw: function() {
        engine.canvasCtx.fillStyle = this.color;
        engine.canvasCtx.fillRect(this.x, this.y, this.width, this.height);
    }
}
testScene.registerGameObject(contRect);

var obstRect = {
    objId: 'obstacle-rect',
    x: 200,
    y: 200,
    width: 100,
    height: 50,
    color: 'blue',
    draw: function() {
        engine.canvasCtx.fillStyle = this.color;
        engine.canvasCtx.fillRect(this.x, this.y, this.width, this.height);
    }
}
testScene.registerGameObject(obstRect);
//*/



