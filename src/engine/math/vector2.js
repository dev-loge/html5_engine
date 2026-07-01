
class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    add(other) {
        return new Vector2(this.x + other.x, this.y + other.y);
    }

    subtract(other) {
        return new Vector2(this.x - other.x, this.y - other.y);
    }

    scale(scalar) {
        return new Vector2(this.x * scalar, this.y * scalar);
    }

    isValidCoords(canvas, clamp) {
        if (typeof this !== 'object' || this.x === undefined || this.y === undefined) {
            return false;
        }
        if (clamp) {
            //ensure coords are within canvas bounds
            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                return false;
            }
        }
        return true;
    }

    isInsideCircle(center, radius) {
        var dSquared = (this.x - center.x) ** 2 + (this.y - center.y) ** 2;
        return dSquared <= radius ** 2;
    }
}

export default Vector2;