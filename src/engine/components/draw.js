import { Component } from "../engine-parts/component.js";

class shape {
    constructor(shapeData, index, defaultSize, engine) {
        this.shape = shapeData.shape || 'rectangle';
        
        // Check for correct size properties
        var expectedSizeProps = new Map([
            ['rectangle', ['w', 'h']],
            ['circle', ['r']],
            ['line', ['x1', 'y1', 'x2', 'y2']]
        ]).get(this.shape);

        // if game object has a size property at all and it matches the expected props, default to those
        if (defaultSize && expectedSizeProps.every(prop => defaultSize[prop] !== undefined)) shapeData.size = shapeData.size || defaultSize;
                    
        if (shapeData.size !== undefined) {
            var missingProps = expectedSizeProps.filter(prop => shapeData.size[prop] === undefined);

            if (missingProps.length > 0) console.error(`Shape data at index ${index} is missing size properties: ${missingProps.join(', ')}.`);
            else this.size = shapeData.size;

        } else console.error(`Shape data at index ${index} is missing size information.`);

        this.color = isValidColor(shapeData.color) ? shapeData.color : 'black';
        this.fill = shapeData.fill !== undefined ? shapeData.fill : true;
        this.strokeSize = shapeData.strokeSize || 1;
        this.offset = isValidCoords(shapeData.offset, false, engine) ? shapeData.offset : {x: 0, y: 0};
    }
}

export class Draw extends Component {
    constructor(gameObject, inputObject, engine, desiredName = null) {
        super(gameObject, inputObject, engine, desiredName);

        var defaultSize = gameObject.size;

        this.shapes = inputObject.shapes.map((shapeData, index) => new shape(shapeData, index, defaultSize, engine)) || [new shape({
                                                                                                                shape: 'rectangle', 
                                                                                                                size: {w: 0, h: 0}, 
                                                                                                                color: 'black',
                                                                                                                fill: true,
                                                                                                                offset: {x: 0, y: 0}
                                                                                                            })];
        this.offset = isValidCoords(inputObject.offset, true) ? inputObject.offset : {x: 0, y: 0};
        this.graphic = true;
    }
}

var isValidColor = (color) => {
    var s = new Option().style;
    s.color = color;
    return s.color !== '';
}

var isValidCoords = (coords, clamp, engine) => {
    if (typeof coords !== 'object' || coords.x === undefined || coords.y === undefined) {
        return false;
    }
    if (clamp) {
        //ensure coords are within canvas bounds
        if (coords.x < 0 || coords.x > engine.canvas.width || coords.y < 0 || coords.y > engine.canvas.height) {
            return false;
        }
    }
    return true;
}

export default Draw;