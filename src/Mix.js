let Paths = require('./Paths');
let Manifest = require('./Manifest');
let Dispatcher = require('./Dispatcher');
let isFunction = require('lodash').isFunction;

class Mix {
    /**
     * Create a new instance.
     */
    constructor() {
        this.paths = new Paths;
        this.manifest = new Manifest;
        this.dispatcher = new Dispatcher;
        this.tasks = [];
    }


    /**
     * Determine if the given config item is truthy.
     *
     * @param {string} tool
     */
    isUsing(tool) {
        return !! Config[tool];
    }


    /**
     * Determine if Mix is executing in a production environment.
     */
    inProduction() {
        return Config.production;
    }


    /**
     * Determine if Mix should watch files for changes.
     */
    isWatching() {
        return process.argv.includes('--watch') || process.argv.includes('--hot');
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
     * Determine if Mix should activate hot reloading.
     */
    shouldHotReload() {
        new File(path.join(Config.publicPath, 'hot')).delete();

        return this.isUsing('hmr');
    }


    /**
     * Add a custom file to the webpack assets collection.
     *
     * @param {string} asset
     */
    addAsset(asset) {
        Config.customAssets.push(asset);
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
     * @param {string}   event
     * @param {Function} callback
     */
    listen(event, callback) {
        this.dispatcher.listen(event, callback);
    }


    /**
     * Dispatch the given event.
     *
     * @param {string} event
     * @param {*}      data
     */
    dispatch(event, data) {
        if (isFunction(data)) {
            data = data();
        }

        this.dispatcher.fire(event, data);
    }
}

module.exports = Mix;
