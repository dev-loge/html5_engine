export class Component {
    constructor(gameObject, inputObject, engine, desiredName = null) {
        this.engine = engine;
        this.gameObject = gameObject;
        this.inputObject = inputObject;
        this.type = this.constructor.name.toLowerCase();

        if (desiredName) {
            // Use the provided desired name if it's not already taken
            if (!this.gameObject.components[desiredName]) {
                this.name = desiredName;
            } else {
                // If the desired name is taken, append a suffix
                var suffix = 1;
                while (this.gameObject.components[`${desiredName}${suffix}`]) suffix++;
                this.name = `${desiredName}${suffix}`;
            }
        } else {
            // Default naming based on constructor name
            if (!this.gameObject.components[this.type]) {
                this.name = this.constructor.name;
            } else {
                var baseName = this.constructor.name;
                var suffix = 1;
                while (this.gameObject.components[`${baseName}${suffix}`]) suffix++;
                this.name = `${baseName}${suffix}`;
            }
        }
    }
    
    setName(newName) {
        if (this.gameObject.components[newName]) {
            console.error(`Game objecr already has a component named ${newName}`);
            return false;
        }
    }

    start() {
        // Placeholder for any future logic that should run once when the component is initialized
    }

    update() {
        // Placeholder for any future logic that should run every frame
    }
}