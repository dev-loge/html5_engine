import Properties from './../properties.js';
import Hitbox from './../hitbox.js';
import Script from './../script.js';

// Named exports for convenience
export { Properties, Hitbox, Script};

// Component registry (map) and helpers
const componentsMap = new Map();

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
registerComponent('Properties', Properties);
registerComponent('Hitbox', Hitbox);
registerComponent('Script', Script);

export { componentsMap as _componentsMap, registerComponent, unregisterComponent, getComponent, listComponents };