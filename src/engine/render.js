class Renderer {
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
            this.ctx.fillStyle = gameObject.color;
            this.ctx.fillRect(gameObject.x, gameObject.y, gameObject.width, gameObject.height);
        });

        /*
        var gl = this.gl;
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        //*/
    }
}