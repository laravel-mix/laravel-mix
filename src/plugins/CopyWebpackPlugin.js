let FileCollection = require('../FileCollection');
let chokidar = require('chokidar');

/**
 * Create a new CopyWebpackPlugin instance.
 *
 * @param {array} copy
 */
function CopyWebpackPlugin(copy) {
    this.copy = copy;
}


/**
 * Apply the plugin.
 *
 * @param {Object} compiler
 */
CopyWebpackPlugin.prototype.apply = function (compiler) {
    compiler.plugin('done', () => {
        this.copy.forEach(copy => {
            let files = new FileCollection(copy.from);

            files.copyTo(copy.to);

            if (Mix.isWatching()) {
                this.watch(files, copy.to);
            }
        });
    });
};


/**
 * Watch all relevant files for changes.
 *
 * @param {Object} files
 * @param {Object} destination
 */
CopyWebpackPlugin.prototype.watch = function (files, destination) {
    chokidar.watch(files.get(), { persistent: true })
        .on('change', updatedFile => {
            console.log(`Copying ${updatedFile} to ${destination.path()}`);

            let to = files.copyTo(destination, new File(updatedFile));

            Mix.dispatch('asset-updated', to);
        });
};


module.exports = CopyWebpackPlugin;
