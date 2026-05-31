// Simple template cache with optional concurrency-limited fetch
const cache = new Map();

async function getTemplate(name) {
    if (!name) return null;
    if (cache.has(name)) {
        return cache.get(name);
    }

    // store a promise immediately to deduplicate concurrent requests
    const p = fetch(`./assets/templates/${name}`).then(r => {
        if (!r.ok) throw new Error(`Failed to fetch template ${name}`);
        return r.json();
    }).then(data => {
        cache.set(name, data);
        return data;
    }).catch(err => {
        cache.delete(name);
        throw err;
    });

    cache.set(name, p);
    return p;
}

/**
 * Fetch multiple templates with a simple concurrency limit.
 * Returns an object map: { name: template }
 */
async function fetchTemplates(names = [], concurrency = 4) {
    const unique = Array.from(new Set(names.filter(Boolean)));
    const results = {};

    for (let i = 0; i < unique.length; i += concurrency) {
        const chunk = unique.slice(i, i + concurrency);
        const promises = chunk.map(name => getTemplate(name).then(t => ({ name, t })).catch(e => ({ name, t: null })));
        const resolved = await Promise.all(promises);
        resolved.forEach(({ name, t }) => {
            results[name] = t;
        });
    }

    return results;
}

function clearCache() {
    cache.clear();
}

export { getTemplate, fetchTemplates, clearCache };
