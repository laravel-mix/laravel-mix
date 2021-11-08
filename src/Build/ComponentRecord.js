const { concat } = require('lodash');
const { ComponentInstance } = require('./ComponentInstance');

/**
 * @typedef {import('../../types/component').ClassComponent} ClassComponent
 * @typedef {import('../../types/component').ComponentInterface} ComponentInterface
 * @typedef {import('../../types/component').FunctionalComponent} FunctionalComponent
 * @typedef {import('../../types/component').InstallableComponent} InstallableComponent
 * @typedef {import('../../types/component').Component} Component
 **/

/** @private */
module.exports.ComponentRecord = class ComponentRecord {
    /** @type {Map<string, ComponentInstance>} */
    #instances = new Map();

    /**
     * @param {import('../Mix')} mix
     * @param {InstallableComponent} component
     * @param {string[]} [names]
     */
    constructor(mix, component, names) {
        this.mix = mix;

        /** @type {InstallableComponent} */
        this.component = component;

        /** @type {string[]} */
        this.names = names || this.getNames(this.component);
    }

    /**
     * @internal
     */
    instance() {
        return new ComponentInstance(this, this.instantiate());
    }

    /**
     * @internal
     */
    instantiate() {
        const component = this.component;

        const [createdNewInstance, ci] = this.isInstantiable(component)
            ? [true, new component(global.Mix)]
            : [false, component];

        if (!createdNewInstance) {
            console.warn(
                `[${this.names.join(
                    ', '
                )}] Using instances for mix extensions may cause problems due to shared state. We recommend using an ES6 class or a function for mix extensions.`
            );
        }

        return ci;
    }

    /**
     * @private
     * @param {InstallableComponent} component
     * @returns {string[]}
     */
    getNames(component) {
        // We've been passed an instance
        if (!this.isInstantiable(component)) {
            // 1. Name function (if it exists)
            if (typeof component.name === 'function') {
                return concat([], component.name());
            }

            // 2. Name of the class/function that created it
            return this.getNames(/** @type {ClassComponent} */ (component.constructor));
        }

        // We've been passed a class or function directly instead of an instance

        // 1. static names()
        // This prevents an instance from being created before it's needed
        if (typeof component.names === 'function') {
            return concat([], component.names());
        }

        // 2. An instance method exists so we instantiate the component to get it's names
        if (typeof component.prototype.name === 'function') {
            return this.getNames(this.instance().instance);
        }

        // 3. Fallback to the function/class name
        return [component.name.replace(/^([A-Z])/, letter => letter.toLowerCase())];
    }

    /**
     * @private
     * @param {Component} component
     * @returns {component is ClassComponent}
     */
    isInstantiable(component) {
        return typeof component === 'function';
    }

    /**
     * @internal
     */
    async collectDeps() {
        return await Promise.allSettled(
            Array.from(this.#instances.values()).map(i => i.collectDeps())
        );
    }

    /**
     * @internal
     */
    async init() {
        return await Promise.allSettled(
            Array.from(this.#instances.values()).map(i => i.init())
        );
    }
};
