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

    Mix.listen('asset-updated', this.reversion);
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
    updatedFile = new File(updatedFile);

    try { File.find(Mix.manifest.get(updatedFile.pathFromPublic())).delete(); }
    catch (e) {}

    let name = updatedFile.version(false).pathFromPublic();

    Mix.manifest.add(name).refresh();
};


module.exports = FileVersioningPlugin;
