/**
 * Create a new plugin instance.
 *
 * @param {Function} callback
 */
function BuildCallbackPlugin (callback) {
    this.callback = callback;
}


/**
 * Apply the plugin.
 *
 * @param {Object} compiler
 */
BuildCallbackPlugin.prototype.apply = function (compiler) {
    compiler.plugin('done', this.callback);
}

module.exports = BuildCallbackPlugin;
