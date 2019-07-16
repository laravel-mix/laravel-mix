let Log = require('../Log');
let collect = require('collect.js');

class CustomTasksPlugin {
    /**
     * Apply the plugin.
     *
     * @param {Object} compiler
     */
    apply(compiler) {
        compiler.plugin('done', stats => {
            Mix.tasks.forEach(task => this.runTask(task, stats));

            if (Mix.components.get('version')) {
                this.applyVersioning();
            }

            if (Mix.inProduction()) {
                this.minifyAssets();
            }

            if (Mix.isWatching()) {
                Mix.tasks.forEach(task => task.watch(Mix.isPolling()));
            }

            Mix.manifest.refresh();
        });
    }

    /**
     * Execute the task.
     *
     * @param {Task} task
     */
    runTask(task, stats) {
        task.run();

        task.assets.forEach(asset => {
            Mix.manifest.add(asset.pathFromPublic());

            // Update the Webpack assets list for better terminal output.
            stats.compilation.assets[asset.pathFromPublic()] = {
                size: () => asset.size(),
                emitted: true
            };
        });
    }

    /**
     * Minify the given asset file.
     */
    minifyAssets() {
        collect(Mix.tasks)
            .where('constructor.name', '!==', 'VersionFilesTask')
            .where('constructor.name', '!==', 'CopyFilesTask')
            .each(({ assets }) =>
                assets.forEach(asset => {
                    try {
                        asset.minify();
                    } catch (e) {
                        Log.error(
                            `Whoops! We had trouble minifying "${asset.relativePath()}". ` +
                                `Perhaps you need to use mix.babel() instead?`
                        );

                        throw e;
                    }
                })
            );
    }

    /**
     * Version all files that are present in the manifest.
     */
    applyVersioning() {
        collect(Mix.manifest.get()).each((value, key) =>
            Mix.manifest.hash(key)
        );
    }
}

module.exports = CustomTasksPlugin;
