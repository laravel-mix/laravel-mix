let FileCollection = require('../FileCollection');
let FileVersioning = require('./FileVersioningPlugin');
let chokidar = require('chokidar');

/**
 * Create a new plugin instance.
 *
 * @param {Array} combine
 */
function ConcatenateFilesPlugin (combine = []) {
    this.combine = combine;
}


/**
 * Apply the plugin.
 */
ConcatenateFilesPlugin.prototype.apply = function () {
    this.combine.forEach(combine => {
        let files = new FileCollection(combine.src).merge(combine.output, combine.babel);

        if (Mix.isWatching()) {
            this.watch(files, combine.output, combine.babel);
        }
    });
};


/**
 * Watch all relevant files for changes.
 *
 * @param {Object}  files
 * @param {Object}  destination
 * @param {Boolean} wantsBabel
 */
ConcatenateFilesPlugin.prototype.watch = function (files, destination, wantsBabel) {
    chokidar.watch(files.get(), { persistent: true })
        .on('change', updatedFile => {
            console.log(`Merging files to ${destination.path()}`);

            files.merge(destination, wantsBabel);

            Mix.dispatch('files-concatenated', destination.path());
        });
};

module.exports = ConcatenateFilesPlugin;
