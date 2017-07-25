let webpack = require('webpack');
let FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
let MockEntryPlugin = require('../plugins/MockEntryPlugin');
let MixDefinitionsPlugin = require('../plugins/MixDefinitionsPlugin');
let BuildCallbackPlugin = require('../plugins/BuildCallbackPlugin');
let CustomTasksPlugin = require('../plugins/CustomTasksPlugin');
let ManifestPlugin = require('../plugins/ManifestPlugin');
let WebpackChunkHashPlugin = require('webpack-chunk-hash');
let UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = function () {
    let plugins = [];

    // Activate better error feedback in the console.
    plugins.push(
        new FriendlyErrorsWebpackPlugin({ clearConsole: Config.clearConsole })
    );


    // Activate Webpack autoloading support.
    plugins.push(
        new webpack.ProvidePlugin(Config.autoload)
    );


    // Add support for webpack 3 scope hoisting.
    if (Mix.inProduction()) {
        plugins.push(
            new webpack.optimize.ModuleConcatenationPlugin()
        );
    }


    // Activate support for Mix_ .env definitions.
    plugins.push(
        MixDefinitionsPlugin.build({
            NODE_ENV: Mix.inProduction()
                ? 'production'
                : (process.env.NODE_ENV || 'development')
        })
    );


    // Add automatic CSS Purification support.
    if (Mix.isUsing('purifyCss')) {
        let CssPurifierPlugin = require('../plugins/CssPurifierPlugin');

        plugins.push(CssPurifierPlugin.build());
    }


    // Activate OS notifications for each compile.
    if (Mix.isUsing('notifications')) {
        let WebpackNotifierPlugin = require('webpack-notifier');

        plugins.push(
            new WebpackNotifierPlugin({
                title: 'Laravel Mix',
                alwaysNotify: Config.notifications.onSuccess,
                contentImage: Mix.paths.root('node_modules/laravel-mix/icons/laravel.png')
            })
        );
    }


    // Add support for browser reloading with BrowserSync.
    if (Mix.isUsing('browserSync')) {
        let BrowserSyncPlugin = require('browser-sync-webpack-plugin');

        plugins.push(
            new BrowserSyncPlugin(
                Object.assign({
                    host: 'localhost',
                    port: 3000,
                    proxy: 'app.dev',
                    files: [
                        'app/**/*.php',
                        'resources/views/**/*.php',
                        'public/js/**/*.js',
                        'public/css/**/*.css'
                    ]
                }, Config.browserSync),
                { reload: false }
            )
        );
    }


    // If the user didn't declare any JS compilation, we still need to
    // use a temporary script to force a compile. This plugin will
    // handle the process of deleting the compiled script.
    if (! Config.js.length) {
        plugins.push(new MockEntryPlugin);
    }


    // Activate the appropriate Webpack versioning plugin, based on the environment.
    if (Mix.isUsing('versioning')) {
        plugins.push(
            new webpack[Mix.inProduction() ? 'HashedModuleIdsPlugin': 'NamedModulesPlugin'](),
            new WebpackChunkHashPlugin()
        );
    } else if (Mix.isUsing('hmr')) {
        plugins.push(
            new webpack.NamedModulesPlugin()
        );
    }


    // Add some general Webpack loader options.
    plugins.push(new webpack.LoaderOptionsPlugin({
        minimize: Mix.inProduction(),
        options: {
            context: __dirname,
            output: { path: './' }
        }
    }));


    // If we're in production environment, with Uglification turned on, we'll
    // clean up and minify all of the user's JS and CSS automatically.
    if (Mix.inProduction() && Config.uglify) {
        plugins.push(
            new UglifyJSPlugin(Config.uglify)
        );
    }


    if (Config.preprocessors.fastSass && Config.preprocessors.fastSass.length) {
        plugins.push(
            new (require('../plugins/FastSassPlugin'))(Config.preprocessors.fastSass)
        );
    }


    // Handle all custom, non-webpack tasks.
    plugins.push(
        new ManifestPlugin()
    );


    // Handle all custom, non-webpack tasks.
    plugins.push(
        new CustomTasksPlugin()
    );


    // Notify the rest of our app when Webpack has finished its build.
    plugins.push(
        new BuildCallbackPlugin(stats => Mix.dispatch('build', stats))
    );

    return plugins;
};
