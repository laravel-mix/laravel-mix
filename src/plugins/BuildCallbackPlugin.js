class BuildCallbackPlugin {
    /**
     * Create a new plugin instance.
     *
     * @param {Function} callback
     */
    constructor(callback) {
        this.callback = callback;
    }

    /**
     * Apply the plugin.
     *
     * @param {Object} compiler
     */
    apply(compiler) {
        compiler.plugin('done', this.callback);
    }
}

module.exports = BuildCallbackPlugin;
