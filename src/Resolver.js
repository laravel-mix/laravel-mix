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

        try {
            return require.resolve(name);
        } catch (err) {
            return name;
        }
    }

    /**
     *
     * @param {string} name
     * @returns {boolean}
     */
    has(name) {
        if (this.aliases[name] !== undefined) {
            return true;
        }

        try {
            require.resolve(name);

            return true;
        } catch (e) {
            return false;
        }
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
