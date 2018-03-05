let paths = new (require('./Paths'))();
let webpackMerge = require('webpack-merge');

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
         * A list of custom assets that are being compiled outside of Webpack.
         *
         * @type {Array}
         */
        customAssets: [],

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
         * vue-loader specific options.
         *
         * @type {Object}
         */
        vue: {
            preLoaders: {},
            postLoaders: {},
            esModule: false
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
         * @type {Object}
         */
        babel: function() {
            let options = {};

            tap(Mix.paths.root('.babelrc'), babelrc => {
                if (File.exists(babelrc)) {
                    options = JSON.parse(File.find(babelrc).read());
                }
            });

            if (this.babelConfig) {
                options = webpackMerge.smart(options, this.babelConfig);
            }

            return webpackMerge.smart(
                {
                    cacheDirectory: true,
                    presets: [
                        [
                            'env',
                            {
                                modules: false,
                                targets: {
                                    browsers: ['> 2%'],
                                    uglify: true
                                }
                            }
                        ]
                    ],
                    plugins: [
                        'transform-object-rest-spread',
                        [
                            'transform-runtime',
                            {
                                polyfill: false,
                                helpers: false
                            }
                        ]
                    ]
                },
                options
            );
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
         * File with global styles to be imported in every component.
         *
         * See: https://vue-loader.vuejs.org/en/configurations/pre-processors.html#loading-a-global-settings-file
         *
         * @type {string}
         */
        globalVueStyles: '',

        /**
         * Uglify-specific settings for Webpack.
         *
         * See: https://github.com/mishoo/UglifyJS2#compressor-options
         *
         * @type {Object}
         */
        uglify: {
            sourceMap: true,
            uglifyOptions: {
                compress: {
                    warnings: false
                },
                output: {
                    comments: false
                }
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
