let StandaloneSass = require('../StandaloneSass');

/**
 * Create a new plugin instance.
 *
 * @param {Array} files
 */
function FastSassPlugin (files = []) {
    this.files = files;
}


FastSassPlugin.prototype.apply = function () {
    this.files.forEach(sass => {
        new StandaloneSass(
            sass.src, sass.output.forceFromPublic(), sass.pluginOptions
        ).run();
    });
};

module.exports = FastSassPlugin;
