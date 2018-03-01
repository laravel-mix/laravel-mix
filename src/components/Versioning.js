let glob = require('glob');
let path = require('path');
let webpack = require('webpack');
let VersionFilesTask = require('./tasks/VersionFilesTask');

class Versioning {
    register(files = []) {
        Config.versioning = true;

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

        return this;
    }

    webpackPlugins() {
        if (Mix.isUsing('versioning')) {
            let WebpackChunkHashPlugin = require('webpack-chunk-hash');

            return [
                new webpack[
                    Mix.inProduction()
                        ? 'HashedModuleIdsPlugin'
                        : 'NamedModulesPlugin'
                ](),
                new WebpackChunkHashPlugin()
            ];
        } else if (Mix.isUsing('hmr')) {
            return new webpack.NamedModulesPlugin();
        }
    }
}

module.exports = Versioning;
