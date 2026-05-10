import * as EngineParts from './engine/engine-parts/engine-exports.js';

const { Engine } = EngineParts;
var canvas = document.getElementById('game-canvas');
var engine = new Engine(canvas);

//========Boot=========
engine.start();