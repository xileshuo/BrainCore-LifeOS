const BRAINCORE_GLOBAL_KEYS = new Set([
    "BrainCoreAPI",
]);

function publishBrainCoreGlobal(plugin, key, value) {
    if (!BRAINCORE_GLOBAL_KEYS.has(key)) throw new Error(`不允许的 BrainCore 全局入口：${key}`);
    if (!plugin._publishedGlobals) plugin._publishedGlobals = new Map();
    plugin._publishedGlobals.set(key, value);
    Object.defineProperty(window, key, {
        value,
        writable: false,
        configurable: true,
        enumerable: false,
    });
    return value;
}

function releaseBrainCoreGlobals(plugin) {
    for (const [key, value] of plugin._publishedGlobals || []) {
        if (window[key] === value) delete window[key];
    }
    plugin._publishedGlobals?.clear?.();
}
