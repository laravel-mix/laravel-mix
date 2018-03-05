let glob = require('glob');
let path = require('path');
let webpack = require('webpack');
let VersionFilesTask = require('../tasks/VersionFilesTask');

class Versioning {
    name() {
        return 'version';
    }

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

    webpackPlugins() {
        let WebpackChunkHashPlugin = require('webpack-chunk-hash');

        return [
            new webpack[
                Mix.inProduction()
                    ? 'HashedModuleIdsPlugin'
                    : 'NamedModulesPlugin'
            ](),
            new WebpackChunkHashPlugin()
        ];
    }
}

module.exports = Versioning;
