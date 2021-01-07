let path = require('path');
let TerserPlugin = require('terser-webpack-plugin');

module.exports = function () {
    return {
        context: Mix.paths.root(),

        mode: Mix.inProduction() ? 'production' : 'development',

        infrastructureLogging: Mix.isWatching() ? { level: 'none' } : {},

        entry: {},

        output: {
            chunkFilename: '[name].[hash:5].js'
        },

        module: { rules: [] },

        plugins: [],

        resolve: {
            extensions: ['*', '.wasm', '.mjs', '.js', '.jsx', '.json'],
            roots: [path.resolve(Config.publicPath)]
        },

        stats: {
            preset: 'errors-warnings',
            performance: Mix.inProduction()
        },

        performance: {
            hints: false
        },

        optimization: Mix.inProduction()
            ? {
                  providedExports: true,
                  sideEffects: true,
                  usedExports: true,
                  minimizer: [new TerserPlugin(Config.terser)]
              }
            : {},

        devtool: Config.sourcemaps,

        devServer: {
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            static: path.resolve(Config.publicPath),
            historyApiFallback: true,
            compress: true,
            firewall: false
        },

        watchOptions: {
            ignored: /node_modules/
        }
    };
};
