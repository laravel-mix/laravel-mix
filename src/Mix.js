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

/** @typedef {import("./tasks/Task")} Task */

class Mix {
    /** @type {Mix|null} */
    static _primary = null;

    /**
     * Create a new instance.
     */
    constructor() {
        /** @type {ReturnType<buildConfig>} */
        this.config = buildConfig();

        this.chunks = new Chunks();
        this.components = new Components();
        this.dispatcher = new Dispatcher();
        this.manifest = new Manifest();
        this.paths = new Paths();
        this.registrar = new ComponentRegistrar();
        this.webpackConfig = new WebpackConfig(this);

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
         * @type {string|null}
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
    static get primary() {
        return Mix._primary || (Mix._primary = new Mix());
    }

    /**
     * @internal
     */
    async build() {
        return this.webpackConfig.build();
    }

    /**
     * @internal
     */
    boot() {
        // Load .env
        Dotenv.config();

        // If we're using Laravel set the public path by default
        if (this.sees('laravel')) {
            this.config.publicPath = 'public';
        }

        this.listen('init', () => HotReloading.record());
        this.makeCurrent();

        return this;
    }

    /**
     * @internal
     */
    async installDependencies() {
        await this.dispatch('internal:gather-dependencies');

        Dependencies.installQueued();
    }

    /**
     * @internal
     */
    init() {
        if (this.initialized) {
            return;
        }

        this.initialized = true;

        return this.dispatch('init', this);
    }

    /**
     * @returns {import("../types/index")}
     */
    get api() {
        if (!this._api) {
            this._api = this.registrar.installAll();

            // @ts-ignore
            this._api.inProduction = () => this.config.production;
        }

        // @ts-ignore
        return this._api;
    }

    /**
     * Determine if the given config item is truthy.
     *
     * @param {string} tool
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
        return this.isWatching() && process.argv.includes('--watch-poll');
    }

    /**
     * Determine if Mix sees a particular tool or framework.
     *
     * @param {string} tool
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
     */
    seesNpmPackage(npmPackage) {
        try {
            require.resolve(npmPackage);

            return true;
        } catch (e) {
            return false;
        }
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
        if (typeof data === 'function') {
            data = data();
        }

        return this.dispatcher.fire(event, data);
    }

    /**
     * @internal
     */
    makeCurrent() {
        // Set up some globals

        global.Config = this.config;
        global.Mix = this;
        global.webpackConfig = this.webpackConfig;

        this.chunks.makeCurrent();

        return this;
    }
}

module.exports = Mix;
