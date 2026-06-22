
import Vector2 from './vector2.js';

class Raycast {
    constructor(origin, direction, range = Infinity, limit = Infinity) {
        this.engine = window.__engine;
        this.origin = origin instanceof Vector2 ? origin : new Vector2(origin.x || 0, origin.y || 0);
        this.direction = direction instanceof Vector2 ? direction : new Vector2(direction.x || 0, direction.y || 0);
        this.range = range;
        this.limit = limit;

        this.hits = this.cast();
    }

    cast() {
        if (!this.engine || !this.engine.currentScene) return [];

        var hits = [];

        for (var gameObject of this.engine.currentScene.gameObjects) {
            var objHitboxes = gameObject.getComponentsByType('hitbox');
            for (var hitbox of objHitboxes) {
                var hit = this.checkIntersection(hitbox, gameObject);
                if (hit) hits.push(hit);
            }
        }

        hits.sort((a, b) => a.distance - b.distance);
        if (Number.isFinite(this.limit)) return hits.slice(0, Math.max(0, this.limit));
        return hits;
    }

    checkIntersection(hitbox, gameObject) {
        if (!hitbox || !hitbox.shape) return null;

        switch (hitbox.shape) {
            case 'circle':
                return this._checkCircle(hitbox, gameObject);
            case 'rectangle':
                return this._checkRectangle(hitbox, gameObject);
            default:
                return null;
        }
    }

    _checkCircle(hitbox, gameObject) {
        function dot(a, b) {
            return a.x * b.x + a.y * b.y;
        }

        var center = hitbox.position instanceof Vector2 ? hitbox.position : new Vector2(hitbox.position.x || 0, hitbox.position.y || 0);
        center = center.add(hitbox.offset instanceof Vector2 ? hitbox.offset : new Vector2(hitbox.offset.x || 0, hitbox.offset.y || 0));
        var radius = hitbox.size && hitbox.size.r ? hitbox.size.r : 0;

        var oc = this.origin.subtract(center);
        var a = dot(this.direction, this.direction);
        var b = 2 * dot(oc, this.direction);
        var c = dot(oc, oc) - radius * radius;

        var discriminant = b * b - 4 * a * c;
        if (discriminant < 0) return null;

        var sqrtD = Math.sqrt(discriminant);
        var t1 = (-b - sqrtD) / (2 * a);
        var t2 = (-b + sqrtD) / (2 * a);

        var distance = null;
        if (t1 >= 0) distance = t1;
        else if (t2 >= 0) distance = t2;

        if (distance == null || distance > this.range) return null;

        var point = this.origin.add(this.direction.scale(distance));
        return {
            gameObject,
            hitbox,
            point,
            distance,
            shape: 'circle'
        };
    }

    _checkRectangle(hitbox, gameObject) {
        function intersectSlab(origin, direction, min, max, tMin, tMax) {
            if (Math.abs(direction) < 1e-8) {
                if (origin < min || origin > max) return { hit: false, tMin, tMax };
                return { hit: true, tMin, tMax };
            }

            var t1 = (min - origin) / direction;
            var t2 = (max - origin) / direction;
            var near = Math.min(t1, t2);
            var far = Math.max(t1, t2);

            var nextMin = Math.max(tMin, near);
            var nextMax = Math.min(tMax, far);

            if (nextMin > nextMax) return { hit: false, tMin: nextMin, tMax: nextMax };
            return { hit: true, tMin: nextMin, tMax: nextMax };
        }

        var topLeft = hitbox.position instanceof Vector2 ? hitbox.position : new Vector2(hitbox.position.x || 0, hitbox.position.y || 0);
        topLeft = topLeft.add(hitbox.offset instanceof Vector2 ? hitbox.offset : new Vector2(hitbox.offset.x || 0, hitbox.offset.y || 0));
        var width = hitbox.size && hitbox.size.w ? hitbox.size.w : 0;
        var height = hitbox.size && hitbox.size.h ? hitbox.size.h : 0;

        var minX = topLeft.x;
        var minY = topLeft.y;
        var maxX = topLeft.x + width;
        var maxY = topLeft.y + height;

        var tMin = 0;
        var tMax = this.range;

        var slabX = intersectSlab(this.origin.x, this.direction.x, minX, maxX, tMin, tMax);
        if (!slabX.hit) return null;
        tMin = slabX.tMin;
        tMax = slabX.tMax;

        var slabY = intersectSlab(this.origin.y, this.direction.y, minY, maxY, tMin, tMax);
        if (!slabY.hit) return null;
        tMin = slabY.tMin;

        if (tMin < 0 || tMin > this.range) return null;

        var point = this.origin.add(this.direction.scale(tMin));
        return {
            gameObject,
            hitbox,
            point,
            distance: tMin,
            shape: 'rectangle'
        };
    }
}





export default Raycast;