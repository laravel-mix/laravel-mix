let path = require('path');
let paths = require('./Paths');
let File = require('./File');
let lodash = require('lodash');
let Manifest = require('./Manifest');
let Versioning = require('./Versioning');
let concatenate = require('concatenate');

class Mix {
    /**
     * Create a new Laravel Mix instance.
     */
    constructor() {
        this.File = File;
        this.paths = paths;
        this.hmr = false;
        this.sourcemaps = false;
        this.notifications = true;
        this.cssPreprocessor = false;
        this.versioning = false;
        this.inProduction = process.env.NODE_ENV === 'production';
        this.publicPath = this.isUsingLaravel() ? 'public' : './';
    }


    /**
     * Initialize the user's webpack.mix.js configuration file.
     */
    initialize() {
        // We'll first load the user's webpack.mix.js file.
        require(this.paths.mix());

        if (this.versioning) {
            this.versioning = new Versioning(
                new Manifest(this.publicPath + '/manifest.json')
            )
        }

        this.detectHotReloading();
    }


    /**
     * Finalize the Webpack configuration.
     *
     * @param {object} webpackConfig
     */
    finalize(webpackConfig) {
        if (! this.webpackConfig) return;

        lodash.mergeWith(webpackConfig, this.webpackConfig,
            (objValue, srcValue) => {
                if (Array.isArray(objValue)) {
                    return objValue.concat(srcValue);
                }
            }
        );
    }


    /**
     * Determine the Webpack entry file(s).
     */
    entry() {
        // We'll build up an entry object that the webpack.config.js
        // file will want to see. It'll include all mix.js() calls.
        let entry = this.js.reduce((result, paths) => {
            result[paths.output.name] = paths.entry.map(src => src.path);

            return result;
        }, {});

        if (this.cssPreprocessor) {
            let stylesheets = this[this.cssPreprocessor].map(entry => entry.src.path);
            let name = Object.keys(entry)[0];

            entry[name] = entry[name].concat(stylesheets);
        }

        return entry;
    }


    /**
     * Determine the Webpack output path.
     */
    output() {
        // We'll only apply a chunkhash in production, as it's a costly step.
        let filename = (this.inProduction && this.versioning) ? '[name].[chunkhash].js' : '[name].js';

        return {
            path: this.hmr ? '/' : this.publicPath,
            filename: path.join(this.js[0].output.base, filename).replace(this.publicPath, ''),
            publicPath: this.hmr ? 'http://localhost:8080/' : './'
        };
    }


    /**
     * Determine the appropriate CSS output path.
     *
     * @param {object} segments
     */
    cssOutput(segments) {
        let regex = new RegExp('^(\.\/)?' + this.publicPath);
        let path = (this.inProduction && this.versioning) ? 'hashedPath' : 'path';

        return segments.output[path].replace(regex, '');
    }


    /**
     * Minify the given files, or those from Mix.minify().
     *
     * @param {array|null} files
     */
    minifyAll(files = null) {
        if (! this.inProduction) return;

        files = files || this.minify || [];

        files.forEach(file => new File(file).minify());

        return this;
    }


    /**
     * Combine the given files, or those from Mix.combine().
     *
     * @param {array|null} files
     */
    concatenateAll(files = null) {
        files = files || this.combine || [];

        files.forEach(file => {
            concatenate.sync(file.src, file.output);

            if (! this.inProduction) return;

            new this.File(file.output).minify();
        });

        return this;
    }


    /**
     * Detect if the user desires hot reloading.
     */
    detectHotReloading() {
        let file = new this.File(this.publicPath + '/hot');

        file.delete();

        // If the user wants hot module replacement, we'll create
        // a temporary file, so that Laravel can detect it, and
        // reference the proper base URL for any assets.
        if (process.argv.includes('--hot')) {
            this.hmr = true;

            file.write('hot reloading enabled');
        }
    }


    /**
     * Fetch the appropriate Babel config for babel-loader.
     */
    babelConfig() {
        let file = this.paths.root('.babelrc');

        // If the user has defined their own .babelrc file,
        // the babel-loader will automatically fetch it.
        // Otherwise, we'll use these defaults.
        return this.File.exists(file) ? '?cacheDirectory' : '?' + JSON.stringify({
            'cacheDirectory': true,
            'presets': [
                ['es2015', { 'modules': false }]
            ]
        });
    }


    /**
     * Determine if we are working with a Laravel project.
     */
    isUsingLaravel() {
        return this.File.exists('./artisan');
    }
};

module.exports = new Mix;
