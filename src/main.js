import { Engine } from './engine/engine-parts/engine.js';

const canvas = document.getElementById('game-canvas');
const engine = new Engine(canvas);

//========Boot=========
engine.start();