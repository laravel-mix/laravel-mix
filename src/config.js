// @ts-check

const yargs = require('yargs/yargs');

/** @typedef {import("@babel/core").TransformOptions} BabelConfig */

/**
 *
 * @param {import("./Mix")} mix
 */
module.exports = function (mix) {
    // TODO: Remove in Mix 7 -- Here for backwards compat if a plugin requires this file
    mix = mix || global.Mix;

    const argv = yargs(process.argv.slice(2))
        .options({
            https: { type: 'boolean', default: false },
            hmrPort: { type: 'string', default: '8080' },
            p: { type: 'boolean', default: false },
            hot: { type: 'boolean', default: false }
        })
        .parseSync();

    return {
        /**
         * Determine if webpack should be triggered in a production environment.
         *
         * @type {Boolean}
         */
        production: process.env.NODE_ENV === 'production' || argv.p,

        /**
         * Determine if we should enable hot reloading.
         *
         * @type {Boolean}
         */
        hmr: argv.hot,

        /**
         * Hostname and port used for the hot reload module
         */
        hmrOptions: {
            https: argv.https,
            host: 'localhost',
            port: argv.hmrPort
        },

        /**
         * PostCSS plugins to be applied to compiled CSS.
         *
         * See: https://github.com/postcss/postcss/blob/master/docs/plugins.md
         *
         * @type {import('postcss').AcceptedPlugin[]}
         */
        postCss: [],

        /**
         * Determine if we should enable autoprefixer by default.
         * May be set to false to disable it.
         *
         * @type {false|import('autoprefixer').Options}
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
         * @type {false | {onSuccess: boolean, onFailure: boolean}}
         */
        notifications: {
            onSuccess: true,
            onFailure: true
        },

        /**
         * Determine if sourcemaps should be created for the build.
         *
         * @type {false | string}
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
         * @type {Boolean|Object}
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
         */
        fileLoaderDirs: {
            images: 'images',
            fonts: 'fonts'
        },

        /**
         * The Babel configuration to use when compiling
         */
        babel: function () {
            const BabelConfig = require('./BabelConfig');

            return new BabelConfig(mix).generate();
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
         * @type {import('../types/terser').TerserPluginOptions}
         */
        terser: {
            parallel: true,
            terserOptions: {
                compress: true,
                output: {
                    comments: false
                }
            }
        },

        /**
         * cssnano-specific settings for Webpack.
         * Disabled if set to false.
         *
         * See: https://cssnano.co/docs/optimisations
         *
         * @type {false|Object}
         */
        cssNano: {},

        /**
         * CleanCss-specific settings for Webpack.
         *
         * See: https://github.com/clean-css/clean-css#constructor-options
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
         * @type {BabelConfig}
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
         * Enable legacy node -> browser polyfills for things like `process` and `Buffer`.
         *
         * @type {Boolean}
         */
        legacyNodePolyfills: true,

        /**
         * Options to pass to vue-loader
         *
         * @deprecated Use `.vue({options: {…}})` instead
         *
         * @type {any}
         */
        vue: {},

        /**
         * The name / path to the mix manifest.
         * The path is relative to the public path.
         *
         * Set to `false` to disable manifest generation.
         *
         * @type {string | false}
         */
        manifest: `mix-manifest.json`,

        /**
         * Sets the css module identifier pattern
         *
         * For more information see https://github.com/webpack-contrib/css-loader/tree/v5.2.7#localidentname
         */
        cssModuleIdentifier: '[hash:base64]',

        /**
         * Merge the given options with the current defaults.
         *
         * @param {Record<string, any>} options
         */
        merge(options) {
            Object.keys(options).forEach(key => {
                this[key] = options[key];
            });
        }
    };
};
