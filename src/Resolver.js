class Resolver {
    constructor() {
        /** @type {Record<string, string>} */
        this.aliases = {};
    }

    /**
     *
     * @param {string} name
     */
    get(name) {
        if (this.aliases[name] !== undefined) {
            return this.aliases[name];
        }

        return require.resolve(name);
    }

    /**
     *
     * @param {string} name
     * @param {string} newName
     * @internal
     */
    alias(name, newName) {
        this.aliases[name] = require.resolve(newName);
    }

    clear() {
        this.aliases = {};
    }
}

module.exports.Resolver = Resolver;
