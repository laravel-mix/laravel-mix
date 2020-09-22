module.exports = class Alias {
    /**
     * Add resolution aliases to webpack's config
     *
     * @param {Record<string,string>} paths
     */
    register(paths) {
        /** @type {Record<string, string>} */
        this.aliases = { ...(this.aliases || {}), ...paths };
    }

    webpackConfig(webpackConfig) {
        webpackConfig.resolve.alias = webpackConfig.resolve.alias || {};

        for (const [alias, path] of Object.entries(this.aliases)) {
            webpackConfig.resolve.alias[alias] = Mix.paths.root(path);
        }
    }
};
