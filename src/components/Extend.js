const { concat } = require('lodash');
const { createFunctionalComponent } = require('./FunctionalComponent');

/**
 * @typedef {import('../../types/component').ClassComponent} ClassComponent
 * @typedef {import('../../types/component').ComponentInterface} ComponentInterface
 * @typedef {import('../../types/component').FunctionalComponent} FunctionalComponent
 * @typedef {import('../../types/component').InstallableComponent} InstallableComponent
 * @typedef {import('../../types/component').Component} Component
 **/

class Extend {
    /**
     * Register the component.
     *
     * @param {string | string[] | FunctionalComponent} name
     * @param {Component} component
     */
    register(name, component) {
        if (typeof name === 'function') {
            return this.context.registrar.install(component);
        }

        const names = concat([], name);

        if (this.looksLikeSimpleCallback(component)) {
            return this.context.registrar.install(
                createFunctionalComponent(names, component)
            );
        }

        return this.context.registrar.install(component, names);
    }

    /**
     * Register the component.
     *
     * @param {Component} component
     * @returns {component is FunctionalComponent} component
     */
    looksLikeSimpleCallback(component) {
        if (typeof component !== 'function') {
            return false;
        }

        if (!component.prototype) {
            return true;
        }

        return (
            typeof component.prototype.name !== 'function' &&
            typeof component.prototype.register !== 'function' &&
            typeof component.prototype.boot !== 'function' &&
            typeof component.prototype.mix !== 'function' &&
            typeof component.prototype.dependencies !== 'function'
        );
    }

    get context() {
        return global.Mix;
    }
}

module.exports = Extend;
