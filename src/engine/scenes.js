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

    update() {
        this.gameObjects.forEach(gameObject => {
            if (gameObject.playerController && typeof gameObject.playerController === 'function') {
                gameObject.playerController();
            }
        });
    }

    draw() {
        this.gameObjects.forEach(gameObject => {
            if (typeof gameObject.draw === 'function') {
                gameObject.draw();
            }
        });
    }

    reset() {
        this.gameObjects = [];
    }
}