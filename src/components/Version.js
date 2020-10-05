let glob = require('glob');
let path = require('path');
let File = require('../File');
let webpack = require('webpack');
let VersionFilesTask = require('../tasks/VersionFilesTask');

class Version {
    /**
     * Register the component.
     *
     * @param {Array} files
     */
    register(files = []) {
        files = flatten(
            [].concat(files).map(filePath => {
                if (File.find(filePath).isDirectory()) {
                    filePath += path.sep + '**/*';
                }

                if (!filePath.includes('*')) return filePath;

                return glob.sync(
                    new File(filePath).forceFromPublic().relativePath(),
                    { nodir: true }
                );
            })
        );

        Mix.addTask(new VersionFilesTask({ files }));
    }
}

module.exports = Version;
