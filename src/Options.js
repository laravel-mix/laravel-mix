module.exports = {
    /**
     * Determine if webpack should be triggered in a production environment.
     *
     * @type {Booolean}
     */
    production:  (process.env.NODE_ENV === 'production' || process.argv.includes('-p')),


    /**
     * Determine if we should enable hot reloading.
     *
     * @type {Boolean}
     */
    hmr: process.argv.includes('--hot'),


    /**
     * Determine if sourcemaps should be created for the build.
     *
     * @type {Boolean}
     */
    sourcemaps: false,


    /**
     * Determine if notifications should be displayed for each build.
     *
     * @type {Boolean}
     */
    notifications: true,


    /**
     * The public path for the build.
     *
     * @type {String}
     */
    publicPath: '',


    /**
     * The resource root for the build.
     *
     * @type {String}
     */
    resourceRoot: '/',


    /**
     * The default Babel configuration.
     *
     * @type {Object}
     */
    babel: {
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
    },


    /**
     * Determine if the bundled assets should be versioned.
     *
     * @type {Boolean}
     */
    versioning: false,


    /**
     * Whether to extract .vue component styles into a dedicated file.
     * You may provide a boolean, or a dedicated path to extract to.
     *
     * @type {Boolean|string}
     */
    extractVueStyles: false,


    /**
     * Determine if CSS url()s should be processed by Webpack.
     *
     * @type {Boolean}
     */
    processCssUrls: true,


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
     * vue-loader specific options.
     *
     * @type {Object}
     */
    vue: {
        preLoaders: {},
        postLoaders: {}
    },


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
     * CleanCss-specific settings for Webpack.
     *
     * See: https://github.com/jakubpawlowicz/clean-css#constructor-options
     *
     * @type {Object}
     */
    cleanCss: {
    },

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
