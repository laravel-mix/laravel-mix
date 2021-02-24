let MixDefinitionsPlugin = require('../webpackPlugins/MixDefinitionsPlugin');
let BuildCallbackPlugin = require('../webpackPlugins/BuildCallbackPlugin');
let CustomTasksPlugin = require('../webpackPlugins/CustomTasksPlugin');
let ManifestPlugin = require('../webpackPlugins/ManifestPlugin');
let MockEntryPlugin = require('../webpackPlugins/MockEntryPlugin');
let BuildOutputPlugin = require('../webpackPlugins/BuildOutputPlugin');
let WebpackBar = require('webpackbar');

module.exports = function () {
    let plugins = [];

    // If the user didn't declare any JS compilation, we still need to
    // use a temporary script to force a compile. This plugin will
    // handle the process of deleting the compiled script.
    if (!Mix.bundlingJavaScript) {
        plugins.push(new MockEntryPlugin());
    }

    // Activate support for Mix_ .env definitions.
    plugins.push(
        MixDefinitionsPlugin.build({
            NODE_ENV: Mix.inProduction()
                ? 'production'
                : process.env.NODE_ENV || 'development'
        })
    );

    // Handle the creation of the mix-manifest.json file.
    plugins.push(new ManifestPlugin());

    // Handle all custom, non-webpack tasks.
    plugins.push(new CustomTasksPlugin());

    // Notify the rest of our app when Webpack has finished its build.
    plugins.push(new BuildCallbackPlugin(stats => Mix.dispatch('build', stats)));

    // Enable custom output when the Webpack build completes.
    plugins.push(
        new BuildOutputPlugin({
            clearConsole: Config.clearConsole,
            showRelated: true
        })
    );

    if (process.env.NODE_ENV !== 'test') {
        plugins.push(new WebpackBar({ name: 'Mix' }));
    }

    return plugins;
};
