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
     * 
     * @param {boolean} usePolling
     */
    watch(usePolling = false) {
        if (this.isBeingWatched) return;

        const files = this.files.get()
        const watcher = chokidar.watch(files, { usePolling, persistent: true})
            .on('change', this.onChange.bind(this));

        this.isBeingWatched = true;
    }
}

module.exports = Task;
