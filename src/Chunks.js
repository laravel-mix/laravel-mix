let instance;

/**
 * @typedef {(module: import("webpack").Module, chunks: import("webpack").ChunkData[]) => bool} ChunkTestCallback
 * @typedef {string|RegExp|ChunkTestCallback} ChunkTest
 */

class Chunks {
    constructor() {
        /** @type {{[key: string]: import("webpack").Options.CacheGroupsOptions}} */
        this.chunks = {};

        this.entry = null;
        this.runtime = false;
    }

    /**
     * @return {Chunks}
     */
    static instance() {
        return instance || (instance = new Chunks());
    }

    /**
     *
     * @param {string} path
     * @param {ChunkTest} test
     * @param {Partial<import("webpack").Options.CacheGroupsOptions>} attrs
     */
    add(id, path, test, attrs = {}) {
        this.create(id, path, attrs).addTo(id, test);
    }

    /**
     *
     * @param {string} id
     * @param {string} path
     * @param {Partial<import("webpack").Options.CacheGroupsOptions>} attrs
     */
    create(id, path, attrs = {}) {
        this.chunks[id] = {
            name: path,
            ...attrs
        };

        return this;
    }

    /**
     *
     * @param {string} idOrPath
     * @param {string} path
     * @param {Partial<import("webpack").Options.CacheGroupsOptions>} attrs
     */
    addTo(idOrPath, test) {
        const chunk = this.find(idOrPath);

        chunk.test = chunk.test || test;

        return this;
    }

    /**
     *
     * @param {string} idOrPath
     */
    find(idOrPath) {
        if (this.chunks[idOrPath]) {
            return this.chunks[idOrPath];
        }

        for (const chunk of Object.values(this.chunks)) {
            if (chunk.name === idOrPath) {
                return chunk;
            }
        }

        return null;
    }

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
                name: path.join(this.entry.base, 'manifest').replace(/\\/g, '/')
            }
        };
    }

    splitChunks() {
        return {
            splitChunks: {
                ...this.cacheGroups()
                // ...this.other(),
            }
        };
    }

    cacheGroups() {
        if (Object.keys(this.chunks).length === 0) {
            return {};
        }

        return {
            cacheGroups: this.chunks
        };
    }

    other() {
        if (Object.keys(this.chunks).length > 0) {
            return {};
        }

        return {
            // If the user didn't specify any libraries to extract,
            // they likely want to extract all vendor libraries.
            ...(Object.keys(this.chunks).length === 0
                ? {
                      name: this.extractions[0].output,
                      chunks: 'all'
                  }
                : {})
        };
    }
}

module.exports.Chunks = Chunks;
