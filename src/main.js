import { Engine } from './engine/engine-parts/engine.js';

const canvas = document.getElementById('game-canvas');
const engine = new Engine(canvas);

// Expose engine globally for script access
window.__engine = engine;

//========Boot=========
engine.start();