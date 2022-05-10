class Components {
    /**
     * Create a new Components instance.
     */
    constructor() {
        /** @type {Record<string, any>} */
        this.components = {};
    }

    /**
     * Record a newly registered component.
     *
     * @param {string} name
     * @param {any} component
     */
    record(name, component) {
        this.components[name] = component;
    }

    /**
     * Retrieve a recorded component.
     *
     * @param {string} name
     */
    get(name) {
        return this.components[name];
    }

    /**
     * Determine if the given component name has been registered.
     * @param {string} name
     */
    has(name) {
        return name in this.components;
    }

    /**
     * Retrieve all components.
     */
    all() {
        return this.components;
    }
}

module.exports = Components;
