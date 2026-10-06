import { Component } from '../engine-parts/component.js';
import Vector2 from '../math/vector2.js';

export class TextBox extends Component {
    constructor(gameObject, inputObject, engine, desiredName=null) {
        super(gameObject, inputObject, engine, desiredName);

        this.renderLayers = inputObject.renderLayers || [engine.settings.renderLayers[1].name];

        // text box can only be a rect, so can only accept size as {w, h}
        var gos = gameObject.size || {w: 0, h: 0};
        if (!inputObject.size) {
            // check gos for w & h
            inputObject.size = {w: gos.w || 100, h: gos.h || 50};
        }
        this.size = inputObject.size;
        
        this.text = inputObject.text || '';
        this.font = inputObject.font || 'Arial';
        this.fontSize = inputObject.fontSize || 16;
        this.color = inputObject.color || '#ffffff';
        this.overflow = inputObject.overflow || 'word wrap';
        this.hAlign = inputObject.hAlign || 'left';
        this.vAlign = inputObject.vAlign || 'top';

        var iofs = inputObject.offset ? 
            new Vector2(inputObject.offset.x || 0, inputObject.offset.y || 0) : new Vector2(0, 0);
        var drawOffset = iofs && iofs.isValidCoords(engine.canvas) ? iofs : {x: 0, y: 0};
        this.offset = new Vector2(drawOffset.x || 0, drawOffset.y || 0);;

    }
}

export default TextBox;