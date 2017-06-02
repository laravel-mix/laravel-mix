let objectValues = require('lodash').values;
let without = require('lodash').without;

let path = require('path');

class Manifest {
    /**
     * Create a new Manifest instance.
     *
     * @param {string} name
     */
    constructor(name = 'mix-manifest.json') {
        this.manifest = {};
        this.name = name;
    }


    /**
     * Get the underlying manifest collection.
     */
    get(file = null) {
        if (file) {
            return path.join(
                Config.publicPath,
                this.manifest[this.normalizePath(file)]
            );
        }

        return this.manifest;
    }


    /**
     * Add the given path to the manifest file.
     *
     * @param {string} filePath
     */
    add(filePath) {
        filePath = this.normalizePath(filePath);

        let original = filePath.replace(/\.(\w{20}|\w{32})(\..+)/, '$2');

        this.manifest[original] = filePath;

        return this;
    }


    /**
     * Transform the Webpack stats into the shape we need.
     *
     * @param {object} stats
     * @param {object} options
     */
    transform(stats, options) {
        let customAssets = Config.customAssets.map(asset => asset.pathFromPublic());

        this.flattenAssets(stats).concat(customAssets).forEach(this.add.bind(this));

        return JSON.stringify(this.manifest, null, 2);
    }


    /**
     * Refresh the mix-manifest.js file.
     */
    refresh() {
        File.find(this.path()).write(this.manifest);
    }


    /**
     * Retrieve the JSON output from the manifest file.
     */
    read() {
        return JSON.parse(File.find(this.path()).read());
    }


    /**
     * Get the path to the manifest file.
     */
    path() {
        return path.join(Config.publicPath, this.name);
    }


    /**
     * Flatten the generated stats assets into an array.
     *
     * @param {Object} stats
     */
    flattenAssets(stats) {
        let assets = Object.assign({}, stats.assetsByChunkName);

        // If there's a temporary mix.js chunk, we can safely remove it.
        if (assets.mix) {
            assets.mix = without(assets.mix, 'mix.js');
        }

        return [].concat.apply(
            [], objectValues(assets)
        );
    }


    /**
     * Prepare the provided path for processing.
     *
     * @param {string} filePath
     */
    normalizePath(filePath) {
        filePath = filePath.replace(
            new RegExp('^' +  Config.publicPath), ''
        ).replace(/\\/g, '/');

        if (! filePath.startsWith('/')) {
            filePath = '/' + filePath;
        }

        return filePath;
    }
}

module.exports = Manifest;
