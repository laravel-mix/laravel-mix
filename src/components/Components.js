class Components {
    /**
     * Create a new Components instance.
     */
    constructor() {
        this.components = [];
    }

    /**
     * Record a newly registered component.
     *
     * @param {string} name
     * @param {Component} component
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
}

module.exports = Components;
