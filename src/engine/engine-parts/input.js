export class InputManager {
    constructor() {
        // Keyboard state
        this.keysDown = new Set();
        this.keysPressed = new Set();
        this.keysReleased = new Set();
        
        // Mouse state
        this.mouseButtonsDown = new Set();
        this.mouseButtonsPressed = new Set();
        this.mouseButtonsReleased = new Set();
        this.mousePosition = { x: 0, y: 0 };

        // Setup keyboard listeners
        window.addEventListener('keydown', (event) => {
            if (!this.keysDown.has(event.key)) {
                this.keysPressed.add(event.key);
            }
            this.keysDown.add(event.key);
        });

        window.addEventListener('keyup', (event) => {
            this.keysDown.delete(event.key);
            this.keysReleased.add(event.key);
        });

        // Setup mouse listeners
        window.addEventListener('mousedown', (event) => {
            var button = this.getMouseButtonName(event.button);
            if (!this.mouseButtonsDown.has(button)) {
                this.mouseButtonsPressed.add(button);
            }
            this.mouseButtonsDown.add(button);
        });

        window.addEventListener('mouseup', (event) => {
            var button = this.getMouseButtonName(event.button);
            this.mouseButtonsDown.delete(button);
            this.mouseButtonsReleased.add(button);
        });

        window.addEventListener('mousemove', (event) => {
            this.mousePosition = { x: event.clientX, y: event.clientY };
        });
    }

    getMouseButtonName(buttonCode) {
        switch(buttonCode) {
            case 0: return 'left';
            case 1: return 'middle';
            case 2: return 'right';
            default: return `button${buttonCode}`;
        }
    }

    // Keyboard query methods
    isKeyDown(key) {
        return this.keysDown.has(key);
    }

    isKeyPressed(key) {
        return this.keysPressed.has(key);
    }

    isKeyReleased(key) {
        return this.keysReleased.has(key);
    }

    // Mouse query methods
    isMouseButtonDown(button) {
        return this.mouseButtonsDown.has(button);
    }

    isMouseButtonPressed(button) {
        return this.mouseButtonsPressed.has(button);
    }

    isMouseButtonReleased(button) {
        return this.mouseButtonsReleased.has(button);
    }

    getMousePosition() {
        return { ...this.mousePosition };
    }

    update() {
        // Clear single-frame events at the end of each frame
        this.keysPressed.clear();
        this.keysReleased.clear();
        this.mouseButtonsPressed.clear();
        this.mouseButtonsReleased.clear();
    }
}