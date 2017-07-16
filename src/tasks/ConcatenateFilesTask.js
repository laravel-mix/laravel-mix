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
        const mergedFiles = this.files.merge(
          this.data.output,
          this.data.babel,
          this.data.skipSourceMaps
        );
        if (Array.isArray(mergedFiles)) {
          this.assets.push(...mergedFiles);
        } else {
          this.assets.push(mergedFiles);
        }
    }


    /**
     * Handle when a relevant source file is changed.
     */
    onChange(updatedFile) {
        this.merge();
    }
}


module.exports = ConcatenateFilesTask;
