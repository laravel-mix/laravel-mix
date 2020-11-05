const argv = require('yargs').argv;

module.exports = function() {
    return {
        /**
         * Determine if webpack should be triggered in a production environment.
         *
         * @type {Boolean}
         */
        production: process.env.NODE_ENV === 'production' || process.argv.includes('-p'),

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
            port: !!argv.hmrPort ? argv.hmrPort : '8080'
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
         * May be set to false to disable it.
         *
         * @type {Boolean|Object}
         */
        autoprefixer: {},

        /**
         * The public path for the build.
         *
         * @type {String}
         */
        publicPath: '',

        /**
         * The path for the runtime chunk (`manifest.js`).
         *
         * Defaults to being placed next to compiled JS files.
         *
         * @type {String|null}
         */
        runtimeChunkPath: null,

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

            return require('./BabelConfig').generate(this.babelConfig, babelRcPath);
        },

        /**
         * Determine if CSS relative url()s should be resolved by webpack.
         * Disabling this can improve performance greatly.
         *
         * @type {Boolean}
         */
        processCssUrls: true,

        /**
         * Terser-specific settings for Webpack.
         *
         * See: https://github.com/webpack-contrib/terser-webpack-plugin#options
         *
         * @type {Object}
         */
        terser: {
            parallel: true,
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
         * Disabled if set to false.
         *
         * See: https://cssnano.co/optimisations/
         *
         * @type {Boolean|Object}
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
         * Options to pass to vue-loader
         *
         * @deprecated Use `.vue({options: {…}})` instead
         *
         * @type {any}
         */
        vue: {},

        /**
         * Merge the given options with the current defaults.
         *
         * @param {object} options
         */
        merge(options) {
            Object.keys(options).forEach(key => {
                this[key] = options[key];
            });
        }
    };
};
