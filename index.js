let path = require('path');
let Mix = require('./Mix');

/**
 * We'll fetch some Webpack config plugins here for cleanliness.
 */
module.exports.plugins = {
    WebpackNotifierPlugin: require('webpack-notifier'),
    WebpackOnBuildPlugin: require('on-build-webpack'),
    ExtractTextPlugin: require('extract-text-webpack-plugin'),
    CopyWebpackPlugin: require('copy-webpack-plugin')
}


/**
 * Register the Webpack entry/output paths.
 * 
 * @param {mixed}  entry  
 * @param {string} output
 */
module.exports.js = (entry, output) => {
    Mix.js = {
        entry: path.resolve(entry),
        output: new Mix.File(output).parsePath(),
        vendor: false
    };

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
}


/**
 * Register Sass compilation.
 * 
 * @param {string} src  
 * @param {string} output 
 */
module.exports.sass = (src, output) => {
    Mix.sass = {
        src: path.resolve(src),
        output: new Mix.File(output).parsePath()
    };

    Mix.cssPreprocessor = 'sass';

    return this;
};


/**
 * Register Less compilation.
 * 
 * @param {string} src  
 * @param {string} output 
 */
module.exports.less = (src, output) => {
    Mix.less = {
        src: path.resolve(src),
        output: new Mix.File(output).parsePath()
    };

    Mix.cssPreprocessor = 'less';

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
 * @param {string} from
 * @param {string} to
 */
module.exports.copy = (from, to) => {
    Mix.copy = (Mix.copy || []).concat({ 
        from, 
        to: path.resolve(__dirname, '../../', to)
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
    Mix.versioning.enabled = true;

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
 * Set the temporary cache directory.
 *
 * @param {string} path
 */
module.exports.setCacheDirectory = (path) => {
    Mix.cachePath = path;

    return this;
};


module.exports.config = Mix;
module.exports.mix = module.exports;
