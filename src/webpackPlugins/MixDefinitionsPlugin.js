let webpack = require('webpack');
let dotenv = require('dotenv');
let expand = require('dotenv-expand');

/** @internal */
class MixDefinitionsPlugin {
    /**
     *
     * @param {string} [envPath]
     * @param {Record<string, string>} [additionalEnv]
     */
    constructor(envPath = undefined, additionalEnv = {}) {
        this.envPath = envPath || global.Mix.paths.root('.env');
        this.additionalEnv = additionalEnv;
    }

    /**
     *
     * @param {import('webpack').Compiler} compiler
     */
    apply(compiler) {
        this.plugin.apply(compiler);
    }

    /**
     * Build all MIX_ definitions for Webpack's DefinePlugin.
     */
    get env() {
        // Load .env, if it exists, into process.env
        expand(dotenv.config({ path: this.envPath }));

        // Take everything from process.env that beings with MIX_
        const regex = /^MIX_/i;
        const existing = Object.fromEntries(
            Object.entries(process.env).filter(([key]) => regex.test(key))
        );

        // Merge in env vaiues from:
        // - process.env
        // - the .env file
        // - the additional env provided to the plugin
        return {
            ...existing,
            ...this.additionalEnv
        };
    }

    /**
     * Build up the necessary definitions and add them to the DefinePlugin.
     */
    get plugin() {
        return new webpack.EnvironmentPlugin(this.env);
    }

    /**
     * Build all MIX_ definitions for Webpack's DefinePlugin.
     * This is no longer used but here for backwards compat.
     *
     * @deprecated
     * @param {Record<string, string>} additionalEnv
     */
    getDefinitions(additionalEnv) {
        return Object.fromEntries(
            Object.entries({ ...this.env, ...additionalEnv }).map(([key, value]) => {
                return [`process.env.${key}`, JSON.stringify(value)];
            })
        );
    }

    /**
     * Build up the necessary definitions and add them to the DefinePlugin.
     *
     * Here for backwards compat only
     * @deprecated
     * @param {Record<string, string>} additionalEnv
     */
    static build(additionalEnv) {
        return new MixDefinitionsPlugin(undefined, additionalEnv).plugin;
    }
}

module.exports = MixDefinitionsPlugin;
