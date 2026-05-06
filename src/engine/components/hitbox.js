import { Component } from "../engine-parts/component.js";

class Hitbox extends Component {
    constructor(engine, gameObject, inputObject) {
        super(engine, gameObject, inputObject);
        this.hitbox = {
            x: inputObject.x || gameObject.getProperty('x'),
            y: inputObject.y || gameObject.getProperty('y'),
            width: inputObject.width || gameObject.getProperty('width'),
            height: inputObject.height || gameObject.getProperty('height')
        };
        this.offsets = {
            x: this.hitbox.x - gameObject.getProperty('x'),
            y: this.hitbox.y - gameObject.getProperty('y')
        };

        this.events = inputObject.events || [];
    }

    checkCollision(hitboxA, hitboxB) {
        return (
            hitboxA.x < hitboxB.x + hitboxB.width &&
            hitboxA.x + hitboxA.width > hitboxB.x &&
            hitboxA.y < hitboxB.y + hitboxB.height &&
            hitboxA.y + hitboxA.height > hitboxB.y
        );
    }

    update() {
        // Update hitbox position based on game object position and offsets
        this.hitbox.x = this.gameObject.getProperty('x') + this.offsets.x;
        this.hitbox.y = this.gameObject.getProperty('y') + this.offsets.y;

        // Check for collisions with other game objects
        this.engine.currentScene.gameObjects.forEach(otherObject => {
            if (otherObject !== this.gameObject && otherObject.componentsList.includes('Hitbox')) {
                const otherHitbox = otherObject.Hitbox.hitbox;
                if (this.checkCollision(this.hitbox, otherHitbox)) {
                    this.events.forEach(event => {
                        if (typeof event === 'function') {
                            event(this.gameObject, otherObject);
                        } else {
                            console.warn(`Invalid event in Hitbox component of ${this.gameObject.objId}: expected a function, got ${typeof event}`);
                        }
                    });
                }
            }
        });
    }

}

export default Hitbox;