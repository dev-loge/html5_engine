import Vector2 from '../math/vector2.js';

export class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        this.renderLayers = [];
        /*
        this.gl = this.canvas.getContext('webgl');

        if (!this.gl) {
            console.error('WebGL not supported.');
        }
        //*/
    }

    setRenderLayers(layers) {
        this.renderLayers = layers;
    }

    renderFrame(scene) {
        var ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (var layer of this.renderLayers) {

            for (var gameObject of scene.gameObjects) {
                var objPos = gameObject.position;

                for (var component of Object.values(gameObject.components)) {
                    if (component && component.renderLayers && component.renderLayers.includes(layer.name)) {
                        var compPos = objPos.add(component.offset || new Vector2(0, 0));
                        var objectRotation = gameObject.worldRotation ?? gameObject.rotation ?? 0;
                        var componentRotation = component.rotation || 0;

                        // apply transformations for the component
                        ctx.save();
                        ctx.lineWidth = 1;
                        ctx.translate(objPos.x, objPos.y);
                        ctx.rotate(objectRotation);
                        ctx.translate(-objPos.x, -objPos.y);
                        ctx.translate(compPos.x, compPos.y);
                        ctx.rotate(componentRotation);
                        ctx.translate(-compPos.x, -compPos.y);
                        
                        // hitbox visualization tool
                        if (component.type === 'hitbox') {
                            ctx.fillStyle = 'green';
                            ctx.strokeStyle = 'green';
                            ctx.lineWidth = 2;

                            switch(component.shape) {
                                case 'rectangle':
                                    ctx.strokeRect(compPos.x, compPos.y, component.size.w, component.size.h);
                                    break;
                                case 'circle':
                                    ctx.beginPath();
                                    ctx.arc(compPos.x, compPos.y, component.size.r, 0, 2 * Math.PI);
                                    ctx.stroke();
                                    break;
                                default:
                                    console.error(`Unknown hitbox shape: ${component.shape}`);
                            }
                        }

                        // render shapes (Draw comp)
                        if (component.shapes) {
                            for (var shape of component.shapes) {
                                var shapePos = compPos.add(shape.offset || new Vector2(0, 0));
                                //if (gameObject.name === "Player") console.log(`Shape ${shape.shape}: `, shapePos);
                                ctx.fillStyle = shape.color;
                                ctx.strokeStyle = shape.color;
                                ctx.lineWidth = shape.strokeSize;
                                switch(shape.shape) {
                                    case 'rectangle':
                                        if (shape.fill) 
                                            ctx.fillRect(shapePos.x, shapePos.y, shape.size.w, shape.size.h);
                                        else 
                                            ctx.strokeRect(shapePos.x, shapePos.y, shape.size.w, shape.size.h);
                                        break;
                                    case 'circle':
                                        if (shape.fill) {
                                            ctx.beginPath();
                                            ctx.arc(shapePos.x, shapePos.y, shape.size.r, 0, 2 * Math.PI);
                                            ctx.fill();
                                        } else {
                                            ctx.beginPath();
                                            ctx.arc(shapePos.x, shapePos.y, shape.size.r, 0, 2 * Math.PI);
                                            ctx.stroke();
                                        }
                                        break;
                                    case 'line':
                                        ctx.beginPath();
                                        ctx.moveTo(shapePos.x + shape.size.x1, shapePos.y + shape.size.y1);
                                        ctx.lineTo(shapePos.x + shape.size.x2, shapePos.y + shape.size.y2);
                                        ctx.stroke();
                                        break;
                                    default:
                                        console.error(`Unknown shape type: ${shape.shape}`);
                                }
                            }
                        }

                        // render text
                        if (component.text) {
                            ctx.fillStyle = component.color || '#ffffff';
                            ctx.font = `${component.fontSize || 16}px ${component.font || 'Arial'}`;
                            ctx.textBaseline = 'hanging';

                            // text wrapping logic
                            switch (component.overflow) {
                                case 'word wrap':
                                    var words = component.text.split(' ');
                                    var line = '';
                                    var y = compPos.y;
                                    for (var n = 0; n < words.length; n++) {
                                        var testLine = line + words[n] + ' ';
                                        var metrics = ctx.measureText(testLine);
                                        var testWidth = metrics.width;
                                        if (testWidth > component.size.w && n > 0) {
                                            ctx.fillText(line, compPos.x, y);
                                            line = words[n] + ' ';
                                            y += component.fontSize || 16;
                                        } else {
                                            line = testLine;
                                        }
                                    }
                                    ctx.fillText(line, compPos.x, y);
                                    break;

                                case 'character wrap':
                                    var chars = component.text.split('');
                                    var line = '';
                                    var y = compPos.y;
                                    for (var n = 0; n < chars.length; n++) {
                                        var testLine = line + chars[n];
                                        var metrics = ctx.measureText(testLine);
                                        var testWidth = metrics.width;
                                        if (testWidth > component.size.w && n > 0) {
                                            ctx.fillText(line, compPos.x, y);
                                            line = chars[n];
                                            y += component.fontSize || 16;
                                        } else {
                                            line = testLine;
                                        }
                                    }
                                    ctx.fillText(line, compPos.x, y);
                                    break;

                                case 'clip':
                                    ctx.save();
                                    ctx.beginPath();
                                    ctx.rect(compPos.x, compPos.y, component.size.w, component.size.h);
                                    ctx.clip();
                                    ctx.fillText(component.text, compPos.x, compPos.y);
                                    ctx.restore();
                                    break;

                                case 'none':
                                    ctx.fillText(component.text, compPos.x, compPos.y);
                                    break;
                                    
                                default:
                                    console.error(`Unknown overflow type: ${component.overflow}`);
                                    break;
                            }
                        }
                        // additional rendering logic

                        ctx.restore();
                    }
                    }
            }

        }



        /*
        var gl = this.gl;
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        //*/
    }
}