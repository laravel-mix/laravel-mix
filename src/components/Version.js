const { concat } = require('lodash');
const VersionFilesTask = require('../tasks/VersionFilesTask');
const { Component } = require('./Component');

module.exports = class Version extends Component {
    /**
     * Register the component.
     *
     * @param {string|string[]} paths
     */
    register(paths = []) {
        this.context.addTask(new VersionFilesTask({ files: concat([], paths) }));
    }
};
