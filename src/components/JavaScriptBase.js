let ExtractTextPlugin = require('extract-text-webpack-plugin');
let collect = require('collect.js');

class JavaScriptBase {
    /**
     * Required dependencies for the component.
     */
    dependencies() {
        return [];
    }

    /**
     * Override the generated webpack configuration.
     *
     * @param {Object} webpackConfig
     */
    webpackConfig(webpackConfig) {
        this.updateCssLoaders(webpackConfig);
    }

    /**
     * Update all preprocessor loaders to support CSS extraction.
     *
     * @param {Object} webpackConfig
     */
    updateCssLoaders(webpackConfig) {
        // Basic CSS and PostCSS
        this.updateCssLoader('css', webpackConfig, rule => {
            rule.loaders.find(
                loader => loader.loader === 'postcss-loader'
            ).options = this.postCssOptions();
        });

        // LESS
        this.updateCssLoader('less', webpackConfig);

        // SASS
        let sassCallback = rule => this.sassCallback(rule);

        // SCSS
        this.updateCssLoader('scss', webpackConfig, sassCallback);

        // SASS
        this.updateCssLoader('sass', webpackConfig, sassCallback);

        // STYLUS
        this.updateCssLoader('styl', webpackConfig);
    }

    /**
     * Update a sass loader.
     *
     * @param {Object} rule
     */
    sassCallback(rule) {
        if (Mix.seesNpmPackage('sass')) {
            rule.loaders.find(
                loader => loader.loader === 'sass-loader'
            ).options.implementation = require('sass');
        }
    }

    /**
     * Update a single CSS loader.
     *
     * @param {string} loader
     * @param {Object} webpackConfig
     * @param {Function} callback
     */
    updateCssLoader(loader, webpackConfig, callback) {
        let rule = webpackConfig.module.rules.find(rule => {
            return rule.test instanceof RegExp && rule.test.test('.' + loader);
        });

        callback && callback(rule);
    }

    /**
     * Fetch the appropriate postcss plugins for the compile.
     */
    postCssOptions() {
        if (Mix.components.get('postCss')) {
            return {
                plugins: Mix.components.get('postCss').details[0].postCssPlugins
            };
        }

        // If the user has a postcss.config.js file in their project root,
        // postcss-loader will automatically read and fetch the plugins.
        if (File.exists(Mix.paths.root('postcss.config.js'))) {
            return {};
        }

        return { plugins: Config.postCss };
    }
}

module.exports = JavaScriptBase;
