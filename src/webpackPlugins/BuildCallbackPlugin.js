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
     * @param {import("webpack").Compiler} compiler
     */
    apply(compiler) {
        compiler.hooks.done.tap('BuildCallbackPlugin', this.callback);
    }
}

module.exports = BuildCallbackPlugin;
