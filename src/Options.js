module.exports = {
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
