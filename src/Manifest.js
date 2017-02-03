let File = require('./File');
let objectValues = require('lodash').values;
let Mix = require('./index');

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
        this.transformStats(stats)
            .appendCombinedFiles(Mix.config.concat.files);

        return JSON.stringify(this.manifest, null, 2);
    }

    /**
     * Format the stats for the mix-manifest.json file.
     *
     * @param {object} stats
     */
    transformStats(stats) {
        let flattenedPaths = [].concat.apply(
            [], objectValues(stats.assetsByChunkName)
        );

        this.manifest = flattenedPaths.reduce((manifest, path) => {
            path = path.replace(/\\/g, '/');

            let original = path.replace(/\.(\w{20})(\..+)/, '$2');

            manifest[original] = path;

            return manifest;
        }, {});

        return this;
    }

    /**
     * Append any mix.combine()'d output paths to the manifest.
     *
     * @param {array} combine
     */
    appendCombinedFiles(combine) {
        // Even though calls to mix.combine() are not part of the
        // core Webpack compilation, we'll add their output paths
        // to the mix-manifest.json file, for user convenience.
        if (combine) {
            combine.forEach(toCombine => {
                let output = toCombine.output
                    .replace(/\\/g, '/')
                    .replace(Mix.config.publicPath, '');

                this.manifest[output] = output;
            });
        }
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
