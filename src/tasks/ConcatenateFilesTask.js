let Task = require('./Task');
let FileCollection = require('../FileCollection');

class ConcatenateFilesTask extends Task {
    /**
     * Run the task.
     */
    run() {
        this.files = new FileCollection(this.data.src);

        this.merge();
    }

    /**
     * Merge the files into one.
     */
    merge() {
        this.assets.push(this.files.merge(this.data.output, this.data.babel));
    }

    /**
     * Handle when a relevant source file is changed.
     */
    onChange(updatedFile) {
        this.merge();
    }
}

module.exports = ConcatenateFilesTask;
