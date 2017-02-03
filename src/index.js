let path = require('path');
let Mix = require('./Mix');
let Verify = require('./Verify');

/**
 * Register the Webpack entry/output paths.
 *
 * @param {string|array}  entry
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
 * Register vendor libs that should be extracted.
 * This helps drastically with long-term caching.
 *
 * @param {array}  libs
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

            return path.join(Mix.js.base, 'vendor');
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
 * Register Sass compilation.
 *
 * @param {string} src
 * @param {string} output
 * @param {object} pluginOptions
 */
module.exports.sass = (src, output, pluginOptions = {}) => {
    return module.exports.preprocess(
        'sass', src, output, pluginOptions
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
        'less', src, output, pluginOptions
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

    src = new Mix.File(path.resolve(src)).parsePath();
    output = new Mix.File(output).parsePath();

    if (output.isDir) {
        output = new Mix.File(
            path.join(output.path, src.name + '.css')
        ).parsePath();
    }

    Mix.preprocessors = (Mix.preprocessors || []).concat({
        type, src, output, pluginOptions
    });

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
    Verify.combine(src);

    Mix.concat.add({ src, output });

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
