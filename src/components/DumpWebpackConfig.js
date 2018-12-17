class DumpWebpackConfig {
    /**
     * The optional name to be used when called by Mix.
     * Defaults to the class name, lowercased.
     */
    name() {
        return ['dumpWebpackConfig', 'dump'];
    }

    /**
     * Register the component.
     */
    register() {
        Mix.listen('configReady', config => {
            console.log(JSON.stringify(config, null, 2));
        });
    }
}

module.exports = DumpWebpackConfig;
