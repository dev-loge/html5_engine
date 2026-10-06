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
                            var fontSize = component.fontSize || 16;
                            var lineHeight = fontSize;
                            ctx.font = `${fontSize}px ${component.font || 'Arial'}`;
                            ctx.textAlign = ['left', 'center', 'right'].includes(component.hAlign)
                                ? component.hAlign
                                : 'left';
                            ctx.textBaseline = 'top';

                            var lines = [];
                            switch (component.overflow) {
                                case 'word wrap':
                                    var words = component.text.split(' ');
                                    var line = '';
                                    for (var word of words) {
                                        var testLine = line ? `${line} ${word}` : word;
                                        if (line && ctx.measureText(testLine).width > component.size.w) {
                                            lines.push(line);
                                            line = word;
                                        } else {
                                            line = testLine;
                                        }
                                    }
                                    lines.push(line);
                                    break;

                                case 'character wrap':
                                    var line = '';
                                    for (var character of Array.from(component.text)) {
                                        var testLine = line + character;
                                        if (line && ctx.measureText(testLine).width > component.size.w) {
                                            lines.push(line);
                                            line = character;
                                        } else {
                                            line = testLine;
                                        }
                                    }
                                    lines.push(line);
                                    break;

                                case 'clip':
                                case 'none':
                                    lines.push(component.text);
                                    break;

                                default:
                                    console.error(`Unknown overflow type: ${component.overflow}`);
                                    break;
                            }

                            if (lines.length > 0) {
                                var textX = compPos.x;
                                if (ctx.textAlign === 'center') textX += component.size.w / 2;
                                if (ctx.textAlign === 'right') textX += component.size.w;

                                var textBlockHeight = lines.length * lineHeight;
                                var textY = compPos.y;
                                if (component.vAlign === 'middle') {
                                    textY += (component.size.h - textBlockHeight) / 2;
                                } else if (component.vAlign === 'bottom') {
                                    textY += component.size.h - textBlockHeight;
                                } else if (component.vAlign !== 'top') {
                                    console.error(`Unknown vertical alignment: ${component.vAlign}`);
                                }

                                if (component.overflow === 'clip') {
                                    ctx.save();
                                    ctx.beginPath();
                                    ctx.rect(compPos.x, compPos.y, component.size.w, component.size.h);
                                    ctx.clip();
                                }
                                for (var index = 0; index < lines.length; index++) {
                                    ctx.fillText(lines[index], textX, textY + index * lineHeight);
                                }
                                if (component.overflow === 'clip') ctx.restore();
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