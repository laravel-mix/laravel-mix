let webpack = require('webpack');

let webpackDefaultConfig = require('./webpack-default');
let Entry = require('./Entry');
let webpackRules = require('./webpack-rules');
let webpackPlugins = require('./webpack-plugins');

process.noDeprecation = true;

class WebpackConfig {
    /**
     * Create a new instance.
     */
    constructor() {
        this.webpackConfig = webpackDefaultConfig();
    }

    /**
     * Build the Webpack configuration object.
     */
    build() {
        this.buildEntry()
            .buildOutput()
            .buildRules()
            .buildPlugins()
            .buildResolving()
            .mergeCustomConfig();

        Mix.dispatch('configReady', this.webpackConfig);

        return this.webpackConfig;
    }

    /**
     * Build the entry object.
     */
    buildEntry() {
        let entry = new Entry();

        if (! Mix.bundlingJavaScript) {
            entry.addDefault();
        }

        Mix.dispatch('loading-entry', entry);

        this.webpackConfig.entry = entry.get();

        return this;
    }

    /**
     * Build the output object.
     */
    buildOutput() {
        let http = process.argv.includes('--https') ? 'https' : 'http';

        if (Mix.isUsing('hmr')) {
            this.webpackConfig.devServer.host = Config.hmrOptions.host;
            this.webpackConfig.devServer.port = Config.hmrOptions.port;
        }

        this.webpackConfig.output = {
            path: path.resolve(Mix.isUsing('hmr') ? '/' : Config.publicPath),
            filename: '[name].js',
            chunkFilename: '[name].js',
            publicPath: Mix.isUsing('hmr')
                ? http +
                  '://' +
                  Config.hmrOptions.host +
                  ':' +
                  Config.hmrOptions.port +
                  '/'
                : '/'
        };

        return this;
    }

    /**
     * Build the rules array.
     */
    buildRules() {
        this.webpackConfig.module.rules = this.webpackConfig.module.rules.concat(
            webpackRules()
        );

        Mix.dispatch('loading-rules', this.webpackConfig.module.rules);

        return this;
    }

    /**
     * Build the plugins array.
     */
    buildPlugins() {
        this.webpackConfig.plugins = this.webpackConfig.plugins.concat(
            webpackPlugins()
        );

        Mix.dispatch('loading-plugins', this.webpackConfig.plugins);

        return this;
    }

    /**
     * Build the resolve object.
     */
    buildResolving() {
        this.webpackConfig.resolve = {
            extensions: ['*', '.js', '.jsx', '.vue'],

            alias: {
                vue$: 'vue/dist/vue.common.js'
            }
        };

        return this;
    }

    /**
     * Merge the user's custom Webpack configuration.
     */
    mergeCustomConfig() {
        if (Config.webpackConfig) {
            this.webpackConfig = require('webpack-merge').smart(
                this.webpackConfig,
                Config.webpackConfig
            );
        }
    }
}

module.exports = WebpackConfig;
