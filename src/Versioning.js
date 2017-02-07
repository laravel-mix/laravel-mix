let path = require('path');
let Manifest = require('./Manifest');
let objectValues = require('lodash').values;
let md5 = require('md5');
let File = require('./File');

class Versioning {
    /**
     * Create a new Versioning instance.
     *
     * @param {array}  manualFiles
     * @param {object} manifest
     * @param {string} publicPath
     */
    constructor(manualFiles = [], manifest, publicPath) {
        this.files = [];
        this.manualFiles = manualFiles;
        this.manifest = manifest;
        this.publicPath = publicPath;
    }


    /**
     * Register a watcher for any files that aren't
     * included in Webpack's core bundle process.
     */
    watch() {
        if (! process.argv.includes('--watch')) return;

        this.manualFiles.forEach(fileName => {
            let file = new File(fileName);

            file.watch(() => {
                File.find(
                    path.join(this.publicPath, this.manifest.get(fileName))
                )
                .rename(this.generateHashedFilePath(fileName))
                .write(file.read());

                this.prune();
            });
        });
    }


    /**
     * Create all hashed files requested by the user,
     * when they called mix.version(['file']);
     */
    writeHashedFiles() {
        this.manualFiles.forEach(file => {
            File.find(file)
                .copy(this.generateHashedFilePath(file));
        });

        return this;
    }


    /**
     * Record versioned files.
     */
    record() {
        if (! this.manifest.exists()) return this;

        this.addManualFilesToManifest();

        this.files = objectValues(this.manifest.get());

        return this;
    }


    /**
     * Reset all recorded files.
     */
    reset() {
        this.files = [];

        return this;
    }


    /**
     * The user may optionally add extra files to be
     * versioned. Here, we'll manually add those to
     * Mix's manifest file.
     */
    addManualFilesToManifest() {
        this.manualFiles.forEach(
            file => this.manifest.add(
                file.replace(this.publicPath, ''),
                this.generateHashedFilePath(file)
            )
        );
    }


    /**
     * Fetch the proper hashed file path.
     *
     * @param {string} file
     */
    generateHashedFilePath(file) {
        return new File(file).versionedPath(
            md5(File.find(file).read())
        );
    }


    /**
     * Replace all old hashed files with the new versions.
     */
    prune() {
        let currentFiles = this.files;

        this.reset().record();

        currentFiles
            .filter(file => ! this.files.includes(file))
            .forEach(file => {
                if (! file.startsWith(this.publicPath)) {
                    file = path.join(this.publicPath, file);
                }

                this.manifest.remove(file);
            });

        this.manifest.refresh();

        return this;
    }
}

module.exports = Versioning;
