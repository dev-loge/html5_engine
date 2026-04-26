class InputManager {
    constructor() {
        this.keyPressed = new Set();
        this.keyDown = new Set();
        this.keyReleased = new Set();

        window.addEventListener('keydown', (event) => {
            this.keyPressed.add(event.key);
            this.keyDown.add(event.key);
        });

        window.addEventListener('keyup', (event) => {
            this.keyPressed.delete(event.key);
            this.keyDown.delete(event.key);
            this.keyReleased.add(event.key);
        });

        this.inputs = Object.keys(this).filter(key => this[key] instanceof Set);
    }

    update() {
        // clearing input end of frame
        /*
        this.inputs.forEach(input => {
            this[input].clear();
        });
        //*/

    }
}