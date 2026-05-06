export class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        /*
        this.gl = this.canvas.getContext('webgl');

        if (!this.gl) {
            console.error('WebGL not supported.');
        }
        //*/
    }

    renderFrame(scene) {
        // Placeholder for rendering logic
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        scene.gameObjects.forEach(gameObject => {
            var color = gameObject.getProperty('color') || 'black';
            var x = gameObject.getProperty('x') || 0;
            var y = gameObject.getProperty('y') || 0;
            var width = gameObject.getProperty('width') || 0;
            var height = gameObject.getProperty('height') || 0;

            this.ctx.fillStyle = color;
            this.ctx.fillRect(x, y, width, height);
        });

        /*
        var gl = this.gl;
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        //*/
    }
}