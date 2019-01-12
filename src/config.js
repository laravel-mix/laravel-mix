module.exports = function() {
    return {
        /**
         * Determine if webpack should be triggered in a production environment.
         *
         * @type {Boolean}
         */
        production:
            process.env.NODE_ENV === 'production' ||
            process.argv.includes('-p'),

        /**
         * Determine if we should enable hot reloading.
         *
         * @type {Boolean}
         */
        hmr: process.argv.includes('--hot'),

        /**
         * Hostname and port used for the hot reload module
         *
         * @type {Object}
         */
        hmrOptions: {
            host: 'localhost',
            port: '8080'
        },

        /**
         * PostCSS plugins to be applied to compiled CSS.
         *
         * See: https://github.com/postcss/postcss/blob/master/docs/plugins.md
         *
         * @type {Array}
         */
        postCss: [],

        /**
         * Determine if we should enable autoprefixer by default.
         *
         * @type {Boolean}
         */
        autoprefixer: {
            enabled: true,
            options: {}
        },

        /**
         * Determine if Mix should remove unused selectors from your CSS bundle.
         * You may provide a boolean, or object for the Purify plugin.
         *
         * https://github.com/webpack-contrib/purifycss-webpack#options
         *
         * @type {Boolean|object}
         */
        purifyCss: false,

        /**
         * The public path for the build.
         *
         * @type {String}
         */
        publicPath: '',

        /**
         * Determine if error notifications should be displayed for each build.
         *
         * @type {Boolean}
         */
        notifications: {
            onSuccess: true,
            onFailure: true
        },

        /**
         * Determine if sourcemaps should be created for the build.
         *
         * @type {Boolean}
         */
        sourcemaps: false,

        /**
         * The resource root for the build.
         *
         * @type {String}
         */
        resourceRoot: '/',

        /**
         * Image Loader defaults.
         * See: https://github.com/thetalecrafter/img-loader#options
         *
         * @type {Object}
         */
        imgLoaderOptions: {
            enabled: true,
            gifsicle: {},
            mozjpeg: {},
            optipng: {},
            svgo: {}
        },

        /**
         * File Loader directory defaults.
         *
         * @type {Object}
         */
        fileLoaderDirs: {
            images: 'images',
            fonts: 'fonts'
        },

        /**
         * The default Babel configuration.
         *
         * @type {String} babelRcPath
         */
        babel: function(babelRcPath) {
            babelRcPath = babelRcPath || Mix.paths.root('.babelrc');

            return require('./BabelConfig').generate(
                this.babelConfig,
                babelRcPath
            );
        },

        /**
         * Determine if CSS relative url()s should be calculated by Sass Webpack,
         * using resolve-url-loader. Disabling this can improve performance
         * greatly.
         *
         * @type {Boolean}
         */
        processCssUrls: true,

        /**
         * Should we extract .vue component styles into a dedicated file?
         * You may provide a boolean, or a dedicated path to extract to.
         *
         * Ex: extractVueStyles: '/css/vue.css'
         *
         * @type {Boolean|string}
         */
        extractVueStyles: false,

        /**
         * A file path with global styles that shuold be imported into every Vue component.
         *
         * See: https://vue-loader.vuejs.org/en/configurations/pre-processors.html#loading-a-global-settings-file
         *
         * @type {string}
         */
        globalVueStyles: '',

        /**
         * Terser-specific settings for Webpack.
         *
         * See: https://github.com/webpack-contrib/terser-webpack-plugin#options
         *
         * @type {Object}
         */
        terser: {
            cache: true,
            parallel: true,
            sourceMap: true,
            terserOptions: {
                compress: {
                    warnings: false
                },
                output: {
                    comments: false
                }
            }
        },

        /**
         * cssnano-specific settings for Webpack.
         *
         * See: https://cssnano.co/optimisations/
         *
         * @type {Object}
         */
        cssNano: {},

        /**
         * CleanCss-specific settings for Webpack.
         *
         * See: https://github.com/jakubpawlowicz/clean-css#constructor-options
         *
         * @type {Object}
         */
        cleanCss: {},

        /**
         * Custom Webpack-specific configuration to merge/override Mix's.
         *
         * @type {Object}
         */
        webpackConfig: {},

        /**
         * Custom Babel configuration to be merged with Mix's defaults.
         *
         * @type {Object}
         */
        babelConfig: {},

        /**
         * Determine if Mix should ask the friendly errors plugin to
         * clear the console before outputting the results or not.
         *
         * https://github.com/geowarin/friendly-errors-webpack-plugin#options
         *
         * @type {Boolean}
         */
        clearConsole: true,

        /**
         * Merge the given options with the current defaults.
         *
         * @param {object} options
         */
        merge(options) {
            let mergeWith = require('lodash').mergeWith;

            mergeWith(this, options, (objValue, srcValue) => {
                if (Array.isArray(objValue)) {
                    return objValue.concat(srcValue);
                }
            });
        }
    };
};
