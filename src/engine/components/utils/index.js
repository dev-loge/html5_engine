import Hitbox from './../hitbox.js';
import Script from './../script.js';
import Draw from './../draw.js';
import TextBox from './../text-box.js';

// Named exports for convenience
export {Hitbox, Script, Draw, TextBox};

// Component registry (map) and helpers
var componentsMap = new Map();

function registerComponent(name, componentClass) {
    if (!name || !componentClass) return false;
    componentsMap.set(name, componentClass);
    return true;
}

function unregisterComponent(name) {
    return componentsMap.delete(name);
}

function getComponent(name) {
    return componentsMap.get(name);
}

function listComponents() {
    return Array.from(componentsMap.keys());
}

// Register built-ins
registerComponent('Hitbox', Hitbox);
registerComponent('Script', Script);
registerComponent('Draw', Draw);
registerComponent('TextBox', TextBox);

export { componentsMap as _componentsMap, registerComponent, unregisterComponent, getComponent, listComponents };