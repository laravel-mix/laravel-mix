class Components {
    constructor() {
        this.components = [];
    }

    record(name, component) {
        this.components[name] = component;
    }

    get(name) {
        return this.components[name];
    }
}

module.exports = Components;
