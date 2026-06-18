export class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        /*
        this.gl = this.canvas.getContext('webgl');

        if (!this.gl) {
            console.error('WebGL not supported.');
        }
        //*/
    }

    renderFrame(scene) {
        var ctx = this.ctx;
        // Placeholder for rendering logic
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (var gameObject of scene.gameObjects) {
            var objPos = gameObject.position;
            //if (gameObject.name === "Player") console.log('Rendering Player: ', objPos);

            // Only render "graphic" components
            for (var comp of gameObject.graphicComps) {
                //reset lineWidth
                ctx.lineWidth = 1;

                var component = gameObject.components[comp];
                if (component) {
                    var compPos = applyOffset(objPos, component.offset);
                    //if (gameObject.name === "Player") console.log('Draw Comp: ', compPos);
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
                            var shapePos = applyOffset(compPos, shape.offset);
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
                    // additional rendering logic


                } else console.error('Missing graphic component:', comp, 'in game object:', gameObject.name);
            }
        }

        /*
        var gl = this.gl;
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        //*/
    }
}

var applyOffset = (pos, offset) => {
    if (!offset) offset = {x:0, y:0};
    return {x: pos.x + offset.x, y: pos.y + offset.y};
}