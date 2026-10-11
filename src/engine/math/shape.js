import Vector2 from "./vector2.js";

class Shape {
    constructor(shapeData, index, defaultSize, engine) {
        var isValidColor = (color) => {
            var s = new Option().style;
            s.color = color;
            return s.color !== '';
        };

        this.name = shapeData.name;
        this.shape = shapeData.shape || 'rectangle';
        
        // Check for correct size properties
        var expectedSizeProps = new Map([
            ['rectangle', ['w', 'h']],
            ['circle', ['r']],
            ['line', ['x1', 'y1', 'x2', 'y2']],
            ['textbox', ['w', 'h']]
        ]).get(this.shape);

        // if game object has a size property at all and it matches the expected props, default to those
        var resolvedSize = shapeData.size;
        if (!resolvedSize && defaultSize && expectedSizeProps.every(prop => defaultSize[prop] !== undefined)) {
            resolvedSize = { ...defaultSize };
        }
        
        if (resolvedSize === undefined && this.shape === 'textbox') resolvedSize = { w: 100, h: 50 };

        if (resolvedSize !== undefined) {
            var missingProps = expectedSizeProps.filter(prop => resolvedSize[prop] === undefined);

            if (missingProps.length > 0) console.error(`Shape data at index ${index} is missing size properties: ${missingProps.join(', ')}.`);
            else this.size = { ...resolvedSize };

        } else console.error(`Shape data at index ${index} is missing size information.`);

        if (this.shape === 'textbox') {
            this.text = shapeData.text ?? '';
            this.font = shapeData.font || 'Arial';
            this.fontSize = shapeData.fontSize || 16;
            this.overflow = shapeData.overflow || 'word wrap';
            this.hAlign = shapeData.hAlign || 'left';
            this.vAlign = shapeData.vAlign || 'top';
        }

        this.color = isValidColor(shapeData.color) ? shapeData.color : 'black';
        this.fill = shapeData.fill !== undefined ? shapeData.fill : true;
        this.strokeSize = shapeData.strokeSize || 1;
        var rawOffset = shapeData.offset;
        var off = rawOffset && rawOffset.x !== undefined && rawOffset.y !== undefined ? rawOffset : { x: 0, y: 0 };
        this.offset = new Vector2(off.x || 0, off.y || 0);
    }
}



export default Shape;