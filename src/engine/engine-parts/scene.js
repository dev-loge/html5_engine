import { GameObject } from "./game-object.js";

export class Scene {
    constructor(engine, name, sceneData, gameData) {
        this.engine = engine;
        this.name = name;
        this.data = sceneData;
        this.gameObjects = [];
        this.nextObjectId = 0;
    }

    /*
objData:
{   
    "type": "template",
    "template": "Player.json",
    "templateData": {
        "position": {
            "x": 225,
            "y": 225
        }
    }
},

Template: 
{
    "name": "Player",
    "Properties": {
        "width": 50,
        "height": 50,
        "color": "blue"
    },
    "PlayerController": { "speed": 2 },
    "Hitbox": false
}
*/

    async setupScene() {
        var gameObjects = this.data.objects.map(objData => {
            if (objData.type === 'template') {
                return this.fetchTemplate(objData.template).then(template => {
                    template.Properties.position = objData.templateData.position;
                    return new GameObject(this.engine, template);
                })
            } else {
                //Custom object handling
            }
        });
        var objPromises = await Promise.all(gameObjects);
        objPromises.forEach(obj => this.registerGameObject(obj));
    }

    registerGameObject(gameObject) {
        if (gameObject) {
            gameObject.id = this.nextObjectId++;
            this.gameObjects.push(gameObject);
            return true;
        } else {
            console.error('Failed to register game object:', gameObject);
            return false;
        }
    }

    reset() {
        this.gameObjects = [];
        this.nextObjectId = 0;
    }

    async fetchTemplate(template) {
        var res = await fetch(`./assets/templates/${template}`);
        return await res.json();
    }
}