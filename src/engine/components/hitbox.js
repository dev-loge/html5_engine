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

        var validTypes = ['onEnter', 'isColliding', 'onExit'];
        if (inputObject.type && !validTypes.includes(inputObject.type)) {
            console.warn(`Invalid Hitbox type '${inputObject.type}' in ${gameObject.objId}: expected one of ${validTypes.join(', ')}, defaulting to 'onEnter'`);
        }

        this.type = inputObject.type || 'onEnter';
        this.currentCollisions = new Set();
    }

    checkCollision(hitboxA, hitboxB) {
        return (
            hitboxA.x < hitboxB.x + hitboxB.width &&
            hitboxA.x + hitboxA.width > hitboxB.x &&
            hitboxA.y < hitboxB.y + hitboxB.height &&
            hitboxA.y + hitboxA.height > hitboxB.y
        );
    }

    triggerEvents(otherObject) {
       this.events.forEach(event => {
            if (typeof event === 'function') {
                event(this.gameObject, otherObject);
            } else {
                console.warn(`Invalid event in Hitbox component of ${this.gameObject.objId}: expected a function, got ${typeof event}`);
            }
        });
    }

    update() {
        // Update hitbox position based on game object position and offsets
        this.hitbox.x = this.gameObject.getProperty('x') + this.offsets.x;
        this.hitbox.y = this.gameObject.getProperty('y') + this.offsets.y;

        // Check for collisions with other game objects
        var gameObjectHitboxList = this.engine.currentScene.gameObjects.filter(obj => obj.componentsList.includes('Hitbox') && obj !== this.gameObject);
        gameObjectHitboxList.forEach(otherObject => {
            if (otherObject !== this.gameObject && otherObject.componentsList.includes('Hitbox')) {
                const otherHitbox = otherObject.Hitbox.hitbox;
                if (this.checkCollision(this.hitbox, otherHitbox)) {
                    // Collision detected
                    if (this.type === 'onEnter' && this.currentCollisions.has(otherObject)) {
                        // Already colliding, skip onEnter event
                        return;
                    }
                    this.currentCollisions.add(otherObject);

                    // Trigger events
                    if (this.type !== 'onExit') {
                        this.triggerEvents(otherObject);
                    }

                    
                    
                    
                }

                // Detect if no longer colliding with objects in currentCollisions
                this.currentCollisions.forEach(collidingObject => {
                    if (!this.checkCollision(this.hitbox, collidingObject.Hitbox.hitbox)) {
                        // trigger exit event before removing from currentCollisions to ensure event has access to collidingObject
                        if (this.type === 'onExit') {
                            this.triggerEvents(collidingObject);
                        }
                        this.currentCollisions.delete(collidingObject);
                    }
                });
            }
        });
    }

}

export default Hitbox;