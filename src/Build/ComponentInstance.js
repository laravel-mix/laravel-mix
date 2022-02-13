const { concat, extend } = require('lodash');
const Dependencies = require('../Dependencies');

/**
 * @typedef {import('../../types/component').ComponentInterface} ComponentInterface
 * @typedef {import('../../types/component').InstallableComponent} InstallableComponent
 * @typedef {import('../../types/component').Component} Component
 * @typedef {import('./ComponentRecord').ComponentRecord} ComponentRecord
 **/

/**
 * @template TArgs
 *
 * @typedef {object} ComponentInvocation
 * @property {string} name
 * @property {TArgs} args
 **/

/** @private */
module.exports.ComponentInstance = class ComponentInstance {
    /** @type {'installed' | 'active'} */
    state = 'installed';

    /**
     * @param {ComponentRecord} record
     * @param {ComponentInterface} instance
     */
    constructor(record, instance) {
        this.record = record;
        this.instance = instance;
    }

    /**
     * @internal
     * @param {ComponentInvocation<any[]>} invocation
     * @returns
     */
    run(invocation) {
        const { name, args } = invocation;

        // Legacy support
        this.mix.components.record(name, this.instance);

        this.state = 'active';

        // @ts-ignore
        this.instance.caller = name;

        this.instance.register && this.instance.register(...args);

        // @ts-ignore
        this.instance.activated = true;
    }

    /**
     * @returns
     */
    async collectDeps() {
        if (this.state !== 'active') {
            return;
        }

        /** @type {import('../PackageDependency.js').Dependency[]} */
        const deps = this.instance.dependencies
            ? concat([], await this.instance.dependencies())
            : [];

        this.mix.dependencies.enqueue(deps, this.instance.requiresReload || false);
    }

    /**
     * @returns
     */
    async init() {
        if (this.state !== 'active') {
            return;
        }

        await this.boot();
        await this.applyBabelConfig();

        this.mix.listen('loading-entry', entry => this.applyEntry(entry));
        this.mix.listen('loading-rules', rules => this.applyRules(rules));
        this.mix.listen('loading-plugins', plugins => this.applyPlugins(plugins));
        this.mix.listen('configReady', config => this.applyConfig(config));
    }

    /**
     * Apply the Babel configuration for the component.
     *
     * @private
     */
    async boot() {
        return this.instance.boot && this.instance.boot();
    }

    /**
     * Apply the Babel configuration for the component.
     *
     * @private
     */
    async applyBabelConfig() {
        const config = this.instance.babelConfig
            ? (await this.instance.babelConfig()) || {}
            : {};

        this.context.config.merge({
            babelConfig: extend(this.context.config.babelConfig, config)
        });
    }

    /**
     * Apply the Babel configuration for the component.
     *
     * @param {import('../builder/Entry')} entry
     */
    async applyEntry(entry) {
        return this.instance.webpackEntry && this.instance.webpackEntry(entry);
    }

    /**
     * Apply the webpack rules for the component.
     *
     * @param {import('webpack').RuleSetRule[]} rules
     * @private
     */
    async applyRules(rules) {
        const newRules = this.instance.webpackRules
            ? concat((await this.instance.webpackRules()) || [])
            : [];

        rules.push(...newRules);
    }

    /**
     * Apply the webpack plugins for the component.
     *
     * @param {import('webpack').WebpackPluginInstance[]} plugins
     * @private
     */
    async applyPlugins(plugins) {
        const newPlugins = this.instance.webpackPlugins
            ? concat((await this.instance.webpackPlugins()) || [])
            : [];

        plugins.push(...newPlugins);
    }

    /**
     * Apply the webpack plugins for the component.
     *
     * @param {import('webpack').Configuration} config
     * @private
     */
    async applyConfig(config) {
        return this.instance.webpackConfig && this.instance.webpackConfig(config);
    }

    get context() {
        return this.record.group.context;
    }

    get mix() {
        return this.record.group.mix;
    }
};
