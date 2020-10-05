class BabelConfig {
    register(config) {
        Config.babelConfig = config;

        return this;
    }
}

module.exports = BabelConfig;
