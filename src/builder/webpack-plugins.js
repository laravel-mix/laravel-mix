let webpack = require('webpack');
let FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
let MixDefinitionsPlugin = require('../webpackPlugins/MixDefinitionsPlugin');
let BuildCallbackPlugin = require('../webpackPlugins/BuildCallbackPlugin');
let CustomTasksPlugin = require('../webpackPlugins/CustomTasksPlugin');
let ManifestPlugin = require('../webpackPlugins/ManifestPlugin');
let MockEntryPlugin = require('../webpackPlugins/MockEntryPlugin');
let UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = function() {
    let plugins = [];

    // If the user didn't declare any JS compilation, we still need to
    // use a temporary script to force a compile. This plugin will
    // handle the process of deleting the compiled script.
    if (!Mix.bundlingJavaScript) {
        plugins.push(new MockEntryPlugin());
    }

    // Activate better error feedback in the console.
    plugins.push(
        new FriendlyErrorsWebpackPlugin({ clearConsole: Config.clearConsole })
    );

    // Add support for webpack 3 scope hoisting.
    if (Mix.inProduction()) {
        plugins.push(new webpack.optimize.ModuleConcatenationPlugin());
    }

    // Activate support for Mix_ .env definitions.
    plugins.push(
        MixDefinitionsPlugin.build({
            NODE_ENV: Mix.inProduction()
                ? 'production'
                : process.env.NODE_ENV || 'development'
        })
    );

    if (!Mix.components.get('version') && Mix.isUsing('hmr')) {
        plugins.push(new webpack.NamedModulesPlugin());
    }

    // Add some general Webpack loader options.
    plugins.push(
        new webpack.LoaderOptionsPlugin({
            minimize: Mix.inProduction(),
            options: {
                context: __dirname,
                output: { path: './' }
            }
        })
    );

    // If we're in production environment, with Uglification turned on, we'll
    // clean up and minify all of the user's JS and CSS automatically.
    if (Mix.inProduction() && Config.uglify) {
        plugins.push(new UglifyJSPlugin(Config.uglify));
    }

    // Handle all custom, non-webpack tasks.
    plugins.push(new ManifestPlugin());

    // Handle all custom, non-webpack tasks.
    plugins.push(new CustomTasksPlugin());

    // Notify the rest of our app when Webpack has finished its build.
    plugins.push(
        new BuildCallbackPlugin(stats => Mix.dispatch('build', stats))
    );

    return plugins;
};
