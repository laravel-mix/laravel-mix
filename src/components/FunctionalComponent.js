/** @typedef {import('../../types/component').ClassComponent} ClassComponent */
/** @typedef {import('../../types/component').FunctionalComponent} FunctionalComponent */

/**
 * @param {string[]} names
 * @param {FunctionalComponent} component
 * @returns {ClassComponent}
 */
exports.createFunctionalComponent = function createFunctionalComponent(names, component) {
    return class {
        /** @type {any[]} */
        args = [];

        name() {
            return names;
        }

        /**
         *
         * @param  {...any} args
         */
        register(...args) {
            this.args = args;
        }

        /**
         *
         * @param {import('webpack').Configuration} config
         */
        webpackConfig(config) {
            component.call(this, config, ...this.args);
        }
    };
};
