//export all engine parts in this folder
export { Engine } from './engine.js';
export { Scene } from './scene.js';
export { Component } from './component.js';
export { Renderer } from './render.js';
export { GameObject } from './game-object.js';

//export engine references
export var engineInstance = null;

export function setEngineInstance(engine) {
    engineInstance = engine;
}

export function getEngineInstance() {
    return engineInstance;
}
