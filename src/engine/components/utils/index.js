import PlayerController from './../player_controller.js';
import Properties from './../properties.js';
import Hitbox from './../hitbox.js';

// Named exports for convenience
export { PlayerController, Properties, Hitbox };

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
registerComponent('PlayerController', PlayerController);
registerComponent('Properties', Properties);
registerComponent('Hitbox', Hitbox);

export { componentsMap as _componentsMap, registerComponent, unregisterComponent, getComponent, listComponents };