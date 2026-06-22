import Vector2 from "./vector2.js";

class Shape {
    constructor(shapeData, index, defaultSize, engine) {
        var isValidColor = (color) => {
            var s = new Option().style;
            s.color = color;
            return s.color !== '';
        };

        this.shape = shapeData.shape || 'rectangle';
        
        // Check for correct size properties
        var expectedSizeProps = new Map([
            ['rectangle', ['w', 'h']],
            ['circle', ['r']],
            ['line', ['x1', 'y1', 'x2', 'y2']]
        ]).get(this.shape);

        // if game object has a size property at all and it matches the expected props, default to those
        var resolvedSize = shapeData.size;
        if (!resolvedSize && defaultSize && expectedSizeProps.every(prop => defaultSize[prop] !== undefined)) {
            resolvedSize = { ...defaultSize };
        }
                    
        if (resolvedSize !== undefined) {
            var missingProps = expectedSizeProps.filter(prop => resolvedSize[prop] === undefined);

            if (missingProps.length > 0) console.error(`Shape data at index ${index} is missing size properties: ${missingProps.join(', ')}.`);
            else this.size = { ...resolvedSize };

        } else console.error(`Shape data at index ${index} is missing size information.`);

        this.color = isValidColor(shapeData.color) ? shapeData.color : 'black';
        this.fill = shapeData.fill !== undefined ? shapeData.fill : true;
        this.strokeSize = shapeData.strokeSize || 1;
        var shapeOffset = shapeData.offset &&shapeData.offset.isValidCoords(engine.canvas) ? shapeData.offset : {x: 0, y: 0};
        this.offset = new Vector2(shapeOffset.x || 0, shapeOffset.y || 0);
    }
}



export default Shape;