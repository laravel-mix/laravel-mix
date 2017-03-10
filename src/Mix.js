let path = require('path');
let File = require('./File');
let Paths = require('./Paths');
let Concat = require('./Concat');
let options = require('./Options');
let Manifest = require('./Manifest');
let Versioning = require('./Versioning');
let Dispatcher = require('./Dispatcher');
let EntryBuilder = require('./EntryBuilder');

class Mix {
    /**
     * Create a new Laravel Mix instance.
     */
    constructor() {
        this.File = File;
        this.Paths = new Paths;
        this.js = [];
        this.entryBuilder = new EntryBuilder(this);
        this.events = new Dispatcher;
        this.concat = new Concat(this.events);
        this.options = options;
        this.inProduction = this.options.production;
        this.publicPath = this.options.publicPath;
    }


    /**
     * Initialize the user's webpack.mix.js configuration file.
     */
    initialize() {
        if (this.isUsingLaravel()) this.options.publicPath = 'public';

        // This is where we load the user's webpack.mix.js config.
        this.File.exists(this.Paths.mix() + '.js') && require(this.Paths.mix());

        this.manifest = new Manifest(this.options.publicPath).listen(this.events);

        if (this.concat.any()) this.concat.watch();
        if (this.options.versioning) this.enableVersioning();

        this.detectHotReloading();
    }


    /**
     * Enable file versioning for the build.
     */
    enableVersioning() {
        this.versioning = new Versioning(
            this.version, this.manifest, this.options.publicPath
        ).watch();

        this.events.listen(
            ['build', 'combined'], () => this.versioning.prune()
        );

        this.concat.enableVersioning();
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
        let filename = this.options.versioning ? '[name].[chunkhash].js' : '[name].js';
        let chunkFilename = path.join(
            this.js.base || '', (this.options.versioning ? '[name].[chunkhash].js' : '[name].js')
        );

        return {
            path: path.resolve(this.options.hmr ? '/' : this.options.publicPath),
            filename: filename,
            chunkFilename: chunkFilename,
            publicPath: this.options.hmr ? 'http://localhost:8080' : ''
        };
    }


    /**
     * Detect if the user desires hot reloading.
     *
     * @param {boolean} force
     */
    detectHotReloading(force = false) {
        let file = new this.File(this.options.publicPath + '/hot');

        file.delete();

        // If the user wants hot module replacement, we'll create
        // a temporary file, so that Laravel can detect it, and
        // reference the proper base URL for any assets.
        if (this.options.hmr || force) {
            this.options.hmr = true;

            file.write('hot reloading');
        }
    }


    /**
     * Fetch the appropriate Babel config for babel-loader.
     */
    babelConfig() {
        if (this.File.exists(this.Paths.root('.babelrc'))) return '?cacheDirectory';

        // If the user doesn't have a .babelrc, we'll use our config.
        if (this.react) {
            this.options.babel.presets.push('react');
        }

        return '?' + JSON.stringify(this.options.babel);
    }


    /**
     * Determine if we are working with a Laravel project.
     */
    isUsingLaravel() {
        return this.File.exists('./artisan');
    }


    /**
     * Fetch the Vue-specific ExtractTextPlugin.
     */
    vueExtractTextPlugin() {
        let VueExtractTextPluginFactory = require('./Vue/ExtractTextPluginFactory');

        return new VueExtractTextPluginFactory(this.options.extractVueStyles).build();
    }
};

module.exports = Mix;
