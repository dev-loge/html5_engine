class Properties extends Component {
    constructor(engine, gameObject, properties) {
        super(engine, gameObject);
        this.properties = properties || {};
    }

    getProperty(key) {
        if (!(key in this.properties)) {
            console.warn(`Property '${key}' not found in game object '${this.gameObject.objId || 'unknown'}'`);
            return undefined;
        }
        return this.properties[key];
    }

    setProperty(key, value) {
        var numericProps = ['x', 'y', 'width', 'height'];

        switch(key) {
            case numericProps.find(prop => prop === key):
                if (typeof value !== 'number') {
                    console.error(`Invalid value for '${key}' property: expected a number, got ${typeof value}`);
                    return;
                }

                if (key === 'x' || key === 'y') {
                    // Ensure the position stays within the canvas bounds
                    value = Math.max(0, Math.min(value, key === 'x' ? this.engine.canvas.width - this.getProperty('width') : this.engine.canvas.height - this.getProperty('height')));
                } else if (key === 'width' || key === 'height') {
                    // Ensure width and height are positive and do not exceed canvas dimensions
                    value = Math.max(1, Math.min(value, key === 'width' ? this.engine.canvas.width - this.getProperty('x') : this.engine.canvas.height - this.getProperty('y')));
                }


                break;
            case 'color':
                if (typeof value !== 'string') {
                    console.error(`Invalid value for 'color' property: expected a string, got ${typeof value}`);
                    return;
                } else if (!/^#([0-9A-F]{3}){1,2}$/i.test(value) && isValidColor(value)) {
                    console.error(`Invalid color format for 'color' property: expected a hex code or color name, got '${value}'`);
                    return;
                }
                break;
        }
        this.properties[key] = value;
    }
}

var isValidColor = (color) => {
    var s = new Option().style;
    s.color = color;
    return s.color !== '';
}