let File = require('./File');

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
