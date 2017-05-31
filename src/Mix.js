let Paths = require('./Paths');
let Manifest = require('./Manifest');
let Dispatcher = require('./Dispatcher');

class Mix {
    /**
     * Create a new instance.
     */
    constructor() {
        this.paths = new Paths;
        this.manifest = new Manifest;
        this.dispatcher = new Dispatcher;
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
     * Add a custom file to the webpack assets collection.
     *
     * @param {string} asset
     */
    addAsset(asset) {
        Config.customAssets.push(asset);
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
        this.dispatcher.fire(event, data);
    }
}

module.exports = Mix;
