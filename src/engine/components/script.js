import { Component } from "../engine-parts/component.js";
import Raycast from '../math/raycast.js';
import Vector2 from '../math/vector2.js';
import Shape from '../math/shape.js';

//*
async function loadScript(path, data, gameObject, engine) {
    try {
        while (gameObject.id == null || engine.gameObjectRegistry.get(gameObject.id) !== gameObject) {
            await new Promise(resolve => setTimeout(resolve, 0));
        }

        // Fetch and preprocess script to extract public variables and functions
        var response = await fetch(`./assets/scripts/${path}`);
        var scriptText = await response.text();
        var publicExports = [];
        var publicVarTypes = {};

        //console.log(path, '| Pre Processed Script:\n', scriptText)
        
        // Inject gameObject, Scene, and Engine binding code at top of script using engine's global registry
        var gameObjectId = gameObject.id;
        //console.log(`Binding GameObject with ID ${gameObjectId} to script ${path}`);
        scriptText = `const GameObject = window.__engine.gameObjectRegistry.get(${gameObjectId});\n` + 
                     'const Scene = window.__engine.currentScene;\n' +
                     'const Engine = window.__engine;\n' +
                     `const Raycast = ${Raycast.toString()};\n` +
                     `const Vector2 = ${Vector2.toString()};\n` +
                     `const Shape = ${Shape.toString()};\n` +
                     scriptText;
        
        var scriptData = {};
        if (data && typeof data === 'object') {
            if (data.data && typeof data.data === 'object') {
                Object.assign(scriptData, data.data);
            }

            Object.entries(data).forEach(([key, value]) => {
                if (key !== 'data' && key !== 'script' && key !== 'type' && value !== undefined) {
                    scriptData[key] = value;
                }
            });
        }

        // Replace type placeholders with actual values from data
        if (scriptData && Object.keys(scriptData).length > 0) {
            for (var [varName, value] of Object.entries(scriptData)) {
                // Replace "public var varName = type" with "public var varName = value"
                var typeRegex = new RegExp(`(public\\s+(?:var|let|const)\\s+${varName}\\s*=\\s*)(\\w+)(;)`, 'g');
                var replacement = `$1${JSON.stringify(value)}$3`;
                scriptText = scriptText.replace(typeRegex, replacement);
            }
        }
        
        // Helper function to infer type from initial value string
        function inferType(valueStr) {
            valueStr = valueStr.trim();
            
            // Check for type constructors
            var typeMatch = ['number', 'string', 'boolean', 'Array', 'Object'].find(type => valueStr.startsWith(type));
            if (typeMatch) return typeMatch.toLowerCase();
            
            // Check for literal values
            if (valueStr.startsWith('"') || valueStr.startsWith("'")) return 'string';
            if (valueStr === 'true' || valueStr === 'false') return 'boolean';
            if (valueStr.startsWith('[')) return 'array';
            if (valueStr.startsWith('{')) return 'object';
            if (!isNaN(valueStr) && valueStr !== '') return 'number';
            return 'unknown';
        }
        
        // Extract and remove 'public' keyword from variables, functions, and classes
        var publicPatterns = [
            {
                regex: /public\s+(?:var|let|const)\s+(\w+)\s*=\s*([^;]+);/g,
                replaceRegex: /public\s+(var|let|const)\s+/g,
                replaceFn: (match, keyword) => keyword + ' ',
                captureGroup: 1,
                extractType: true  // Extract type from initial value
            },
            {
                regex: /public\s+(async\s+)?function\s+(\w+)/g,
                replaceRegex: /public\s+(async\s+)?function\s+/g,
                replaceFn: (match, asyncKeyword) => (asyncKeyword || '') + 'function ',
                captureGroup: 2
            },
            {
                regex: /public\s+class\s+(\w+)/g,
                replaceRegex: /public\s+class\s+/g,
                replaceFn: () => 'class ',
                captureGroup: 1
            }
        ];
        
        publicPatterns.forEach(pattern => {
            var match;
            while ((match = pattern.regex.exec(scriptText)) !== null) {
                var varName = match[pattern.captureGroup];
                publicExports.push(varName);
                
                // Extract type information from initial value if applicable
                if (pattern.extractType && match[2]) {
                    publicVarTypes[varName] = inferType(match[2]);
                }
            }
            scriptText = scriptText.replace(pattern.replaceRegex, pattern.replaceFn);
        });

        // Generate export statement with type metadata
        if (publicExports.length > 0) {
            scriptText += `\nexport { ${publicExports.join(', ')} };`;
            // Export type information for validation
            scriptText += `\nexport const __publicVarTypes = ${JSON.stringify(publicVarTypes)};`;
        }
    
        //console.log(path, '| Post Processed Script:\n', scriptText)
        
        // Create blob URL for the processed script
        var blob = new Blob([scriptText], { type: 'application/javascript' });
        var blobUrl = URL.createObjectURL(blob);
        
        try {
            var module = await import(blobUrl);
            return module;
        } finally {
            URL.revokeObjectURL(blobUrl);
        }
    } catch (e) {
        console.error(`Failed to load script ${path}: ${e}`);
    }
}
//*/
class Script extends Component {
    constructor(gameObject, inputObject, engine, desiredName = null) {
        super (gameObject, inputObject, engine, desiredName);
        this.scriptName = inputObject.script;
        this.data = inputObject.data || {};
        this.scriptPromise = this.scriptName ? loadScript(this.scriptName, inputObject, gameObject, engine)
            .then(module => {
                if (module) {
                    // Bind all module exports to this script instance
                    this.scriptModule = module;

                    Object.assign(this, module);
                    //if (inputObject.data) Object.assign(this, inputObject.data);
                    //console.log(this.gameObject);
                }
            })
            .catch(e => console.error(`Failed to load script module ${this.scriptName}: ${e}`))
            : null;
        
        
    }
}

export default Script;