/**
 * Create a new plugin instance.
 */
function ManifestPlugin () {}


/**
 * Apply the plugin.
 *
 * @param {Object} compiler
 */
ManifestPlugin.prototype.apply = function (compiler) {
    compiler.plugin('emit', (curCompiler, callback) => {
        let stats = curCompiler.getStats().toJson();

        // Handle the creation of the mix-manifest.json file.
         Mix.manifest.transform(stats).refresh();

         callback();
    });
}

module.exports = ManifestPlugin;
