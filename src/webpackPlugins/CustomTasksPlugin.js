let Log = require('../Log');
let collect = require('collect.js');

class CustomTasksPlugin {
    /**
     * Apply the plugin.
     *
     * @param {import("webpack").Compiler} compiler
     */
    apply(compiler) {
        compiler.hooks.done.tapAsync(
            this.constructor.name,
            (stats, callback) => {
                this.runTasks(stats).then(async () => {
                    if (Mix.components.get('version')) {
                        this.applyVersioning();
                    }

                    if (Mix.inProduction()) {
                        await this.minifyAssets();
                    }

                    if (Mix.isWatching()) {
                        Mix.tasks.forEach(task => task.watch(Mix.isPolling()));
                    }

                    Mix.manifest.refresh();
                    callback();
                });
            }
        );
    }

    /**
     * Execute the task.
     *
     * @param {Task} task
     * @param {import("webpack").Stats} stats
     */
    runTask(task, stats) {
        return Promise.resolve(task.run()).then(() => {
            task.assets.forEach(asset => {
                Mix.manifest.add(asset.pathFromPublic());

                // Update the Webpack assets list for better terminal output.
                stats.compilation.assets[asset.pathFromPublic()] = {
                    size: () => asset.size(),
                    emitted: true
                };
            });
        });
    }

    /**
     * Execute potentially asynchrone tasks sequentially.
     *
     * @param {Array} tasks
     */
    runTasks(stats, index = 0) {
        if (index === Mix.tasks.length) return Promise.resolve();

        const task = Mix.tasks[index];

        return this.runTask(task, stats).then(() =>
            this.runTasks(stats, index + 1)
        );
    }

    /**
     * Minify the given asset file.
     */
    async minifyAssets() {
        const assets = collect(Mix.tasks)
            .where('constructor.name', '!==', 'VersionFilesTask')
            .where('constructor.name', '!==', 'CopyFilesTask')
            .flatMap(({ assets }) => assets);

        const tasks = assets.map(async asset => {
            try {
                await asset.minify();
            } catch (e) {
                Log.error(
                    `Whoops! We had trouble minifying "${asset.relativePath()}". ` +
                        `Perhaps you need to use mix.babel() instead?`
                );

                throw e;
            }
        });

        await Promise.allSettled(tasks);
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
