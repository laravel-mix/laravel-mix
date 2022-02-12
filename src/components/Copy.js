const File = require('../File');
const CopyFilesTask = require('../tasks/CopyFilesTask');
const { Component } = require('./Component');

module.exports = class Copy extends Component {
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
        this.context.addTask(new CopyFilesTask({ from, to: new File(to) }));
    }
};
