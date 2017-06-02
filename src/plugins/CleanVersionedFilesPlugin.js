let fs = require('fs');
let mix = require('../index');
let glob = require('glob');
let objectValues = require('lodash').values;

let newlyCompiledFiles;

/**
 * Create a new plugin instance.
 */
function CleanVersionedFilesPlugin() {}


/**
 * Apply the plugin.
 *
 * @param {Object} compiler
 */
CleanVersionedFilesPlugin.prototype.apply = function (compiler) {
    compiler.plugin('done', stats => {
        newlyCompiledFiles = stats.toJson().assets.map(asset => {
            return path.join(Config.publicPath, asset.name);
        });

        glob(path.join(Config.publicPath, '**'), (err, files) => {
            files.filter(this.oldFile).forEach(file => fs.unlinkSync(file));
        });
    });
};


/**
 * Determine if the current file is an old file.
 *
 * @param {string} file
 */
CleanVersionedFilesPlugin.prototype.oldFile = function (file) {
    // Don't delete any matching files that were just compiled.
    if (newlyCompiledFiles.includes(file)) {
        return false;
    }

    // And ignore files that are currently present in the manifest.
    if (objectValues(Mix.manifest.get()).includes(file.replace(Config.publicPath, ''))) {
        return false;
    }

    // But *do* delete any remaining matching hashed files.
    if (/\.(\w{20}|\w{32})(\..+)/.test(file)) {
        return true;
    }
};

module.exports = CleanVersionedFilesPlugin;
