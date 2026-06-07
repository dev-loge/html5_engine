import { Component } from "../engine-parts/component.js";

class Hitbox extends Component {
    constructor(gameObject, inputObject, engine, desiredName = null) {
        super(gameObject, inputObject, engine, desiredName);
        this.hitbox = {
            x: inputObject.x || gameObject.getPosition('x'),
            y: inputObject.y || gameObject.getPosition('y'),
            width: inputObject.width || gameObject.getProperty('size').w,
            height: inputObject.height || gameObject.getProperty('size').h
        };
        this.offsets = {
            x: this.hitbox.x - gameObject.getPosition('x'),
            y: this.hitbox.y - gameObject.getPosition('y')
        };

        // Map of colliding hitboxes: { gameObject -> 'onEnter' | 'isColliding' | 'onExit' }
        this.collisions = new Map();
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
        this.hitbox.x = this.gameObject.getPosition('x') + this.offsets.x;
        this.hitbox.y = this.gameObject.getPosition('y') + this.offsets.y;

        // Track currently colliding objects
        const currentlyColliding = new Set();

        // Check for collisions with other game objects
        var gameObjectHitboxList = this.engine.currentScene.gameObjects.filter(obj => {
            const hitboxComponent = obj.getComponentByType('hitbox');
            return hitboxComponent && obj !== this.gameObject;
        });

        gameObjectHitboxList.forEach(otherObject => {
            const otherHitboxComponent = otherObject.getComponentByType('hitbox');
            if (otherHitboxComponent) {
                const otherHitbox = otherHitboxComponent.hitbox;
                if (this.checkCollision(this.hitbox, otherHitbox)) {
                    currentlyColliding.add(otherObject);
                    
                    // Update collision state
                    if (!this.collisions.has(otherObject)) {
                        // New collision
                        this.collisions.set(otherObject, 'onEnter');
                    } else if (this.collisions.get(otherObject) === 'onEnter') {
                        // Transition from onEnter to isColliding
                        this.collisions.set(otherObject, 'isColliding');
                    }
                    // else: already isColliding, no change
                }
            }
        });

        // Handle collisions that ended
        this.collisions.forEach((state, otherObject) => {
            if (!currentlyColliding.has(otherObject)) {
                // No longer colliding
                this.collisions.set(otherObject, 'onExit');
            }
        });

        // Remove onExit collisions (after marking them for one frame)
        this.collisions.forEach((state, otherObject) => {
            if (state === 'onExit') {
                this.collisions.delete(otherObject);
            }
        });
    }

}

export default Hitbox;