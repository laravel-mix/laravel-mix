let File = require('./File');
let Mix = require('./index');
let objectValues = require('lodash').values;

class Manifest {
    /**
     * Create a new Manifest instance.
     *
     * @param {string} path
     */
    constructor(path) {
        this.path = path;
        this.manifest = {};
    }


    /**
     * Register any applicable event listeners.
     *
     * @param {object} events
     */
    listen(events) {
        events.listen('combined', this.appendCombinedFiles.bind(this));

        return this;
    }


    /**
     * Transform the Webpack stats into the shape we need.
     *
     * @param {object} stats
     * @param {object} options
     */
    transform(stats, options) {
        let flattenedPaths = [].concat.apply(
            [], objectValues(stats.assetsByChunkName)
        );

        this.manifest = flattenedPaths.reduce((manifest, path) => {
            path = path.replace(/\\/g, '/');

            let original = path.replace(/\.(\w{20})(\..+)/, '$2');

            manifest[original] = path;

            return manifest;
        }, {});

        return JSON.stringify(this.manifest, null, 2);
    }


    /**
     * Append any mix.combine()'d output paths to the manifest.
     *
     * @param {array} combine
     */
    appendCombinedFiles(toCombine) {
        let output = toCombine.output
            .replace(/\\/g, '/')
            .replace(Mix.config.publicPath, '');

        this.manifest[
            output.replace(/\.(\w{32})(\..+)/, '$2')
        ] = output;

        this.refresh();
    }


    /**
     * Refresh the mix-manifest.js file.
     */
    refresh() {
        File.find(this.path).write(this.manifest);
    }


    /**
     * Determine if the manifest file exists.
     */
    exists() {
        return File.exists(this.path);
    }


    /**
     * Retrieve the JSON output from the manifest file.
     */
    read() {
        return JSON.parse(File.find(this.path).read());
    }

    /**
     * Delete the given file from the manifest.
     *
     * @param {string} file
     */
    remove(file) {
        new File(file).delete();
    }
}

module.exports = Manifest;
