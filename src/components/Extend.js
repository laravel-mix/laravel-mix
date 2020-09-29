let ComponentRegistrar = require('./ComponentRegistrar');

class Extend {
    /**
     * Register the component.
     *
     * @param {string} name
     * @param {Component} component
     */
    register(name, component) {
        if (typeof component !== 'function') {
            component.name = () => name;

            return new ComponentRegistrar().add(component);
        }

        new ComponentRegistrar().add({
            name: () => name,

            register(...args) {
                this.args = args;
            },

            webpackConfig(config) {
                component.call(this, config, ...this.args);
            }
        });
    }
}

module.exports = Extend;
