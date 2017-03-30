let Concat = require('./Concat');
let Manifest = require('./Manifest');
let Versioning = require('./Versioning');

class Mix {
    /**
     * Create a new Laravel Mix instance.
     */
    constructor() {
        this.concat = new Concat();
        this.inProduction = options.production;
        this.publicPath = options.publicPath;
        this.options = global.options; // deprecated
        this.Paths = global.Paths;
    }


    /**
     * Initialize the user's webpack.mix.js configuration file.
     */
    initialize() {
        if (this.isUsingLaravel()) {
            this.publicPath = options.publicPath = 'public';
        }

        this.manifest = new Manifest();

        // This is where we load the user's webpack.mix.js config.
        File.exists(Paths.mix() + '.js') && require(Paths.mix());

        if (options.versioning) {
            this.versioning = new Versioning(this.version, this.manifest).watch();
        }

        if (this.standaloneSass) this.standaloneSass.run();

        this.detectHotReloading();

        global.events.fire('init', this);
    }


    /**
     * Prepare the Webpack entry object.
     */
    entry() {
        return global.entry;
    }


    /**
     * Determine the Webpack output path.
     */
    output() {
        let filename = options.versioning ? '[name].[chunkhash].js' : '[name].js';
        let chunkFilename = path.join(
            global.entry.base || '', (options.versioning ? '[name].[chunkhash].js' : '[name].js')
        );

        return {
            path: path.resolve(options.hmr ? '/' : options.publicPath),
            filename: filename,
            chunkFilename: chunkFilename.replace(/^\//, ''),
            publicPath: options.hmr ? 'http://localhost:8080/' : ''
        };
    }


    /**
     * Detect if the user desires hot reloading.
     *
     * @param {boolean} force
     */
    detectHotReloading(force = false) {
        let file = new File(options.publicPath + '/hot');

        file.delete();

        // If the user wants hot module replacement, we'll create
        // a temporary file, so that Laravel can detect it, and
        // reference the proper base URL for any assets.
        if (options.hmr || force) {
            options.hmr = true;

            file.write('hot reloading');
        }
    }


    /**
     * Fetch the appropriate Babel config for babel-loader.
     */
    babelConfig() {
        if (File.exists(Paths.root('.babelrc'))) return '?cacheDirectory';

        // If the user doesn't have a .babelrc, we'll use our config.
        if (this.react) {
            options.babel.presets.push('react');
        }

        return '?' + JSON.stringify(options.babel);
    }


    /**
     * Determine if we are working with a Laravel project.
     */
    isUsingLaravel() {
        return File.exists('./artisan');
    }


    /**
     * Fetch the Vue-specific ExtractTextPlugin.
     */
    vueExtractTextPlugin() {
        let VueExtractTextPluginFactory = require('./Vue/ExtractTextPluginFactory');

        return new VueExtractTextPluginFactory(this, options.extractVueStyles).build();
    }
};

module.exports = Mix;
