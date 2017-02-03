let path = require('path');
let File = require('./File');
let Paths = require('./Paths');
let Manifest = require('./Manifest');
let Versioning = require('./Versioning');
let Concat = require('./Concat');
let mergeWith = require('lodash').mergeWith;
let EntryBuilder = require('./EntryBuilder');
let Dispatcher = require('./Dispatcher');

class Mix {
    /**
     * Create a new Laravel Mix instance.
     */
    constructor() {
        this.File = File;
        this.Paths = new Paths;
        this.hmr = false;
        this.sourcemaps = false;
        this.notifications = true;
        this.versioning = false;
        this.js = [];
        this.entryBuilder = new EntryBuilder(this);
        this.events = new Dispatcher;
        this.concat = new Concat(this.events);
        this.inProduction = process.env.NODE_ENV === 'production';
        this.publicPath = './';
    }


    /**
     * Initialize the user's webpack.mix.js configuration file.
     *
     * @param {string} rootPath
     */
    initialize(rootPath = '') {
        if (rootPath) this.Paths.setRootPath(rootPath);

        if (this.isUsingLaravel()) this.publicPath = 'public';

        // Here, we'll load the user's webpack.mix.js file and apply it.
        require(this.Paths.mix());

        this.manifest = new Manifest(
            path.join(this.publicPath, 'mix-manifest.json')
        );

        if (this.versioning) {
            this.versioning = new Versioning(this.manifest).record();

            this.events.listen(
                'build', () => this.versioning.prune(this.publicPath)
            );
        }

        if (this.concat.files.length) {
            this.concat.watch();
        }

        this.detectHotReloading();
    }


    /**
     * Finalize the Webpack configuration.
     *
     * @param {object} webpackConfig
     */
    finalize(webpackConfig) {
        if (! this.webpackConfig) return webpackConfig;

        mergeWith(webpackConfig, this.webpackConfig,
            (objValue, srcValue) => {
                if (Array.isArray(objValue)) {
                    return objValue.concat(srcValue);
                }
            }
        );

        return webpackConfig;
    }


    /**
     * Prepare the Webpack entry object.
     */
    entry() {
        return this.entryBuilder.build();
    }


    /**
     * Determine the Webpack output path.
     */
    output() {
        let filename = this.versioning ? '[name].[chunkhash].js' : '[name].js';

        return {
            path: this.hmr ? '/' : this.publicPath,
            filename: filename,
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
        let pathVariant = this.versioning ? 'hashedPath' : 'path';

        return segments.output[pathVariant].replace(regex, '').replace(/\\/g, '/');
    }


    /**
     * Detect if the user desires hot reloading.
     *
     * @param {bool} force
     */
    detectHotReloading(force = false) {
        let file = new this.File(this.publicPath + '/hot');

        file.delete();

        // If the user wants hot module replacement, we'll create
        // a temporary file, so that Laravel can detect it, and
        // reference the proper base URL for any assets.
        if (process.argv.includes('--hot') || force) {
            this.hmr = true;

            file.write('hot reloading enabled');
        } else {
            this.hmr = false;
        }
    }


    /**
     * Fetch the appropriate Babel config for babel-loader.
     */
    babelConfig() {
        let file = this.Paths.root('.babelrc');

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


    /**
     * Reset all configuration to their defaults.
     */
    reset() {
        [
            'preprocessors', 'sass',
            'less', 'sourceMaps'
        ].forEach(prop => this[prop] = null);

        this.publicPath = './';
        this.js = [];
        this.entryBuilder.reset();
        this.events = new Dispatcher;

        return this;
    }
};


module.exports = new Mix;
