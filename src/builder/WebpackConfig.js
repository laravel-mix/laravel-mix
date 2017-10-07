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

        Mix.dispatch('configReady', this.webpackConfig);

        return this.webpackConfig;
    }


    /**
     * Build the entry object.
     */
    buildEntry() {
        let { entry, extractions } = webpackEntry();

        this.webpackConfig.entry = entry;


        if (Config.commons.length) {

            Config.commons.forEach(chunk => {
                chunk.config.chunks = Object
                .keys(entry)
                .filter(entrypath => {
                    if(typeof chunk.matchCase === "string") {
                        return entrypath.includes(path.normalize(chunk.matchCase));
                    } else if(chunk.matchCase instanceof RegExp) {    
                        return RegExp(chunk.matchCase).test(entrypath) ;
                    } else if(Array.isArray(chunk.matchCase)) {
                        let includes = false;
                        chunk.matchCase.forEach(match => {
                            if(entrypath.includes(match)) {
                                return includes = true;
                            }
                        })
                        return includes;
                    }
                    return false;                    
                })


                if(chunk.config.chunks.length) {
                    this.webpackConfig.plugins.push(
                        new webpack.optimize.CommonsChunkPlugin(chunk.config)
                      );
                }

    
            })
        }


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
        
        let buildFile = 'vue/dist/vue.common.js';

        if (Config.typeScript) {
            extensions.push('.ts', '.tsx');
            
            buildFile = 'vue/dist/vue.esm.js';
        }

        this.webpackConfig.resolve = {
            extensions,

            alias: {
                'vue$': buildFile
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
