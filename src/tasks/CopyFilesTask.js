let Task = require('./Task');
let FileCollection = require('../FileCollection');
let Log = require('../Log');
const path = require('path');
const File = require('../File');

/**
 * @extends {Task<{ from: string|string[], to: File }>}
 */
class CopyFilesTask extends Task {
    /**
     * Run the task.
     */
    async run() {
        let copy = this.data;

        this.files = new FileCollection(copy.from);

        await this.files.copyTo(copy.to);

        this.assets = this.files.assets;
    }

    /**
     * Handle when a relevant source file is changed.
     *
     * @param {string} updatedFile
     */
    async onChange(updatedFile) {
        let destination = this.data.to;

        // If we're copying a src directory recursively, we have to calculate
        // the correct destination path, based on the src directory tree.
        if (!Array.isArray(this.data.from) && new File(this.data.from).isDirectory()) {
            destination = destination.append(
                path.normalize(updatedFile).replace(path.normalize(this.data.from), '')
            );
        }

        Log.feedback(`Copying ${updatedFile} to ${destination.path()}`);

        await this.files.copyTo(destination, new File(updatedFile));
    }
}

module.exports = CopyFilesTask;
