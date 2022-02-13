let { Chunks } = require('./Chunks');
let buildConfig = require('./config');
let ComponentRegistrar = require('./components/ComponentRegistrar');
let Components = require('./components/Components');
let Dependencies = require('./Dependencies');
let Dispatcher = require('./Dispatcher');
let Dotenv = require('dotenv');
let File = require('./File');
let HotReloading = require('./HotReloading');
let Manifest = require('./Manifest');
let Paths = require('./Paths');
let WebpackConfig = require('./builder/WebpackConfig');
let { Resolver } = require('./Resolver');
const { BuildGroup } = require('./Build/BuildGroup');
const Log = require('./Log');

/** @typedef {import("./tasks/Task")} Task */

class Mix {
    /** @type {Mix|null} */
    static #instance = null;

    /** @type {Record<string, boolean>} */
    static _hasWarned = {};

    /** @type {BuildGroup[]} */
    #current;

    /**
     * Create a new instance.
     */
    constructor() {
        /** @type {ReturnType<buildConfig>} */
        this.config = buildConfig(this);

        this.chunks = new Chunks(this);
        this.components = new Components();
        this.dispatcher = new Dispatcher();
        this.manifest = new Manifest('mix-manifest.json', this);
        this.paths = new Paths();
        this.registrar = new ComponentRegistrar(this);
        this.webpackConfig = new WebpackConfig(this);
        this.hot = new HotReloading(this);
        this.resolver = new Resolver();
        this.dependencies = new Dependencies();
        this.logger = Log;

        const defaultGroup = new BuildGroup({
            name: 'Mix',
            mix: this,
            callback: () => {}
        });

        defaultGroup.context.config = this.config;

        this.#current = [defaultGroup];

        /** @type {BuildGroup[]} */
        this.groups = [defaultGroup];

        /** @type {Task[]} */
        this.tasks = [];

        this.bundlingJavaScript = false;

        /**
         * @internal
         * @type {boolean}
         **/
        this.initialized = false;

        /**
         * @internal
         * @type {false | null | string | string[] | Record<string, string | string[]>}
         */
        this.globalStyles = null;

        /**
         * @internal
         * @type {boolean|string}
         **/
        this.extractingStyles = false;
    }

    /**
     * @internal
     */
    static get shared() {
        if (this.#instance) {
            return this.#instance;
        }

        // @ts-ignore
        return (this.#instance = new Mix());
    }

    /**
     * Load the user's Mix config
     */
    async load() {
        const { ConfigLoader } = await import('./ConfigLoader.mjs');

        const loader = new ConfigLoader(this.paths.root());

        const mod = await loader.load();

        // Allow the user to `export default function (mix) { … }` from their config file
        if (typeof mod.default === 'function') {
            await this.currentGroup.whileCurrent(mod.default);
        }
    }

    /**
     * @internal
     * @returns {Promise<import('webpack').Configuration[]>}
     */
    async build() {
        return await Promise.all(this.buildableGroups.map(group => group.config()));
    }

    get buildableGroups() {
        return this.groups.filter(group => group.shouldBeBuilt);
    }

    /**
     * @internal
     */
    async boot() {
        // Load .env
        Dotenv.config();

        // If we're using Laravel set the public path by default
        if (File.exists('./artisan')) {
            this.config.publicPath = 'public';
        }

        this.listen('init', () => this.hot.record());
        this.makeCurrent();
    }

    /**
     * @internal
     */
    async installDependencies() {
        await this.dispatch('internal:gather-dependencies');
        await this.dependencies.install();
    }

    /**
     * @internal
     */
    async setup() {
        await Promise.all(this.buildableGroups.map(group => group.setup()));
    }

    /**
     * @internal
     */
    async init() {
        if (this.initialized) {
            return;
        }

        this.initialized = true;

        // And then kick things off
        await this.dispatch('init', this);
    }

    /**
     * @return {import("laravel-mix").Api}
     */
    get api() {
        return this.currentGroup.context.api;
    }

    /**
     * Determine if the given config item is truthy.
     *
     * @param {string} tool
     * @deprecated Please check the mix config directly instead
     */
    isUsing(tool) {
        // @ts-ignore
        return !!this.config[tool];
    }

    /**
     * Determine if Mix is executing in a production environment.
     */
    inProduction() {
        return this.config.production;
    }

    /**
     * Determine if Mix should use HMR.
     */
    isHot() {
        return process.argv.includes('--hot');
    }

    /**
     * Determine if Mix should watch files for changes.
     */
    isWatching() {
        return this.isHot() || process.argv.includes('--watch');
    }

    /**
     * Determine if polling is used for file watching
     */
    isPolling() {
        const hasPollingOption = process.argv.some(arg =>
            arg.includes('--watch-options-poll')
        );

        return this.isWatching() && hasPollingOption;
    }

    /**
     * Determine if Mix sees a particular tool or framework.
     *
     * @param {string} tool
     * @deprecated
     */
    sees(tool) {
        if (tool === 'laravel') {
            return File.exists('./artisan');
        }

        return false;
    }

    /**
     * Determine if the given npm package is installed.
     *
     * @param {string} npmPackage
     * @deprecated
     */
    seesNpmPackage(npmPackage) {
        return this.resolver.has(npmPackage);
    }

    /**
     * Queue up a new task.
     *
     * @param {Task} task
     */
    addTask(task) {
        this.tasks.push(task);
    }

    /**
     * Listen for the given event.
     *
     * @param {string|string}   event
     * @param {import('./Dispatcher').Handler} callback
     */
    listen(event, callback) {
        this.dispatcher.listen(event, callback);
    }

    /**
     * Dispatch the given event.
     *
     * @param {string} event
     * @param {any | (() => any)}      [data]
     */
    async dispatch(event, data) {
        return this.currentGroup.whileCurrent(() => {
            if (typeof data === 'function') {
                data = data();
            }

            return this.dispatcher.fire(event, data);
        });
    }

    /**
     * @param {string} name
     * @internal
     */
    resolve(name) {
        return this.resolver.get(name);
    }

    /**
     * @internal
     * @param {BuildGroup} group
     **/
    pushCurrent(group) {
        this.#current.push(group.makeCurrent());
    }

    /** @internal */
    popCurrent() {
        if (this.#current.length === 1) {
            return;
        }

        this.#current.pop();
        this.currentGroup.makeCurrent();
    }

    /**
     * @internal
     * @type {BuildGroup}
     */
    get currentGroup() {
        return this.#current[this.#current.length - 1];
    }

    /**
     * @internal
     * @template T
     * @param {string} name
     * @param {import('./Build/BuildGroup').GroupCallback} callback
     */
    addGroup(name, callback) {
        this.groups.push(
            new BuildGroup({
                name,
                mix: this,
                callback
            })
        );
    }

    /**
     * @internal
     */
    makeCurrent() {
        // Set up some globals

        global.Mix = this;
        global.webpackConfig = this.webpackConfig;

        this.groups[0].makeCurrent();

        return this;
    }
}

module.exports = Mix;
