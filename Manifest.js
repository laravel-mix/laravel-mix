let File = require('./File');

module.exports = class {
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
        ).assetsByChunkName;
    }   


    /**
     * Write the updated stats to the manifest.
     * 
     * @param {object} stats 
     */
    write(stats) {
        new File(this.path).write(
            JSON.stringify(stats.toJson())
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
