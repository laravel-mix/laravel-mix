let objectValues = require('lodash').values;

class Manifest {
    /**
     * Create a new Manifest instance.
     */
    constructor() {
        this.manifest = {};
        this.cache = this.exists() ? this.read() : {};

        this.registerEvents();
    }


    /**
     * Register any applicable event listeners.
     */
    registerEvents() {
        global.events.listen('combined', this.appendCombinedFiles.bind(this))
            .listen('standalone-sass-compiled', compiledFile => {
                this.add(compiledFile);
                this.refresh();
            });

        return this;
    }


    /**
     * Add a key-value pair to the manifest file.
     *
     * @param {File} file
     */
    add(file) {
        let original = this.preparePath(file.file);

        this.manifest[original] = global.options.versioning ? this.preparePath(file.versionedPath()) : original;

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

        File.find(this.path()).write(manifest);
    }


    /**
     * Get the path to the manifest file.
     */
    path() {
        return path.join(global.options.publicPath, 'mix-manifest.json');
    }


    /**
     * Determine if the manifest file exists.
     */
    exists() {
        return File.exists(this.path());
    }


    /**
     * Retrieve the JSON output from the manifest file.
     */
    read() {
        return JSON.parse(File.find(this.path()).read());
    }


    /**
     * Prepare the provided path for processing.
     *
     * @param {string} path
     */
    preparePath(path) {
        return path.replace(new RegExp('^' +  global.options.publicPath), '')
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
