let File = require('../File');
let CopyFilesTask = require('../tasks/CopyFilesTask');

class Copy {
    /**
     * The API name for the component.
     */
    name() {
        return ['copy', 'copyDirectory'];
    }

    /**
     * Register the component.
     *
     * @param {any} from
     * @param {string} to
     */
    register(from, to) {
        Mix.addTask(new CopyFilesTask({ from, to: new File(to) }));
    }
}

module.exports = Copy;
