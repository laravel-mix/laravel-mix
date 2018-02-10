let Paths = require('./Paths');
let Manifest = require('./Manifest');
let Dispatcher = require('./Dispatcher');
let isFunction = require('lodash').isFunction;

class Mix {
    /**
     * Create a new instance.
     */
    constructor() {
        this.paths = new Paths();
        this.manifest = new Manifest();
        this.dispatcher = new Dispatcher();
        this.tasks = [];
        this.customizeRule = {};
    }

    /**
     * Determine if the given config item is truthy.
     *
     * @param {string} tool
     */
    isUsing(tool) {
        return !!Config[tool];
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
        return (
            process.argv.includes('--watch') || process.argv.includes('--hot')
        );
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

    /**
     * See if the user registered a customizeRule callback for this rule and call it in order to replace or merge the rule.
     * If the user didn't provide a valid callback function, an error will be logged and the original rule will be returned.
     * If the user's callback didn't return a rule, a warning will be logged an the original rule will be returned.
     *
     * @param {string} name name of the rule (e.g. images, jsx)
     * @param {object} rule the prepared rule object
     * @param {object} Config the global config object
     * @return {object} customized rule if the user returned one or the original rule.
     */
    callCustomizeRule(name, rule, Config) {
        if (!this.customizeRule[name]) {
            return rule;
        }
        if (typeof this.customizeRule[name] !== 'function') {
            console.error(`customizeRule.${name} is not a function. Will not be applied.`);
            return rule;
        }
        const customizedRule = this.customizeRule[name](rule, Config);
        if (!customizedRule) {
            console.warn(`customizeRule.${name} did not merge or replace the rule. Original rule will be applied.`);
            return rule;
        }
        return customizedRule;
    }
}

module.exports = Mix;
