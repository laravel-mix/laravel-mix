let StandaloneSass = require('../StandaloneSass');

class FastSassPlugin {
    /**
     * Create a new plugin instance.
     *
     * @param {Array} files
     */
    constructor(files = []) {
        this.files = files;
    }

    /**
     * Apply the plugin.
     */
    apply() {
        this.files.forEach(sass => {
            new StandaloneSass(
                sass.src,
                sass.output.forceFromPublic(),
                sass.pluginOptions
            ).run();
        });
    }
}

module.exports = FastSassPlugin;
