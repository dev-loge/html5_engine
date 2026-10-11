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

    renderTextBox(shape, pos) {
        var ctx = this.ctx;
        var { w, h } = shape.size;
        var lineHeight = shape.fontSize;

        ctx.save();
        ctx.fillStyle = shape.color;
        ctx.strokeStyle = shape.color;
        ctx.font = `${shape.fontSize}px ${shape.font}`;
        ctx.textAlign = ['left', 'center', 'right'].includes(shape.hAlign) ? shape.hAlign : 'left';
        ctx.textBaseline = 'top';

        var text = String(shape.text);
        var lines = [];
        switch (shape.overflow) {
            case 'word wrap':
            case 'character wrap': {
                var tokens = shape.overflow === 'word wrap' ? text.split(' ') : Array.from(text);
                var joiner = shape.overflow === 'word wrap' ? ' ' : '';
                var line = '';
                for (var token of tokens) {
                    var testLine = line ? line + joiner + token : token;
                    if (line && ctx.measureText(testLine).width > w) {
                        lines.push(line);
                        line = token;
                    } else {
                        line = testLine;
                    }
                }
                lines.push(line);
                break;
            }
            case 'clip':
            case 'none':
                lines.push(text);
                break;
            default:
                console.error(`Unknown overflow type: ${shape.overflow}`);
        }

        var textX = pos.x;
        if (ctx.textAlign === 'center') textX += w / 2;
        if (ctx.textAlign === 'right') textX += w;

        var blockHeight = lines.length * lineHeight;
        var textY = pos.y;
        if (shape.vAlign === 'middle') textY += (h - blockHeight) / 2;
        else if (shape.vAlign === 'bottom') textY += h - blockHeight;
        else if (shape.vAlign !== 'top') console.error(`Unknown vertical alignment: ${shape.vAlign}`);

        if (shape.overflow === 'clip') {
            ctx.beginPath();
            ctx.rect(pos.x, pos.y, w, h);
            ctx.clip();
        }
        for (var i = 0; i < lines.length; i++) {
            if (shape.fill) ctx.fillText(lines[i], textX, textY + i * lineHeight);
            else ctx.strokeText(lines[i], textX, textY + i * lineHeight);
        }
        ctx.restore();
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
                                    case 'textbox':
                                        this.renderTextBox(shape, shapePos);
                                        break;
                                    default:
                                        console.error(`Unknown shape type: ${shape.shape}`);
                                }
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