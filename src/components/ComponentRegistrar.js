const { Component } = require('./Component');
const { ComponentRecord } = require('../Build/ComponentRecord');
const { ComponentInstance } = require('../Build/ComponentInstance');

class ComponentRegistrar {
    /**
     *
     * @param {import('../Mix')} [mix]
     */
    constructor(mix) {
        this.mix = mix || global.Mix;

        this.components = {};
    }

    /**
     * Install all default components.
     */
    installAll() {
        const { components } = require('./PreloadedComponents');

        components
            .map(name => require(`./${name}`))
            .forEach(c => {
                this.install(c);
            });

        return this.components;
    }

    /**
     * Install a component.
     *
     * @param {import("laravel-mix").Component} ComponentDefinition
     * @param {string[]} [names]
     */
    install(ComponentDefinition, names) {
        const record = new ComponentRecord(this.mix, ComponentDefinition, names);
        const instance = record.instance();

        this.registerComponent(instance);

        this.mix.listen('internal:gather-dependencies', () => instance.collectDeps());
        this.mix.listen('init', () => instance.init());

        return this.components;
    }

    /**
     * Register the component.
     *
     * @param {ComponentInstance} instance
     */
    registerComponent(instance) {
        const component = instance.instance;
        const names = instance.record.names;

        /**
         *
         * @param {string} name
         */
        const register = name => {
            this.components[name] = (...args) => {
                instance.run({ name, args });
                return this.components;
            };

            // If we're dealing with a passive component that doesn't
            // need to be explicitly triggered by the user, we'll
            // call it now.
            if (component.passive) {
                this.components[name]();
            }

            // Components can optionally write to the Mix API directly.
            if (component.mix) {
                Object.keys(component.mix()).forEach(name => {
                    this.components[name] = component.mix()[name];
                });
            }
        };

        names.forEach(name => register(name));
    }

    /**
     * Install the component's dependencies.
     *
     * @deprecated
     * @param {Component} component
     */
    installDependencies(component) {
        throw new Error(
            'ComponentRegistrar.installDependencies is an implementation detail and no longer used'
        );
    }
}

module.exports = ComponentRegistrar;
