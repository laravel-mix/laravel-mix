let paths = new (require('./Paths'));

module.exports = function () {
    return {
        /**
         * Determine if webpack should be triggered in a production environment.
         *
         * @type {Booolean}
         */
        production:  (process.env.NODE_ENV === 'production' || process.argv.includes('-p')),


        /**
         * The list of scripts to bundle.
         *
         * @type {Array}
         */
        js: [],


        /**
         * A list of custom assets that are being compiled outside of Webpack.
         *
         * @type {Array}
         */
        customAssets: [],


        /**
         * Sets of files that should be copied to a new location.
         *
         * @type {Array}
         */
        copy: [],


        /**
         * Sets of files that need to be combined.
         *
         * @type {Array}
         */
        combine: [],


        /**
         * The list of vendor chunks to extract.
         *
         * @type {Array}
         */
        extractions: [],


        /**
         * A list of CSS preprocessing to be performed.
         *
         * @type {Object}
         */
        preprocessors: {},


        /**
         * Does the project require React support?
         *
         * @type {Boolean}
         */
        react: false,


        /**
         * Does the project require TypeScript support?
         *
         * @type {Boolean}
         */
        typeScript: false,


        /**
         * A list of variables that should be autoloaded by webpack.
         *
         * @type {Object}
         */
        autoload: {},


        /**
         * Does the project require BrowserSync support?
         *
         * @type {Boolean}
         */
        browserSync: false,


        /**
         * Determine if we should enable hot reloading.
         *
         * @type {Boolean}
         */
        hmr: process.argv.includes('--hot'),


        /**
         * PostCSS plugins to be applied to compiled CSS.
         *
         * See: https://github.com/postcss/postcss/blob/master/docs/plugins.md
         *
         * @type {Array}
         */
        postCss: [
            require('autoprefixer')
        ],


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
        publicPath: 'public',


        /**
         * Does the project require React support?
         *
         * @type {Boolean}
         */
        versioning: false,


        /**
         * A list of files to version.
         *
         * @type {Array}
         */
        version: [],


        /**
         * Determine if notifications should be displayed for each build.
         *
         * @type {Boolean}
         */
        notifications: true,


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
         * vue-loader specific options.
         *
         * @type {Object}
         */
        vue: {
            preLoaders: {},
            postLoaders: {}
        },


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
            svgo: {},
        },


        /**
         * The default Babel configuration.
         *
         * @type {Object}
         */
        babel: function () {
            if (File.exists(Mix.paths.root('.babelrc'))) return '?cacheDirectory';

            let options = {
                cacheDirectory: true,
                presets: [
                    ['env', {
                        'modules': false,
                        'targets': {
                            'browsers': ['> 2%'],
                            uglify: true
                        }
                    }]
                ]
            };

            if (this.react) {
                options.presets.push('react');
            }

            return options;
        },

        /**
         * Determine if CSS url()s should be processed by Webpack.
         *
         * @type {Boolean}
         */
        processCssUrls: true,


        /**
         * Whether to extract .vue component styles into a dedicated file.
         * You may provide a boolean, or a dedicated path to extract to.
         *
         * @type {Boolean|string}
         */
        extractVueStyles: false,

        /**
         * Uglify-specific settings for Webpack.
         *
         * See: https://github.com/mishoo/UglifyJS2#compressor-options
         *
         * @type {Object}
         */
        uglify: {
            sourceMap: true,
            compress: {
                warnings: false,
                drop_console: true
            }
        },


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
