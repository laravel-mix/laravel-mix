let Assert = require('../Assert');
let ExtractTextPlugin = require('extract-text-webpack-plugin');

class Preprocessor {
    /**
     * Assets to append to the webpack entry.
     *
     * @param {Entry} entry
     */
    webpackEntry(entry) {
        this.details.forEach(detail => {
            entry.add(entry.keys()[0], detail.src.path());
        });
    }

    /**
     * webpack rules to be appended to the master config.
     */
    webpackRules() {
        let rules = [];

        this.details.forEach((preprocessor, index) => {
            let outputPath = preprocessor.output.filePath
                .replace(Config.publicPath + path.sep, path.sep)
                .replace(/\\/g, '/');

            tap(new ExtractTextPlugin(outputPath), extractPlugin => {
                let loaders = [
                    {
                        loader: 'css-loader',
                        options: {
                            url: Config.processCssUrls,
                            sourceMap: Mix.isUsing('sourcemaps'),
                            importLoaders: 1
                        }
                    },

                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap:
                                preprocessor.type === 'sass' &&
                                Config.processCssUrls
                                    ? true
                                    : Mix.isUsing('sourcemaps'),
                            ident: `postcss${index}`,
                            plugins: (function() {
                                let plugins = Config.postCss;

                                if (
                                    preprocessor.postCssPlugins &&
                                    preprocessor.postCssPlugins.length
                                ) {
                                    plugins = preprocessor.postCssPlugins;
                                }

                                if (
                                    Config.autoprefixer &&
                                    Config.autoprefixer.enabled
                                ) {
                                    plugins.push(
                                        require('autoprefixer')(
                                            Config.autoprefixer.options
                                        )
                                    );
                                }

                                return plugins;
                            })()
                        }
                    }
                ];

                if (preprocessor.type === 'sass' && Config.processCssUrls) {
                    loaders.push({
                        loader: 'resolve-url-loader',
                        options: {
                            sourceMap: true,
                            root: Mix.paths.root('node_modules')
                        }
                    });
                }

                if (preprocessor.type !== 'postCss') {
                    loaders.push({
                        loader: `${preprocessor.type}-loader`,
                        options: this.loaderOptions(preprocessor)
                    });
                }

                rules.push({
                    test: preprocessor.src.path(),
                    use: Mix.isUsing('hmr')
                        ? ['style-loader', ...loaders]
                        : extractPlugin.extract({
                              fallback: 'style-loader',
                              use: loaders
                          })
                });

                this.extractPlugins = (this.extractPlugins || []).concat(
                    extractPlugin
                );
            });
        });

        return rules;
    }

    /**
     * webpack plugins to be appended to the master config.
     */
    webpackPlugins() {
        return this.extractPlugins;
    }

    /**
     * Prepare the preprocessor plugin options.
     *
     * @param {Object} preprocessor
     */
    loaderOptions(preprocessor) {
        tap(preprocessor.pluginOptions.implementation, implementation => {
            if (typeof implementation === 'function') {
                preprocessor.pluginOptions.implementation = implementation();
            }
        });

        return Object.assign(preprocessor.pluginOptions, {
            sourceMap:
                preprocessor.type === 'sass' && Config.processCssUrls
                    ? true
                    : Mix.isUsing('sourcemaps')
        });
    }

    /**
     * Register a generic CSS preprocessor.
     *
     * @param {string} type
     * @param {string} src
     * @param {string} output
     * @param {object} pluginOptions
     * @param {Array} postCssPlugins
     */
    preprocess(type, src, output, pluginOptions = {}, postCssPlugins = []) {
        Assert.preprocessor(type, src, output);

        src = new File(src);

        output = this.normalizeOutput(
            new File(output),
            src.nameWithoutExtension() + '.css'
        );

        this.details = (this.details || []).concat({
            type: this.constructor.name.toLowerCase(),
            src,
            output,
            pluginOptions,
            postCssPlugins
        });

        return this;
    }

    /**
     * Generate a full output path, using a fallback
     * file name, if a directory is provided.
     *
     * @param {Object} output
     * @param {Object} fallbackName
     */
    normalizeOutput(output, fallbackName) {
        if (output.isDirectory()) {
            output = new File(path.join(output.filePath, fallbackName));
        }

        return output;
    }
}

module.exports = Preprocessor;
