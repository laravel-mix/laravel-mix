const { Component } = require('./Component');

module.exports = class Alias extends Component {
    /** @type {Record<string, string | {raw: string}>} */
    aliases = {};

    /**
     * Add resolution aliases to webpack's config
     *
     * @param {Record<string, string | {raw: string}>} paths
     */
    register(paths) {
        this.aliases = { ...this.aliases, ...paths };
    }

    /**
     * @param {import('webpack').Configuration} config
     **/
    webpackConfig(config) {
        config.resolve = config.resolve || {};
        config.resolve.alias = config.resolve.alias || {};

        for (const [alias, path] of Object.entries(this.aliases)) {
            const resolvedPath =
                typeof path === 'object' ? path.raw : this.context.paths.root(path);

            config.resolve.alias[alias] = resolvedPath;
        }

        return config;
    }
};
