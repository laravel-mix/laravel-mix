let path = require('path');

/** @typedef {import("webpack").Module} Module */
/** @typedef {object} OptimizationSplitChunksCacheGroup */

/**
 * @typedef {Object} CacheGroupsContext
 * @property {import("webpack").ModuleGraph} moduleGraph
 * @property {import("webpack").ChunkGraph} chunkGraph
 */

/** @typedef {any} CacheGroup */

/**
 * @typedef {(module: import("webpack").Module, context: CacheGroupsContext) => boolean} ChunkTestCallback
 * @typedef {undefined|boolean|string|RegExp|ChunkTestCallback} ChunkTest
 */

/**
 * @typedef {(chunk: CacheGroup, id: string) => boolean} ChunkFindCallback
 */

class Chunks {
    /** @type {Chunks|null} */
    static _instance = null;

    /**
     *
     * @param {import("./Mix")} mix
     */
    constructor(mix) {
        // TODO: Simplify in Mix 7 -- Here for backwards compat if a plugin creates this class directly
        this.mix = mix || global.Mix;

        /** @type {{[key: string]: CacheGroup}} */
        this.chunks = {};

        /** @type {import("./builder/Entry.js")|null} */
        this.entry = null;
        this.runtime = false;
    }

    /** @deprecated */
    makeCurrent() {
        Chunks._instance = this;
    }

    /**
     * @deprecated
     * @return {Chunks}
     */
    static instance() {
        return Chunks._instance || this.reset();
    }

    /**
     * @deprecated
     * @return {Chunks}
     */
    static reset() {
        return (Chunks._instance = new Chunks(global.Mix));
    }

    /**
     *
     * @param {string} id A unique identifier for this chunk. Multiple chunks with the same ID are merged.
     * @param {string} path The output path for this chunk
     * @param {ChunkTest|ChunkTest[]} test A test that tells webpack how to determine what to put in this chunk
     * @param {Partial<CacheGroup>} attrs
     */
    add(id, path, test, attrs = {}) {
        this.create(id, path, attrs).addTo(id, test);
    }

    /**
     *
     * @param {string} id A unique identifier for this chunk. Multiple chunks with the same ID are merged.
     * @param {string} path The output path for this chunk
     * @param {Partial<OptimizationSplitChunksCacheGroup>} attrs
     */
    create(id, path, attrs = {}) {
        this.chunks[id] = this.chunks[id] || {
            name: path,
            ...attrs
        };

        return this;
    }

    /**
     *
     * @param {string} idOrPath
     * @param {ChunkTest|ChunkTest[]} test
     */
    addTo(idOrPath, test) {
        const chunk = this.find(idOrPath);

        if (Array.isArray(test)) {
            test = this._checkAllTests(test);
        }

        if (chunk.test) {
            test = this._checkAnyTests([chunk.test, test]);
        }

        chunk.test = test;

        return this;
    }

    /**
     *
     * @param {string|ChunkFindCallback} idOrPath
     * @returns {CacheGroup|null}
     */
    find(idOrPath) {
        if (typeof idOrPath === 'string') {
            if (this.chunks[idOrPath]) {
                return this.chunks[idOrPath];
            }

            return this.find((_, id) => id === idOrPath);
        }

        const item = Object.entries(this.chunks).find(([id, chunk]) =>
            idOrPath(chunk, id)
        );

        return item ? item[1] : null;
    }

    /**
     * @returns {import('webpack').Configuration}
     */
    config() {
        return {
            optimization: {
                ...this.runtimeChunk(),
                ...this.splitChunks()
            }
        };
    }

    runtimeChunk() {
        if (!this.runtime || !this.entry) {
            return {};
        }

        return {
            runtimeChunk: {
                name: path
                    .join(this.mix.config.runtimeChunkPath || this.entry.base, 'manifest')
                    .replace(/\\/g, '/')
            }
        };
    }

    splitChunks() {
        return {
            splitChunks: {
                ...this.cacheGroups()
            }
        };
    }

    cacheGroups() {
        return {
            cacheGroups: {
                /** @type {false} */
                default: false,
                /** @type {false} */
                defaultVendors: false,
                ...this.chunks
            }
        };
    }

    /**
     * Check to see if a chunk should be included based on multiple tests
     *
     * This is for internal use only and may be changed or removed at any time
     *
     * @internal
     *
     * @param {(undefined|boolean|string|RegExp|Function)[]} tests
     * @returns {ChunkTestCallback}
     */
    _checkAllTests(tests) {
        return (module, context) =>
            tests.every(test => this._checkTest(test, module, context));
    }

    /**
     * Check to see if a chunk should be included based on multiple tests
     *
     * This is for internal use only and may be changed or removed at any time
     *
     * @internal
     *
     * @param {(undefined|boolean|string|RegExp|Function)[]} tests
     * @returns {ChunkTestCallback}
     */
    _checkAnyTests(tests) {
        return (module, context) =>
            tests.some(test => this._checkTest(test, module, context));
    }

    /**
     * Check to see if a chunk should be included
     *
     * NOTE: This repeats the code from the SplitChunksPlugin checkTest function
     * This is for internal use only and may be changed or removed at any time
     *
     * @internal
     *
     * @param {undefined|boolean|string|RegExp|Function} test test option
     * @param {import("webpack").Module} module the module
     * @param {CacheGroupsContext} context context object
     * @returns {boolean} true, if the module should be selected
     */
    _checkTest(test, module, context) {
        if (this._checkModuleTest(test, module, context)) {
            return true;
        }

        const issuer = context.moduleGraph.getIssuer(module);

        if (issuer) {
            return this._checkTest(test, issuer, context);
        }

        return false;
    }

    /**
     * Check to see if a chunk should be included
     *
     * NOTE: This repeats the code from the SplitChunksPlugin checkTest function
     * This is for internal use only and may be changed or removed at any time
     *
     * @internal
     *
     * @param {undefined|boolean|string|RegExp|Function} test test option
     * @param {import("webpack").Module} module the module
     * @param {any} context context object
     * @returns {boolean} true, if the module should be selected
     */
    _checkModuleTest(test, module, context) {
        if (test === undefined) return true;
        if (typeof test === 'function') {
            return test(module, context);
        }
        if (typeof test === 'boolean') return test;
        if (typeof test === 'string') {
            const name = module.nameForCondition();

            return (name && name.startsWith(test)) || false;
        }
        if (test instanceof RegExp) {
            const name = module.nameForCondition();

            return (name && test.test(name)) || false;
        }

        return false;
    }
}

module.exports.Chunks = Chunks;
