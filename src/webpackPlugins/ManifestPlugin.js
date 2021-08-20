class ManifestPlugin {
    /**
     *
     * @param {import("../Mix")} mix
     */
    constructor(mix) {
        // TODO: Simplify in Mix 7 -- Here for backwards compat if a plugin creates this class directly
        this.mix = mix || global.Mix;
    }

    /**
     * Apply the plugin.
     *
     * @param {import("webpack").Compiler} compiler
     */
    apply(compiler) {
        compiler.hooks.emit.tapAsync('ManifestPlugin', (curCompiler, callback) => {
            let stats = curCompiler.getStats().toJson();

            // Handle the creation of the mix-manifest.json file.
            this.mix.manifest.transform(stats).refresh();

            callback();
        });
    }
}

module.exports = ManifestPlugin;
