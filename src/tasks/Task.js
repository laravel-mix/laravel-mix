let chokidar = require('chokidar');

class Task {
    /**
     * Create a new task instance.
     *
     * @param {Object} data
     */
    constructor(data) {
        this.data = data;
        this.assets = [];
        this.isBeingWatched = false;
    }


    /**
     * Watch all relevant files for changes.
     */
    watch() {
        if (this.isBeingWatched) return;

        chokidar.watch(this.files.get(), { persistent: true })
            .on('change', this.onChange.bind(this));

        this.isBeingWatched = true;
    }
}

module.exports = Task;
