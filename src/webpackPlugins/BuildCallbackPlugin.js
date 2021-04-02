class BuildCallbackPlugin {
    /**
     * Create a new plugin instance.
     *
     * @param {(stats: import("webpack").Stats) => any|Promise<any>} callback
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
        compiler.hooks.done.tapPromise('BuildCallbackPlugin', async stats => {
            return await this.callback(stats);
        });
    }
}

module.exports = BuildCallbackPlugin;
