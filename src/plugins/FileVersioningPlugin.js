let chokidar = require('chokidar');
let glob = require('glob');

/**
 * Create a new plugin instance.
 *
 * @param {Array} files
 */
function FileVersioningPlugin(files = []) {
    this.files = files;
}


/**
 * Apply the plugin.
 */
FileVersioningPlugin.prototype.apply = function () {
    if (this.files && Mix.isWatching()) {
        this.watch(this.files);
    }

    Mix.listen('files-concatenated', file => {
        file = new File(file);

        // Find and delete all matching versioned files in the directory.
        glob(path.join(file.base(), '**'), (err, files) => {
            files.filter(file => {
                return /\.(\w{20}|\w{32})(\..+)/.test(file);
            }).forEach(file => new File(file).delete());
        });

        // Then create a fresh versioned file.
        this.reversion(file.path());
    });
};


/**
 * Watch all relevant files for changes.
 *
 * @param {Object} files
 * @param {Object} destination
 */
FileVersioningPlugin.prototype.watch = function (files, destination) {
    chokidar.watch(files, { persistent: true })
        .on('change', this.reversion);
};


/**
 * Re-version the updated file.
 *
 * @param {string} updatedFile
 */
FileVersioningPlugin.prototype.reversion = function (updatedFile) {
    let name = new File(updatedFile).version(false).pathFromPublic();

    try { File.find(Mix.manifest.get(updatedFile)).delete(); }
    catch (e) {}

    Mix.manifest.add(name).refresh();
};


module.exports = FileVersioningPlugin;
