export class Scene {
    constructor(name, sceneData, gameData) {
        this.name = name;
        this.gameObjects = [];
        this.nextObjectId = 0;
    }

    setupScene() {
        // Placeholder for scene setup logic, such as loading assets or initializing game objects
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
}