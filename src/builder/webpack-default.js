let TerserPlugin = require('terser-webpack-plugin');
let OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = function() {
    const optimization = Mix.inProduction()
        ? {
              minimizer: [
                  new TerserPlugin(Config.terser),
                  new OptimizeCSSAssetsPlugin({
                      cssProcessorPluginOptions: {
                          preset: ['default', Config.cssNano]
                      }
                  })
              ]
          }
        : {};

    return {
        context: Mix.paths.root(),

        mode: Mix.inProduction() ? 'production' : 'development',

        entry: {},

        output: {
            chunkFilename: '[name].[hash:5].js'
        },

        module: { rules: [] },

        plugins: [],

        stats: {
            hash: false,
            version: false,
            timings: false,
            children: false,
            errorDetails: false,
            entrypoints: false,
            performance: Mix.inProduction(),
            chunks: false,
            modules: false,
            reasons: false,
            source: false,
            publicPath: false,
            builtAt: false
        },

        performance: {
            hints: false
        },

        optimization: {
            ...optimization,
            namedModules: true,
            namedChunks: true,
            splitChunks: {
                minChunks: 1,
                cacheGroups: {
                    default: false
                }
            }
        },

        devtool: Config.sourcemaps,

        devServer: {
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            contentBase: path.resolve(Config.publicPath),
            historyApiFallback: true,
            noInfo: true,
            compress: true,
            quiet: true
        }
    };
};
