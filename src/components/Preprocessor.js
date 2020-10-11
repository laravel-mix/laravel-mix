let Assert = require('../Assert');
let path = require('path');
let File = require('../File');
let { Chunks } = require('../Chunks');
let CssWebpackConfig = require('./CssWebpackConfig');
let PostCssPluginsFactory = require('../PostCssPluginsFactory');

class Preprocessor {
    /**
     * Create a new component instance.
     */
    constructor() {
        this.chunks = Chunks.instance();
    }

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

        this.details.forEach(preprocessor => {
            let loaders = [
                ...CssWebpackConfig.afterLoaders({ method: 'extract' }),
                {
                    loader: 'css-loader',
                    options: {
                        url: Config.processCssUrls,
                        sourceMap: Mix.isUsing('sourcemaps'),
                        importLoaders: 1
                    }
                }
            ];

            if (this.postCssPlugins(preprocessor).length) {
                loaders.push({
                    loader: 'postcss-loader',
                    options: this.postCssLoaderOptions(preprocessor)
                });
            }

            if (preprocessor.type === 'sass' && Config.processCssUrls) {
                loaders.push({
                    loader: 'resolve-url-loader',
                    options: {
                        sourceMap: true,
                        engine: 'rework'
                    }
                });
            }

            if (preprocessor.type !== 'postCss') {
                loaders.push({
                    loader: `${preprocessor.type}-loader`,
                    options: this.loaderOptions(preprocessor)
                });
            }

            loaders.push(
                ...CssWebpackConfig.beforeLoaders({
                    type: preprocessor.type,
                    injectGlobalStyles: false
                })
            );

            rules.push({
                test: preprocessor.src.path(),
                use: loaders
            });
        });

        return rules;
    }

    /**
     * Prepare the preprocessor plugin options.
     *
     * @param {Object} preprocessor
     */
    loaderOptions(preprocessor) {
        return Object.assign(preprocessor.pluginOptions, {
            sourceMap: Mix.isUsing('sourcemaps')
        });
    }

    /**
     * Generate the options object for the PostCSS Loader.
     *
     * @param {string} preprocessor
     */
    postCssLoaderOptions(preprocessor) {
        return {
            sourceMap: Mix.isUsing('sourcemaps'),
            postcssOptions: {
                plugins: this.postCssPlugins(preprocessor)
            }
        };
    }

    /**
     * Generate a list of all necessary PostCSS plugins for the build.
     *
     * @param {string} preprocessor
     */
    postCssPlugins(preprocessor) {
        return new PostCssPluginsFactory(preprocessor, Config).load();
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

        this._addChunks(
            `styles-${output.relativePathWithoutExtension()}`,
            src,
            output
        );

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

    chunkRegex() {
        return /\.css$/;
    }

    /**
     * Add the necessary chunks for this preprocessor
     *
     * This method is for internal use only for now.
     *
     * @internal
     *
     * @param {string} name
     * @param {Object} src
     * @param {Object} output
     */
    _addChunks(name, src, output) {
        const tests = [
            // 1. Ensure the file is a CSS file
            this.chunkRegex(),

            // 2. Ensure that just this file is included in this chunk
            // _or any dependencies_
            src.path()
        ];

        const attrs = {
            chunks: 'all',
            enforce: true,
            type: 'css/mini-extract'
        };

        this.chunks.add(name, output.normalizedOutputPath(), tests, attrs);
    }
}

module.exports = Preprocessor;
