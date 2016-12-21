let path = require('path');
let Manifest = require('./Manifest');

class Versioning {
    /**
     * Create a new Versioning instance.
     *
     * @param {object} manifest
     */
    constructor(manifest) {
        this.enabled = false;
        this.manifest = manifest;

        this.files = [];
    }


    /**
     * Enable Webpack versioning.
     */
    enable() {
        this.enabled = true;

        return this;
    }


    /**
     * Record versioned files.
     */
    record() {
        if (! this.manifest.exists()) return;

        this.reset();

        let json = this.manifest.read();

        Object.keys(json).forEach(entry => {
            this.files = this.files.concat(json[entry]);
        });

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
        let updated = new Versioning(this.manifest).enable().record();

        if (! updated) return;

        this.files.forEach(file => {
            // If the updated file is exactly the same as the old
            // one, then nothing has changed. Don't delete it.
            if (! updated.files.includes(file)) {
                this.manifest.remove(path.join(baseDir, file));
            }
        });

        // Lastly, we'll replace the versioned file list with the new one.
        this.files = updated.files;

        return this;
    }
}

module.exports = Versioning;
