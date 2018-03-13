let ComponentFactory = require('./ComponentFactory');

class Extend {
    /**
     * Register the component.
     *
     * @param {string} name
     * @param {Component} component
     */
    register(name, component) {
        if (typeof component === 'function') {
            component = { register: component };
        }

        component.name = () => name;

        new ComponentFactory().install(component);
    }
}

module.exports = Extend;
