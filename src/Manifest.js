let File = require('./File');
let objectValues = require('lodash').values;

class Manifest {
    /**
     * Create a new Manifest instance.
     *
     * @param {string} path
     */
    constructor(path) {
        this.path = path;
    }


    /**
     * Transform the Webpack stats into the shape we need.
     *
     * @param {object} stats
     */
    transform(stats) {
        let flattenedPaths = [].concat.apply([], objectValues(stats.assetsByChunkName));

        let manifest = flattenedPaths.reduce((manifest, path) => {
            path = path.replace(/\\/g, '/');

            let original = path.replace(/\.(\w{20})(\..+)/, '$2');

            manifest[original] = path;

            return manifest;
        }, {});

        return JSON.stringify(manifest, null, 2);
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
        return JSON.parse(
            new File(this.path).read()
        );
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
