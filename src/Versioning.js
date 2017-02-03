let path = require('path');
let Manifest = require('./Manifest');
let objectValues = require('lodash').values;

class Versioning {
    /**
     * Create a new Versioning instance.
     *
     * @param {object} manifest
     */
    constructor(manifest) {
        this.manifest = manifest;

        this.files = [];
    }


    /**
     * Record versioned files.
     */
    record() {
        if (! this.manifest.exists()) return this;

        this.reset();

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
     * Replace all old hashed files with the new versions.
     *
     * @param {string} baseDir
     */
    prune(baseDir) {
        let updated = new Versioning(this.manifest).record();

        if (! updated) return;

        this.files.filter(file => ! updated.files.includes(file))
                  .forEach(file => this.manifest.remove(path.join(baseDir, file)));

        this.files = updated.files;

        return this;
    }
}

module.exports = Versioning;
