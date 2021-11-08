const glob = require('glob');
const { concat } = require('lodash');
const path = require('path');
const File = require('../File');
const VersionFilesTask = require('../tasks/VersionFilesTask');
const { Component } = require('./Component');

module.exports = class Version extends Component {
    /** @type {string[]} */
    paths = [];

    /**
     * Register the component.
     *
     * @param {string|string[]} paths
     */
    register(paths = []) {
        this.paths = concat([], paths);
        this.context.addTask(new VersionFilesTask({ files: this.files() }));
    }

    files() {
        return this.paths.flatMap(filePath => {
            if (File.find(filePath).isDirectory()) {
                filePath += path.sep + '**/*';
            }

            if (!filePath.includes('*')) {
                return filePath;
            }

            return glob.sync(new File(filePath).forceFromPublic().relativePath(), {
                nodir: true
            });
        });
    }
};
