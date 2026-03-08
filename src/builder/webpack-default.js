let path = require('path');
let { SwcJsMinimizerRspackPlugin } = require('@rspack/core');

/**
 *
 * @param {import("../Mix")} mix
 * @returns {import("webpack").Configuration & {devServer?: import("webpack").WebpackOptionsNormalized["devServer"]}}
 */
module.exports = function (mix) {
    // TODO: Remove in Mix 7 -- Here for backwards compat if a plugin requires this file
    mix = mix || global.Mix;

    return {
        context: mix.paths.root(),

        mode: mix.inProduction() ? 'production' : 'development',

        infrastructureLogging: mix.isWatching() ? { level: 'none' } : {},

        entry: {},

        output: {
            assetModuleFilename: '[name][ext]?[hash]',
            chunkFilename: '[name].[hash:5].js'
        },

        module: { rules: [] },

        plugins: [],

        resolve: {
            extensions: ['*', '.wasm', '.mjs', '.js', '.jsx', '.json'],
            roots: [path.resolve(mix.config.publicPath)]
        },

        stats: {
            preset: 'errors-warnings',
            performance: mix.inProduction()
        },

        performance: {
            hints: false
        },

        optimization: mix.inProduction()
            ? {
                  providedExports: true,
                  sideEffects: true,
                  usedExports: true,
                  minimizer: [new SwcJsMinimizerRspackPlugin()]
              }
            : {},

        devtool: mix.config.sourcemaps,

        // @ts-ignore
        devServer: {
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            static: path.resolve(mix.config.publicPath),
            historyApiFallback: true,
            compress: true,
            allowedHosts: 'all'
        },

        watchOptions: {
            ignored: /node_modules/
        }
    };
};
