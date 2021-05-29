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
     * @param {function(Task)} onFileChange Will be called on every file that changes
     */
    watch(usePolling = false, onFileChange = Function()) {
        if (this.isBeingWatched) return;

        let files = this.files.get();
        let watcher = chokidar
            .watch(files, { usePolling, persistent: true })
            .on('change', async file => {
                await Promise.resolve(this.onChange(file));
                onFileChange(this);
            });

        // Workaround for issue with atomic writes.
        // See https://github.com/paulmillr/chokidar/issues/591
        if (!usePolling) {
            watcher.on('raw', (event, path, { watchedPath }) => {
                if (event === 'rename') {
                    watcher.unwatch(files);
                    watcher.add(files);
                }
            });
        }

        this.isBeingWatched = true;
    }
}

module.exports = Task;
