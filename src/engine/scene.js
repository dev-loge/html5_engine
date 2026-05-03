class Scene {
    constructor(name) {
        this.name = name;
        this.gameObjects = [];
    }

    registerGameObject(gameObject) {
        if (gameObject) {
            this.gameObjects.push(gameObject);
            return true;
        } else {
            console.error('Failed to register game object:', gameObject);
            return false;
        }
    }

    reset() {
        this.gameObjects = [];
    }
}