let path = require('path');
let File = require('./File');
let objectValues = require('lodash').values;
let object = require('lodash/fp/object');

class Manifest {
    /**
     * Create a new Manifest instance.
     *
     * @param {string} publicPath
     */
    constructor(publicPath) {
        this.publicPath = publicPath;
        this.path = path.join(publicPath, 'mix-manifest.json');
        this.cache = this.exists() ? this.read() : {};
        this.manifest = this.cache;
    }


    /**
     * Add a key-value pair to the manifest file.
     *
     * @param {File} file
     */
    add(file) {
        let original = this.preparePath(file.file);
        let modified = this.preparePath(file.versionedPath());

        this.manifest[original] = modified;

        return this;
    }


    /**
     * Get the modified version of the given path.
     *
     * @param {string} original
     */
    get(original) {
        if (original) {
            if (original instanceof File) original = original.file;

            return this.manifest[this.preparePath(original)];
        }

        return this.manifest;
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

        flattenedPaths.forEach(path => {
            path = this.preparePath(path);

            if (! path.startsWith('/')) path = ('/'+path);

            let original = path.replace(/\.(\w{20})(\..+)/, '$2');

            if(Object.keys(this.cache).length) {
              let old = this.cache[original];

              if(old && File.exists(old.replace(/^\//, ''))) {
                File.find(old.replace(/^\//, '')).delete();
              }
            }

            this.manifest[original] = path;
        });

        return JSON.stringify(this.manifest, null, 2);
    }


    /**
     * Append any mix.combine()'d output paths to the manifest.
     *
     * @param {Array} toCombine
     */
    appendCombinedFiles(toCombine) {
        let output = this.preparePath(toCombine.output);

        this.manifest[
            output.replace(/\.(\w{32})(\..+)/, '$2')
        ] = output;

        this.refresh();
    }


    /**
     * Refresh the mix-manifest.js file.
     */
    refresh() {
        let manifest = {};

        for (let key in this.manifest) {
            let val = this.preparePath(this.manifest[key]);

            key = this.preparePath(key);

            manifest[key] = val;
        }

        manifest = object.merge(manifest, this.cache);

        File.find(this.path).write(manifest);
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
     * Prepare the provided path for processing.
     *
     * @param {string} path
     */
    preparePath(path) {
        return path.replace(new RegExp('^' + this.publicPath), '')
                   .replace(/\\/g, '/');
    }


    /**
     * Delete the given file from the manifest.
     *
     * @param {string} file
     */
    remove(file) {
        File.find(file).delete();
    }
}

module.exports = Manifest;
