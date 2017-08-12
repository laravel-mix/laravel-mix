let Task = require('./Task');
let FileCollection = require('../FileCollection');

class RejectFilesFromManifest extends Task {
    /**
     * Run the task.
     */
    run() {
        this.files = new FileCollection(this.data.files);

        this.cleanManifest();

        Mix.manifest.refresh();
    }

    /**
     * Removes the rejected files from manifest file.
     */
    cleanManifest() {
        var manifest = Mix.manifest.read();

        for (let filename in manifest) {
            for (let index in this.files) {
                if (filename.indexOf(this.files[index]) !== -1) {
                    delete manifest[filename];
                }
            }
        }

        Mix.manifest.manifest = manifest;
    }

    /**
     * Handle when a relevant source file is changed.
     *
     * @param {string} updatedFile
     */
    onChange(updatedFile) {
    }
}

module.exports = RejectFilesFromManifest;