import { Component } from "../engine-parts/component.js";
import Vector2 from '../math/vector2.js';
import Shape from '../math/shape.js';


export class Draw extends Component {
    constructor(gameObject, inputObject, engine, desiredName = null) {
        super(gameObject, inputObject, engine, desiredName);

        var defaultSize = gameObject.size;

        this.shapes = inputObject.shapes.map((shapeData, index) => new Shape(shapeData, index, defaultSize, engine)) || [new Shape({
                                                                                                                shape: 'rectangle', 
                                                                                                                size: {w: 0, h: 0}, 
                                                                                                                color: 'black',
                                                                                                                fill: true,
                                                                                                                offset: {x: 0, y: 0}
                                                                                                            })];
        var drawOffset = inputObject.offset && inputObject.offset.isValidCoords(engine.canvas) ? inputObject.offset : {x: 0, y: 0};
        this.offset = new Vector2(drawOffset.x || 0, drawOffset.y || 0);
        this.graphic = true;
    }
}

export default Draw;