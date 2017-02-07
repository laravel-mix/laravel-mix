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
     */
    constructor(manualFiles = [], manifest) {
        this.files = [];
        this.manualFiles = manualFiles;
        this.manifest = manifest;
    }


    /**
     * Register a watcher for any files that aren't
     * included in Webpack's core bundle process.
     */
    watch() {
        if (! process.argv.includes('--watch')) return;

        this.manualFiles.forEach(file => {
            new File(file).watch(() => {
                File.find(this.manifest.get(file)).rename(
                    this.generateHashedFilePath(file)
                );

                this.prune(this.baseDir);
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

        this.files = objectValues(this.manifest.read());

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
            file => this.manifest.add(file, this.generateHashedFilePath(file))
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
     *
     * @param {string} baseDir
     */
    prune(baseDir) {
        this.baseDir = baseDir;
        let currentFiles = this.files;

        this.reset().record();

        currentFiles
            .filter(file => ! this.files.includes(file))
            .forEach(file => {
                if (! file.startsWith(baseDir)) {
                    file = path.join(baseDir, file);
                }

                this.manifest.remove(file);
            });

        this.manifest.refresh();

        return this;
    }
}

module.exports = Versioning;
