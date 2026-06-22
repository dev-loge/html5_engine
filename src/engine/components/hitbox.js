import { Component } from "../engine-parts/component.js";
import Vector2 from '../math/vector2.js';

class Hitbox extends Component {
    constructor(gameObject, inputObject, engine, desiredName = null) {
        super(gameObject, inputObject, engine, desiredName);
        this.graphic = false; // for debugging: hitboxes will be rendered as green rectangles (can be turned off in the future)
        
        this.position = gameObject.position;
        this.tags = inputObject.tags || [];
        this.preferredCollisions = inputObject.preferredCollisions || ['onEnter', 'isColliding', 'onExit'];
        
        var hitboxOffset = inputObject.offset && inputObject.offset.isValidCoords(engine.canvas) ? inputObject.offset : {x: 0, y: 0};
        this.offset = new Vector2(hitboxOffset.x || 0, hitboxOffset.y || 0);

        // Check for correct size properties
        this.shape = inputObject.shape ? inputObject.shape : 'default';
        if (this.shape === 'default') {
            switch(true) {
                case 'w' in gameObject.size && 'h' in gameObject.size:
                    this.shape = 'rectangle';
                    break;
                case 'r' in gameObject.size:
                    this.shape = 'circle';
                    break;
                default:
                    console.error(`Unknown size properties for hitbox ${desiredName}`);
            }
        }

        var expectedSizeProps = new Map([
            ['rectangle', ['w', 'h']],
            ['circle', ['r']],
        ]).get(this.shape);
        var defaultSize = gameObject.size;

        // if game object has a size property at all and it matches the expected props, default to those
        if (defaultSize && expectedSizeProps.every(prop => defaultSize[prop] !== undefined)) inputObject.size = inputObject.size || defaultSize;
        if (inputObject.size !== undefined) {
            var missingProps = expectedSizeProps.filter(prop => inputObject.size[prop] === undefined);
            if (missingProps.length > 0) console.error(`Shape data at hitbox ${desiredName} is missing size properties: ${missingProps.join(', ')}.`);
            else this.size = inputObject.size;
        } else console.error(`Shape data at hitbox ${desiredName} is missing size information.`);

        // Internal lifecycle state for each colliding hitbox.
        this.collisionStates = new Map();
        // Public collision view filtered by preferredCollisions.
        this.collisions = new Map();
    }

    getNextCollisionState(previousState, isColliding) {
        if (isColliding) {
            if (previousState == null || previousState === 'onExit') return 'onEnter';
            return 'isColliding';
        }

        if (previousState === 'onExit') return null;
        return previousState == null ? null : 'onExit';
    }

    syncCollisionState(hitbox, state) {
        if (state == null) {
            this.collisionStates.delete(hitbox);
            this.collisions.delete(hitbox);
            return;
        }

        this.collisionStates.set(hitbox, state);

        var thisAllowsState = this.preferredCollisions.includes(state);
        var targetAllowsState = hitbox.preferredCollisions.includes(state);
        if (thisAllowsState && targetAllowsState) this.collisions.set(hitbox, state);
        else this.collisions.delete(hitbox);
    }

    checkCollision(hitboxA, hitboxB) {
        // determine check method based on hitbox shapes
        if (hitboxA.shape === hitboxB.shape) {
            switch(hitboxA.shape) {
                case 'rectangle':
                    var topLeftA = hitboxA.position.add(hitboxA.offset);
                    var w1 = hitboxA.size.w || 0;
                    var h1 = hitboxA.size.h || 0;
                    
                    var topLeftB = hitboxB.position.add(hitboxB.offset);
                    var w2 = hitboxB.size.w || 0;
                    var h2 = hitboxB.size.h || 0;

                    return (
                        topLeftA.x < topLeftB.x + w2 &&
                        topLeftA.x + w1 > topLeftB.x &&
                        topLeftA.y < topLeftB.y + h2 &&
                        topLeftA.y + h1 > topLeftB.y
                    ); 
                case 'circle': 
                    // detect by checking if distance between centers is less than sum of radii
                    var centerA = hitboxA.position.add(hitboxA.offset);
                    var centerB = hitboxB.position.add(hitboxB.offset);
                    var radiusA = hitboxA.size.r || 0;
                    var radiusB = hitboxB.size.r || 0;

                    var delta = centerA.subtract(centerB);
                    var distanceSquared = delta.x * delta.x + delta.y * delta.y;
                    var radiusSum = radiusA + radiusB;

                    return distanceSquared < radiusSum * radiusSum;
                default:
                    console.error(`Unknown hitbox shape: ${hitboxA.shape}`);
                    return false;
            }
        } else {
            // Determine which is circle and which is rectangle
            var circle = hitboxA.shape === 'circle' ? hitboxA : hitboxB;
            var rect = circle === hitboxA ? hitboxB : hitboxA;

            var circleCenter = circle.position.add(circle.offset);
            var rectPos = rect.position;

            // 1. Find the closest point on the rectangle
            var closestX = Math.max(rectPos.x, Math.min(circleCenter.x, rectPos.x + rect.size.w));
            var closestY = Math.max(rectPos.y, Math.min(circleCenter.y, rectPos.y + rect.size.h));

            // 2. Calculate the distance between the closest point and circle center
            var distanceX = circleCenter.x - closestX;
            var distanceY = circleCenter.y - closestY;
            var distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);

            // 3. Check if the distance is less than or equal to the circle's radius
            return distanceSquared < (circle.size.r * circle.size.r);
        }
    }

    update() {
        // Update hitbox position based on game object position and offsets
        this.position = this.gameObject.position;

        // Track currently colliding objects
        var currentlyColliding = new Set();

        // Check for collisions with other game objects 
        //get all other hitboxes on different game objects
        var hitboxList = this.engine.currentScene.gameObjects.flatMap(obj => obj.getComponentsByType('hitbox').map(hitbox => ({hitbox, gameObject: obj}))).filter(entry => entry.gameObject !== this.gameObject);
        for (var obj of hitboxList) {
            var hitbox = obj.hitbox;
            if (this.checkCollision(this, hitbox)) {
                currentlyColliding.add(hitbox);
                var prevState = this.collisionStates.get(hitbox);
                var nextState = this.getNextCollisionState(prevState, true);
                this.syncCollisionState(hitbox, nextState);
            }
        }

        // Handle collisions that ended
        for (var [collision, state] of Array.from(this.collisionStates.entries())) {
            if (currentlyColliding.has(collision)) continue;

            var nextState = this.getNextCollisionState(state, false);
            this.syncCollisionState(collision, nextState);
        }
    }

}

export default Hitbox;