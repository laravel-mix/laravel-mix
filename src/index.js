let path = require('path');
let Mix = require('./Mix');
let Verify = require('./Verify');

/**
 * Register the Webpack entry/output paths.
 *
 * @param {string|Array}  entry
 * @param {string} output
 */
module.exports.js = (entry, output) => {
    Verify.js(entry, output);

    entry = [].concat(entry).map(file => {
        return new Mix.File(path.resolve(file)).parsePath();
    });

    output = new Mix.File(output).parsePath();

    if (output.isDir) {
        output = new Mix.File(
            path.join(output.path, entry[0].file)
        ).parsePath();
    }

    Mix.js = (Mix.js || []).concat({ entry, output });

    Mix.js.base = output.base.replace(Mix.publicPath, '');

    return this;
};


/**
 * Declare support for the React framework.
 */
module.exports.react = (entry, output) => {
    Mix.react = true;

    Verify.dependency(
        'babel-preset-react',
        'npm install babel-preset-react --save-dev'
    );

    module.exports.js(entry, output);

    return this;
};


/**
 * Register vendor libs that should be extracted.
 * This helps drastically with long-term caching.
 *
 * @param {Array}  libs
 * @param {string} output
 */
module.exports.extract = (libs, output) => {
    Mix.extract = (Mix.extract || []).concat({
        libs,
        output: () => {
            if (output) {
                return output.replace(/\.js$/, '')
                             .replace(Mix.publicPath, '');
            }

            return path.join(Mix.js.base, 'vendor').replace(/\\/g, '/');
        }
    });

    return this;
};


/**
 * Register libraries to automatically "autoload" when
 * the appropriate variable is references in js
 *
 * @param {object} libs
 */
module.exports.autoload = (libs) => {
    let aliases = {};

    Object.keys(libs).forEach(library => {
        [].concat(libs[library]).forEach(alias => {
            aliases[alias] = library;
        });
    });

    Mix.autoload = aliases;

    return this;
};


/**
 * Enable Browsersync support for the project.
 *
 * @param {object} config
 */
module.exports.browserSync = (config = {}) => {
    if (typeof config === 'string') {
        config = { proxy: config };
    }

    Mix.browserSync = config;

    return this;
};


/**
 * Register Sass compilation.
 *
 * @param {string} src
 * @param {string} output
 * @param {object} pluginOptions
 */
module.exports.sass = (src, output, pluginOptions = {}) => {
    return module.exports.preprocess(
        'Sass', src, output, pluginOptions
    );
};


/**
 * Register Less compilation.
 *
 * @param {string} src
 * @param {string} output
 * @param {object} pluginOptions
 */
module.exports.less = (src, output, pluginOptions = {}) => {
    return module.exports.preprocess(
        'Less', src, output, pluginOptions
    );
};


/**
 * Register Stylus compilation.
 *
 * @param {string} src
 * @param {string} output
 * @param {object} pluginOptions
 */
module.exports.stylus = (src, output, pluginOptions = {}) => {
    Verify.dependency(
        'stylus-loader',
        'npm install stylus-loader stylus --save-dev'
    );

    return module.exports.preprocess(
        'Stylus', src, output, pluginOptions
    );
};


/**
 * Register a generic CSS preprocessor.
 *
 * @param {string} type
 * @param {string} src
 * @param {string} output
 * @param {object} pluginOptions
 */
module.exports.preprocess = (type, src, output, pluginOptions) => {
    Verify.preprocessor(type, src, output);

    let Preprocessor = require('./Preprocessors/' + type);

    Mix.preprocessors = (Mix.preprocessors || []).concat(
        new Preprocessor(src, output, pluginOptions)
    );

    return this;
};


/**
 * Combine a collection of files.
 *
 * @param {string|Array} src
 * @param {string}       output
 */
module.exports.combine = (src, output) => {
    Mix.concat.add({ src, output });

    return this;
};


/**
 * Alias for mix.combine().
 *
 * @param {string|Array} src
 * @param {string}       output
 */
module.exports.scripts = (src, output) => {
    return module.exports.combine(src, output);
};


/**
 * Alias for mix.combine().
 *
 * @param {string|Array} src
 * @param {string}       output
 */
module.exports.styles = (src, output) => {
    return module.exports.combine(src, output);
};


/**
 * Identical to mix.combine(), but includes Babel compilation.
 *
 * @param {string|Array} src
 * @param {string}       output
 */
module.exports.babel = (src, output) => {
    Mix.concat.add({ src, output, babel: true });

    return this;
};


/**
 * Copy one or more files to a new location.
 *
 * @param {string}  from
 * @param {string}  to
 * @param {boolean} flatten
 */
module.exports.copy = (from, to, flatten = true) => {
    Mix.copy = Mix.copy || [];

    [].concat(from).forEach(src => {
        Mix.copy.push({
            from: src,
            to: Mix.Paths.root(to),
            flatten: flatten
        });
    });

    return this;
};


/**
 * Minify the provided file.
 *
 * @param {string|Array} src
 */
module.exports.minify = (src) => {
    output = src.replace(/\.([a-z]{2,})$/i, '.min.$1');

    Mix.concat.add({ src, output });

    return this;
};


/**
 * Enable sourcemap support.
 */
module.exports.sourceMaps = () => {
    Mix.sourcemaps = (Mix.inProduction ? false : '#inline-source-map');

    return this;
};


/**
 * Enable compiled file versioning.
 *
 * @param {string|Array} files
 */
module.exports.version = (files = []) => {
    Mix.versioning = true;
    Mix.version = [].concat(files);

    return this;
};


/**
 * Disable all OS notifications.
 */
module.exports.disableNotifications = () => {
    Mix.notifications = false;

    return this;
};


/**
 * Set the path to your public folder.
 *
 * @param {string} path
 */
module.exports.setPublicPath = (path) => {
    Mix.publicPath = path;

    return this;
};


/**
 * Set prefix for generated asset paths
 *
 * @param {string} path
 */
module.exports.setResourceRoot = (path) => {
    Mix.resourceRoot = path;

    return this;
};


/**
 * Merge custom config with the provided webpack.config file.
 *
 * @param {object} config
 */
module.exports.webpackConfig = (config) => {
    Mix.webpackConfig = config;

    return this;
}


/**
 * Set Mix-specific options.
 *
 * @param {object} options
 */
module.exports.options = (options) => {
    Mix.options.merge(options);

    return this;
};


/**
 * Register a Webpack build event handler.
 *
 * @param {Function} callback
 */
module.exports.then = (callback) => {
    Mix.events.listen('build', callback);

    return this;
}


module.exports.config = Mix;
module.exports.mix = module.exports;
module.exports.plugins = {
    WebpackNotifierPlugin: require('webpack-notifier'),
    WebpackOnBuildPlugin: require('on-build-webpack'),
    ExtractTextPlugin: require('extract-text-webpack-plugin'),
    CopyWebpackPlugin: require('copy-webpack-plugin'),
    FriendlyErrorsWebpackPlugin: require('friendly-errors-webpack-plugin'),
    StatsWriterPlugin: require('webpack-stats-plugin').StatsWriterPlugin,
    WebpackMd5HashPlugin: require('webpack-md5-hash'),
    BrowserSyncPlugin: require('browser-sync-webpack-plugin')
};
