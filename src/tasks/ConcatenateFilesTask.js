let Task = require('./Task');
let FileCollection = require('../FileCollection');

class ConcatenateFilesTask extends Task {
    /**
     * Run the task.
     */
    async run() {
        this.files = new FileCollection(this.data.src);

        await this.merge();
    }

    /**
     * Merge the files into one.
     */
    async merge() {
        this.assets.push(
            await this.files.merge(this.data.output, this.data.babel)
        );
    }

    /**
     * Handle when a relevant source file is changed.
     */
    onChange(updatedFile) {
        this.merge();
    }
}

module.exports = ConcatenateFilesTask;
