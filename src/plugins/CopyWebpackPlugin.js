let FileCollection = require('../FileCollection');
let chokidar = require('chokidar');

/**
 * Create a new CopyWebpackPlugin instance.
 *
 * @param {array} copy
 */
function CopyWebpackPlugin(copy) {
    copy.forEach(copy => {
        let files = new FileCollection(copy.from).copyTo(copy.to);

        if (Mix.isWatching()) {
            this.watch(files, copy.to);
        }
    });
}


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

            files.copyTo(destination, new File(updatedFile));
        });
};


module.exports = CopyWebpackPlugin;
