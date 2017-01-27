let path = require('path');
let assert = require('assert');
let Mix = require('./Mix');

/**
 * Register the Webpack entry/output paths.
 *
 * @param {mixed}  entry
 * @param {string} output
 */
module.exports.js = (entry, output) => {
    assert(entry && (typeof entry === 'string' || Array.isArray(entry)), 'mix.js() is missing required parameter 1: entry');
    assert(output && typeof output === 'string', 'mix.js() is missing required parameter 2: output');

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
 * Register vendor libs that should be extracted.
 * This helps drastically with long-term caching.
 *
 * @param {array} libs
 */
module.exports.extract = (libs) => {
    Mix.js.vendor = libs;

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
 * Register Sass compilation.
 *
 * @param {string} src
 * @param {string} output
 */
module.exports.sass = (src, output) => {
    return module.exports.preprocess('sass', src, output);
};


/**
 * Register Less compilation.
 *
 * @param {string} src
 * @param {string} output
 */
module.exports.less = (src, output) => {
    return module.exports.preprocess('less', src, output);
};


/**
 * Register a generic CSS preprocessor.
 *
 * @param {string} type
 * @param {string} src
 * @param {string} output
 */
module.exports.preprocess = (type, src, output) => {
    assert(src && typeof src === 'string', `mix.${type}() is missing required parameter 1: src`);
    assert(output && typeof output === 'string', `mix.${type}() is missing required parameter 2: output`);

    src = new Mix.File(path.resolve(src)).parsePath();
    output = new Mix.File(output).parsePath();

    if (output.isDir) {
        output = new Mix.File(
            path.join(output.path, src.name + '.css')
        ).parsePath();
    }

    Mix[type] = (Mix[type] || []).concat({ src, output });

    Mix.cssPreprocessor = type;

    return this;
};


/**
 * Combine a collection of files.
 *
 * @param {string|array} src
 * @param {string}       output
 */
module.exports.combine = (src, output) => {
    Mix.combine = (Mix.combine || []).concat({ src, output });

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
    Mix.copy = (Mix.copy || []).concat({
        from,
        to: Mix.Paths.root(to),
        flatten: flatten
    });

    return this;
};


/**
 * Minify the provided file.
 *
 * @param {string|array} src
 */
module.exports.minify = (src) => {
    Mix.minify = (Mix.minify || []).concat(src);

    return this;
};


/**
 * Enable sourcemap support.
 */
module.exports.sourceMaps = () => {
    Mix.sourcemaps = (Mix.inProduction ? '#source-map' : '#inline-source-map');

    return this;
};


/**
 * Enable compiled file versioning.
 */
module.exports.version = () => {
    Mix.versioning = true;

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
 * Merge custom config with the provided webpack.config file.
 *
 * @param {object} config
 */
module.exports.webpackConfig = (config) => {
    Mix.webpackConfig = config;

    return this;
}


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
    WebpackMd5HashPlugin: require('webpack-md5-hash')
};
