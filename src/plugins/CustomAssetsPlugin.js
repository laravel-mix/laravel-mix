/**
 * Create a new plugin instance.
 *
 * @param {Array} assets
 */
function CustomAssetsPlugin(assets = []) {
    this.assets = assets;
    this.version = Mix.isUsing('versioning');
    this.inProduction = Mix.inProduction();
}


/**
 * Apply the plugin.
 *
 * @param {Object} compiler
 */
CustomAssetsPlugin.prototype.apply = function (compiler) {
      compiler.plugin('done', stats => {
        this.assets.forEach(asset => {
            let name = asset.pathFromPublic();

            // If versioning is turned on, all custom assets
            // need to be versioned manually.
            if (this.version) {
                if (/\.(\w{20}|\w{32})(\..+)/.test(name)) {
                    return;
                }

                let deleteUnversionedFile = false;

                try {
                    asset = asset.version(deleteUnversionedFile);
                    name = asset.pathFromPublic();

                    Mix.manifest.add(name);
                } catch (e) {}
            }

            if (this.inProduction) {
                try {
                    asset.minify();
                } catch (e) {
                    console.log(
                        `Whoops! We had trouble minifying "${asset.relativePath()}". ` +
                        `Perhaps you need to use mix.babel() instead?`
                    );

                    throw e;
                }
            }

            stats.compilation.assets[name] = {
                size: () => asset.size(),
                emitted: true
              };
        });

        if (this.version) {
            Mix.manifest.refresh();
        }
    });
};

module.exports = CustomAssetsPlugin;
