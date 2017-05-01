let path = require('path');
let glob = require('glob');
let webpack = require('webpack');
let Mix = require('laravel-mix').config;
let webpackPlugins = require('laravel-mix').plugins;
let dotenv = require('dotenv')

/*
 |--------------------------------------------------------------------------
 | Load Environment Variables
 |--------------------------------------------------------------------------
 |
 | Load environment variables from .env file. dotenv will never modify
 | any environment variables that have already been set.
 |
 */

dotenv.config({
    path: Mix.Paths.root('.env')
});



/*
 |--------------------------------------------------------------------------
 | Mix Initialization
 |--------------------------------------------------------------------------
 |
 | As our first step, we'll require the project's Laravel Mix file
 | and record the user's requested compilation and build steps.
 | Once those steps have been recorded, we may get to work.
 |
 */

Mix.initialize();



/*
 |--------------------------------------------------------------------------
 | Webpack Context
 |--------------------------------------------------------------------------
 |
 | This prop will determine the appropriate context, when running Webpack.
 | Since you have the option of publishing this webpack.config.js file
 | to your project root, we will dynamically set the path for you.
 |
 */

module.exports.context = Mix.Paths.root();



/*
 |--------------------------------------------------------------------------
 | Webpack Entry
 |--------------------------------------------------------------------------
 |
 | We'll first specify the entry point for Webpack. By default, we'll
 | assume a single bundled file, but you may call Mix.extract()
 | to make a separate bundle specifically for vendor libraries.
 |
 */

module.exports.entry = Mix.entry().get();



/*
 |--------------------------------------------------------------------------
 | Webpack Output
 |--------------------------------------------------------------------------
 |
 | Webpack naturally requires us to specify our desired output path and
 | file name. We'll simply echo what you passed to with Mix.js().
 | Note that, for Mix.version(), we'll properly hash the file.
 |
 */

module.exports.output = Mix.output();



/*
 |--------------------------------------------------------------------------
 | Rules
 |--------------------------------------------------------------------------
 |
 | Webpack rules allow us to register any number of loaders and options.
 | Out of the box, we'll provide a handful to get you up and running
 | as quickly as possible, though feel free to add to this list.
 |
 */

let plugins = [];

if (Mix.options.extractVueStyles) {
    var vueExtractTextPlugin = Mix.vueExtractTextPlugin();

    plugins.push(vueExtractTextPlugin);
}

let rules = [
    {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
            loaders: Mix.options.extractVueStyles ? {
                js: 'babel-loader' + Mix.babelConfig(),
                scss: vueExtractTextPlugin.extract({
                    use: 'css-loader!sass-loader',
                    fallback: 'vue-style-loader'
                }),
                sass: vueExtractTextPlugin.extract({
                    use: 'css-loader!sass-loader?indentedSyntax',
                    fallback: 'vue-style-loader'
                }),
                less: vueExtractTextPlugin.extract({
                    use: 'css-loader!less-loader',
                    fallback: 'vue-style-loader'
                }),
                stylus: vueExtractTextPlugin.extract({
                    use: 'css-loader!stylus-loader?paths[]=node_modules',
                    fallback: 'vue-style-loader'
                }),
                css: vueExtractTextPlugin.extract({
                    use: 'css-loader',
                    fallback: 'vue-style-loader'
                })
            }: {
                js: 'babel-loader' + Mix.babelConfig(),
                scss: 'vue-style-loader!css-loader!sass-loader',
                sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax',
                less: 'vue-style-loader!css-loader!less-loader',
                stylus: 'vue-style-loader!css-loader!stylus-loader?paths[]=node_modules'
            },

            postcss: Mix.options.postCss,

            preLoaders: Mix.options.vue.preLoaders,

            postLoaders: Mix.options.vue.postLoaders
        }
    },

    {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader' + Mix.babelConfig()
    },

    {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader']
    },

    {
        test: /\.html$/,
        loaders: ['html-loader']
    },

    {
        test: /\.(png|jpe?g|gif)$/,
        loaders: [
            {
                loader: 'file-loader',
                options: {
                    name: path => {
                        if (! /node_modules|bower_components/.test(path)) {
                            return 'images/[name].[ext]?[hash]';
                        }

                        return 'images/vendor/' + path
                            .replace(/\\/g, '/')
                            .replace(
                                /((.*(node_modules|bower_components))|images|image|img|assets)\//g, ''
                            ) + '?[hash]';
                    },
                    publicPath: Mix.options.resourceRoot
                }
            },
            'img-loader'
        ]
    },

    {
        test: /\.(woff2?|ttf|eot|svg|otf)$/,
        loader: 'file-loader',
        options: {
            name: path => {
                if (! /node_modules|bower_components/.test(path)) {
                    return 'fonts/[name].[ext]?[hash]';
                }

                return 'fonts/vendor/' + path
                    .replace(/\\/g, '/')
                    .replace(
                        /((.*(node_modules|bower_components))|fonts|font|assets)\//g, ''
                    ) + '?[hash]';
            },
            publicPath: Mix.options.resourceRoot
        }
    },

    {
        test: /\.(cur|ani)$/,
        loader: 'file-loader',
        options: {
            name: '[name].[ext]?[hash]',
            publicPath: Mix.options.resourceRoot
        }
    }
];

let sassRule = {
    test: /\.s[ac]ss$/,
    loaders: ['style-loader', 'css-loader', 'sass-loader']
};

if (Mix.preprocessors) {
    sassRule.exclude = Mix.preprocessors.map(preprocessor => preprocessor.test());
}

rules.push(sassRule);

if (Mix.preprocessors) {
    Mix.preprocessors.forEach(preprocessor => {
        rules.push(preprocessor.rules());

        plugins.push(preprocessor.extractPlugin);
    });
}

module.exports.module = { rules };



/*
 |--------------------------------------------------------------------------
 | Resolve
 |--------------------------------------------------------------------------
 |
 | Here, we may set any options/aliases that affect Webpack's resolving
 | of modules. To begin, we will provide the necessary Vue alias to
 | load the Vue common library. You may delete this, if needed.
 |
 */

module.exports.resolve = {
    extensions: ['*', '.js', '.jsx', '.vue'],

    alias: {
        'vue$': 'vue/dist/vue.common.js'
    }
};



/*
 |--------------------------------------------------------------------------
 | Stats
 |--------------------------------------------------------------------------
 |
 | By default, Webpack spits a lot of information out to the terminal,
 | each you time you compile. Let's keep things a bit more minimal
 | and hide a few of those bits and pieces. Adjust as you wish.
 |
 */

module.exports.stats = {
    hash: false,
    version: false,
    timings: false,
    children: false,
    errors: false
};

process.noDeprecation = true;

module.exports.performance = { hints: false };



/*
 |--------------------------------------------------------------------------
 | Devtool
 |--------------------------------------------------------------------------
 |
 | Sourcemaps allow us to access our original source code within the
 | browser, even if we're serving a bundled script or stylesheet.
 | You may activate sourcemaps, by adding Mix.sourceMaps().
 |
 */

module.exports.devtool = Mix.options.sourcemaps;



/*
 |--------------------------------------------------------------------------
 | Webpack Dev Server Configuration
 |--------------------------------------------------------------------------
 |
 | If you want to use that flashy hot module replacement feature, then
 | we've got you covered. Here, we'll set some basic initial config
 | for the Node server. You very likely won't want to edit this.
 |
 */
module.exports.devServer = {
     headers: {
        "Access-Control-Allow-Origin": "*"
    },
    historyApiFallback: true,
    noInfo: true,
    compress: true,
    quiet: true
};



/*
 |--------------------------------------------------------------------------
 | Plugins
 |--------------------------------------------------------------------------
 |
 | Lastly, we'll register a number of plugins to extend and configure
 | Webpack. To get you started, we've included a handful of useful
 | extensions, for versioning, OS notifications, and much more.
 |
 */

plugins.push(
    new webpack.ProvidePlugin(Mix.autoload || {}),

    new webpackPlugins.FriendlyErrorsWebpackPlugin({ clearConsole: Mix.options.clearConsole }),

    new webpackPlugins.StatsWriterPlugin({
        filename: 'mix-manifest.json',
        transform: Mix.manifest.transform.bind(Mix.manifest),
    }),

    new webpack.LoaderOptionsPlugin({
        minimize: Mix.inProduction,
        options: {
            postcss: Mix.options.postCss,
            context: __dirname,
            output: { path: './' }
        }
    })
);

if (Mix.browserSync) {
    plugins.push(
        new webpackPlugins.BrowserSyncPlugin(
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
            }, Mix.browserSync),
            {
                reload: false
            }
        )
    );
}

if (Mix.options.notifications) {
    plugins.push(
        new webpackPlugins.WebpackNotifierPlugin({
            title: 'Laravel Mix',
            alwaysNotify: true,
            contentImage: Mix.Paths.root('node_modules/laravel-mix/icons/laravel.png')
        })
    );
}

if (Mix.copy.length) {
    new webpackPlugins.CopyWebpackPlugin(Mix.copy);
}

if (Mix.entry().hasExtractions()) {
    plugins.push(
        new webpack.optimize.CommonsChunkPlugin({
            names: Mix.entry().getExtractions(),
            minChunks: Infinity
        })
    );
}

if (Mix.options.versioning) {
    plugins.push(
        new webpack[Mix.inProduction ? 'HashedModuleIdsPlugin': 'NamedModulesPlugin'](),
        new webpackPlugins.WebpackChunkHashPlugin()
    );
}

if (Mix.options.purifyCss) {
    let PurifyCSSPlugin = require('purifycss-webpack');

    // By default, we'll scan all Blade and Vue files in our project.
    let paths = glob.sync(Mix.Paths.root('resources/views/**/*.blade.php')).concat(
        Mix.entry().scripts.reduce((carry, js) => {
            return carry.concat(glob.sync(js.base + '/**/*.vue'));
        }, [])
    );

    plugins.push(new PurifyCSSPlugin(
        Object.assign({ paths }, Mix.options.purifyCss, { minimize: Mix.inProduction })
    ));
}

if (Mix.inProduction && Mix.options.uglify) {
    plugins.push(
        new webpack.optimize.UglifyJsPlugin(Mix.options.uglify)
    );
}

plugins.push(
    new webpack.DefinePlugin(
        Mix.definitions({
            NODE_ENV: Mix.inProduction
                ? 'production'
                : ( process.env.NODE_ENV || 'development' )
        })
    ),

    new webpackPlugins.WebpackOnBuildPlugin(
        stats => global.events.fire('build', stats)
    )
);

if (! Mix.entry().hasScripts()) {
    plugins.push(new webpackPlugins.MockEntryPlugin(Mix.output().path));
}

module.exports.plugins = plugins;



/*
 |--------------------------------------------------------------------------
 | Mix Finalizing
 |--------------------------------------------------------------------------
 |
 | Now that we've declared the entirety of our Webpack configuration, the
 | final step is to scan for any custom configuration in the Mix file.
 | If mix.webpackConfig() is called, we'll merge it in, and build!
 |
 */

if (Mix.webpackConfig) {
    module.exports = require('webpack-merge').smart(
        module.exports, Mix.webpackConfig
    );
}
