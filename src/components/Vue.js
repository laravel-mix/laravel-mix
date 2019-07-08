let { VueLoaderPlugin } = require('vue-loader');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let { without } = require('lodash');

class Vue {
    /**
     * Required dependencies for the component.
     */
    dependencies() {
        let dependencies = ['vue-template-compiler'];

        if (Config.extractVueStyles && Config.globalVueStyles) {
            dependencies.push('sass-resources-loader');
        }

        return dependencies;
    }

    /**
     * Override the generated webpack configuration.
     *
     * @param {Object} webpackConfig
     */
    webpackConfig(webpackConfig) {
        webpackConfig.module.rules.push({
            test: /\.vue$/,
            use: [
                {
                    loader: 'vue-loader',
                    options: Config.vue || {}
                }
            ]
        });

        webpackConfig.plugins.push(new VueLoaderPlugin());

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
        let sassCallback = rule => {
            if (Mix.seesNpmPackage('sass')) {
                rule.loaders.find(
                    loader => loader.loader === 'sass-loader'
                ).options.implementation = require('sass');
            }

            if (Config.globalVueStyles) {
                rule.loaders.push({
                    loader: 'sass-resources-loader',
                    options: {
                        resources: Mix.paths.root(Config.globalVueStyles)
                    }
                });
            }
        };

        // SCSS
        this.updateCssLoader('scss', webpackConfig, sassCallback);

        // SASS
        this.updateCssLoader('sass', webpackConfig, sassCallback);

        // STYLUS
        this.updateCssLoader('styl', webpackConfig);
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

        if (Config.extractVueStyles) {
            let extractPlugin = this.extractPlugin();

            rule.loaders = extractPlugin.extract({
                fallback: 'style-loader',
                use: without(rule.loaders, 'style-loader')
            });

            this.addExtractPluginToConfig(extractPlugin, webpackConfig);
        }
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

    /**
     * Add an extract text plugin to the webpack config plugins array.
     *
     * @param {Object} extractPlugin
     * @param {Object} webpackConfig
     */
    addExtractPluginToConfig(extractPlugin, webpackConfig) {
        if (extractPlugin.isNew) {
            webpackConfig.plugins.push(extractPlugin);
        }
    }

    /**
     * Fetch the appropriate extract plugin.
     */
    extractPlugin() {
        // If the user set extractVueStyles: true, we'll try
        // to append the Vue styles to an existing CSS chunk.
        if (typeof Config.extractVueStyles === 'boolean') {
            let preprocessorName = Object.keys(Mix.components.all())
                .reverse()
                .find(componentName => {
                    return ['sass', 'less', 'stylus', 'postCss'].includes(
                        componentName
                    );
                });

            if (preprocessorName) {
                return Mix.components
                    .get(preprocessorName)
                    .extractPlugins.slice(-1)[0];
            }
        }

        // Otherwise, we'll need to whip up a fresh extract text instance.
        return tap(
            new ExtractTextPlugin(this.extractFileName()),
            extractPlugin => {
                extractPlugin.isNew = true;
            }
        );
    }

    /**
     * Determine the extract file name.
     */
    extractFileName() {
        let fileName =
            typeof Config.extractVueStyles === 'string'
                ? Config.extractVueStyles
                : '/css/vue-styles.css';

        return fileName.replace(Config.publicPath, '').replace(/^\//, '');
    }
}

module.exports = Vue;
