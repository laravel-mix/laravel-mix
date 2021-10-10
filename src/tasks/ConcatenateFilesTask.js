let Task = require('./Task');
let FileCollection = require('../FileCollection');
const { FileGlob } = require('./FileGlob')

class ConcatenateFilesTask extends Task {
    /**
     * Run the task.
     */
    run() {
        return this.merge();
    }

    /**
     * Merge the files into one.
     */
    async merge() {
        // @ts-ignore
        this.files = await FileGlob.expand(this.data.src, {
            ignore: this.data.ignore || [],
        })

        const files = new FileCollection(this.files)

        return files
            .merge(this.data.output, this.data.babel)
            .then(this.assets.push.bind(this.assets));
    }

    /**
     * Handle when a relevant source file is changed.
     */
    onChange(updatedFile) {
        this.merge();
    }
}

module.exports = ConcatenateFilesTask;
