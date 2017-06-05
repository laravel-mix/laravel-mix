let Task = require('./Task');
let FileCollection = require('../FileCollection');

class CopyFilesTask extends Task {
    /**
     * Run the task.
     */
    run() {
        let copy = this.data;

        this.files = new FileCollection(copy.from);

        this.files.copyTo(copy.to);

        this.assets = this.files.assets;
    }


    /**
     * Handle when a relevant source file is changed.
     *
     * @param {string} updatedFile
     */
    onChange(updatedFile) {
        let destination = this.data.to;

        console.log(`Copying ${updatedFile} to ${destination.path()}`);

        this.files.copyTo(destination, new File(updatedFile));
    }
}

module.exports = CopyFilesTask;
