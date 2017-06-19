let webpack = require('webpack');

let webpackDefaultConfig = require('./webpack-default');
let webpackEntry = require('./webpack-entry');
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

        return this.webpackConfig;
    }


    /**
     * Build the entry object.
     */
    buildEntry() {
        let { entry, extractions } = webpackEntry();

        this.webpackConfig.entry = entry;

        // If we're extracting any vendor libraries, then we
        // need to add the CommonChunksPlugin to strip out
        // all relevant code into its own file.
        if (extractions.length) {
            this.webpackConfig.plugins.push(
                new webpack.optimize.CommonsChunkPlugin({
                    names: extractions,
                    minChunks: Infinity
                })
            );
        }

        return this;
    }


    /**
     * Build the output object.
     */
    buildOutput() {
         let http = process.argv.includes('--https') ? 'https' : 'http';

        this.webpackConfig.output = {
            path: path.resolve(Mix.isUsing('hmr') ? '/' : Config.publicPath),
            filename: '[name].js',
            chunkFilename: '[name].js',
            publicPath: Mix.isUsing('hmr') ? (http + '://localhost:8080/') : ''
        };

        return this;
    }


    /**
     * Build the rules array.
     */
    buildRules() {
        let { rules, extractPlugins } = webpackRules();

        this.webpackConfig.module.rules = this.webpackConfig.module.rules.concat(rules);
        this.webpackConfig.plugins = this.webpackConfig.plugins.concat(extractPlugins);

        return this;
    }


    /**
     * Build the plugins array.
     */
    buildPlugins() {
        this.webpackConfig.plugins = this.webpackConfig.plugins.concat(
            webpackPlugins()
        );

        return this;
    }


    /**
     * Build the resolve object.
     */
    buildResolving() {
        let extensions = ['*', '.js', '.jsx', '.vue'];

        if (Config.typeScript) {
            extensions.push('.ts', '.tsx');
        }

        this.webpackConfig.resolve = {
            extensions,

            alias: {
                'vue$': 'vue/dist/vue.common.js'
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
                this.webpackConfig, Config.webpackConfig
            );
        }
    }
}

module.exports = WebpackConfig;
