import { Component } from "../engine-parts/component.js";

class Hitbox extends Component {
    constructor(gameObject, inputObject, engine, desiredName = null) {
        super(gameObject, inputObject, engine, desiredName);

        this.shape = inputObject.shape ? inputObject.shape : 'rectangle';
        this.position = gameObject.position;
        this.offset = isValidCoords(inputObject.offset, this.engine) ? inputObject.offset : {x: 0, y: 0};
        this.tags = inputObject.tags || [];
        
        this.graphic = false; // for debugging: hitboxes will be rendered as green rectangles (can be turned off in the future)

        // Check for correct size properties
        var expectedSizeProps = new Map([
            ['rectangle', ['w', 'h']],
            ['circle', ['r']],
        ]).get(this.shape);
        var defaultSize = gameObject.size;

        // if game object has a size property at all and it matches the expected props, default to those
        if (defaultSize && expectedSizeProps.every(prop => defaultSize[prop] !== undefined)) inputObject.size = inputObject.size || defaultSize;
                    
        if (inputObject.size !== undefined) {
            var missingProps = expectedSizeProps.filter(prop => inputObject.size[prop] === undefined);
            if (missingProps.length > 0) console.error(`Shape data at index ${index} is missing size properties: ${missingProps.join(', ')}.`);
            else this.size = inputObject.size;
        } else console.error(`Shape data at index ${index} is missing size information.`);

        // Map of colliding hitboxes: { gameObject -> 'onEnter' | 'isColliding' | 'onExit' }
        this.collisions = new Map();
    }

    checkCollision(hitboxA, hitboxB) {
        // determine check method based on hitbox shapes
        if (hitboxA.shape === hitboxB.shape) {
            switch(hitboxA.shape) {
                case 'rectangle':
                    var x1 = hitboxA.position.x + hitboxA.offset.x;
                    var y1 = hitboxA.position.y + hitboxA.offset.y;
                    var w1 = hitboxA.size.w || 0;
                    var h1 = hitboxA.size.h || 0;
                    
                    var x2 = hitboxB.position.x + hitboxB.offset.x;
                    var y2 = hitboxB.position.y + hitboxB.offset.y;
                    var w2 = hitboxB.size.w || 0;
                    var h2 = hitboxB.size.h || 0;

                    return (
                        x1 < x2 + w2 &&
                        x1 + w1 > x2 &&
                        y1 < y2 + h2 &&
                        y1 + h1 > y2
                    ); 
                case 'circle': 
                    // detect by checking if distance between centers is less than sum of radii
                    var centerA = {
                        x: hitboxA.position.x + hitboxA.offset.x,
                        y: hitboxA.position.y + hitboxA.offset.y
                    };
                    var centerB = {
                        x: hitboxB.position.x + hitboxB.offset.x,
                        y: hitboxB.position.y + hitboxB.offset.y
                    };
                    var radiusA = hitboxA.size.r || 0;
                    var radiusB = hitboxB.size.r || 0;

                    var dx = centerA.x - centerB.x;
                    var dy = centerA.y - centerB.y;
                    var distanceSquared = dx * dx + dy * dy;
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

            // 1. Find the closest point on the rectangle
            var closestX = Math.max(rect.position.x, Math.min(circle.position.x + circle.offset.x, rect.position.x + rect.size.w));
            var closestY = Math.max(rect.position.y, Math.min(circle.position.y + circle.offset.y, rect.position.y + rect.size.h));

            // 2. Calculate the distance between the closest point and circle center
            var distanceX = circle.position.x + circle.offset.x - closestX;
            var distanceY = circle.position.y + circle.offset.y - closestY;
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
                // Update collision state
                if (!this.collisions.has(hitbox)) {
                    // New collision
                    this.collisions.set(hitbox, 'onEnter');
                } else if (this.collisions.get(hitbox) === 'onEnter') {
                    // Transition from onEnter to isColliding
                    this.collisions.set(hitbox, 'isColliding');
                }
            }
        }

        // Handle collisions that ended
        for (var collision of this.collisions.keys()) {
            var thisFrame = false;
            if (!currentlyColliding.has(collision)) {
                // No longer colliding
                thisFrame = true;
                this.collisions.set(collision, 'onExit');
            }
            // Remove onExit collisions (after marking them for one frame)
            if (this.collisions.get(collision) === 'onExit' && !thisFrame) {
                this.collisions.delete(collision);
            }
        }
    }

}

var isValidCoords = (coords, engine) => {
    if (typeof coords !== 'object' || coords.x === undefined || coords.y === undefined) {
        return false;
    }
    return true;
}

export default Hitbox;