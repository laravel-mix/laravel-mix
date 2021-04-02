let Task = require('./Task');
let File = require('../File');
let FileCollection = require('../FileCollection');

class VersionFilesTask extends Task {
    /**
     * Run the task.
     */
    run() {
        this.files = new FileCollection(this.data.files);

        this.assets = this.data.files.map(file => {
            file = new File(file);

            this.mix.manifest.hash(file.pathFromPublic());

            return file;
        });
    }

    /**
     * Handle when a relevant source file is changed.
     *
     * @param {string} updatedFile
     */
    onChange(updatedFile) {
        this.mix.manifest.hash(new File(updatedFile).pathFromPublic()).refresh();
    }

    get mix() {
        return global.Mix;
    }
}

module.exports = VersionFilesTask;
