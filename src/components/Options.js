class Options {
    register(options) {
        Config.merge(options);

        return this;
    }
}

module.exports = Options;
