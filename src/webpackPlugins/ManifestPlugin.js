class ManifestPlugin {
    /**
     * Apply the plugin.
     *
     * @param {import("webpack").Compiler} compiler
     */
    apply(compiler) {
        compiler.hooks.emit.tapAsync(
            'ManifestPlugin',
            (curCompiler, callback) => {
                let stats = curCompiler.getStats().toJson();

                // Handle the creation of the mix-manifest.json file.
                Mix.manifest.transform(stats).refresh();

                callback();
            }
        );
    }
}

module.exports = ManifestPlugin;
