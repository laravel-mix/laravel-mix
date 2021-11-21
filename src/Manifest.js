let collect = require('collect.js');
let path = require('path');
let File = require('./File');

let hasWarnedAboutManifestChange = false;

class Manifest {
    /**
     * Create a new Manifest instance.
     *
     * @param {string} name
     * @param {import('./Mix.js')} [mix]
     */
    constructor(name = 'mix-manifest.json', mix = undefined) {
        this.mix = mix || global.Mix;

        /** @type {Record<string, string>} */
        this.manifest = {};
        this.name = name;
    }

    /**
     * Get the underlying manifest collection.
     * @param {string|null} [file]
     * @returns {string | Record<string, string>}
     */
    get(file = null) {
        if (file) {
            return path.posix.join(
                this.mix.config.publicPath,
                this.manifest[this.normalizePath(file)]
            );
        }

        return Object.fromEntries(
            Object.entries(this.manifest).sort((a, b) => a[0].localeCompare(b[0]))
        );
    }

    /**
     * Add the given path to the manifest file.
     *
     * @param {string} filePath
     */
    add(filePath) {
        filePath = this.normalizePath(filePath);

        let original = filePath.replace(/\?id=\w+/, '');

        this.manifest[original] = filePath;

        return this;
    }

    /**
     * Add a new hashed key to the manifest.
     *
     * @param {string} file
     */
    hash(file) {
        let hash = new File(path.join(this.mix.config.publicPath, file)).version();

        let filePath = this.normalizePath(file);

        this.manifest[filePath] = filePath + '?id=' + hash;

        return this;
    }

    /**
     * Transform the Webpack stats into the shape we need.
     *
     * @param {object} stats
     */
    transform(stats) {
        this.flattenAssets(stats).forEach(this.add.bind(this));

        return this;
    }

    /**
     * Refresh the mix-manifest.js file.
     */
    refresh() {
        if (this.path() === null) {
            return;
        }

        File.find(this.path()).makeDirectories().write(this.manifest);
    }

    /**
     * Retrieve the JSON output from the manifest file.
     */
    read() {
        if (this.path() === null) {
            return {};
        }

        return JSON.parse(File.find(this.path()).read());
    }

    /**
     * Get the path to the manifest file.
     */
    path() {
        // Backwards compat for plugis that manually swapped out the manifest plugin with a different name
        if (this.name !== 'mix-manifest.json') {
            if (!hasWarnedAboutManifestChange) {
                hasWarnedAboutManifestChange = true;
                console.warn(
                    `You can now customize the name of the manifest using mix.options(${JSON.stringify(
                        { manifest: this.name }
                    )}) instead of changing the manifest name directly.`
                );
            }

            return path.join(this.mix.config.publicPath, this.name);
        }

        if (!this.mix.config.manifest) {
            return null;
        }

        return path.join(this.mix.config.publicPath, this.mix.config.manifest);
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
            assets.mix = collect(assets.mix).except('mix.js').all();
        }

        return (
            collect(assets)
                .flatten()
                // Don't add hot updates to manifest
                .filter(name => name.indexOf('hot-update') === -1)
                .all()
        );
    }

    /**
     * Prepare the provided path for processing.
     *
     * @param {string} filePath
     */
    normalizePath(filePath) {
        if (
            this.mix.config.publicPath &&
            filePath.startsWith(this.mix.config.publicPath)
        ) {
            filePath = filePath.substring(this.mix.config.publicPath.length);
        }
        filePath = filePath.replace(/\\/g, '/');

        if (!filePath.startsWith('/')) {
            filePath = '/' + filePath;
        }

        return filePath;
    }
}

module.exports = Manifest;
