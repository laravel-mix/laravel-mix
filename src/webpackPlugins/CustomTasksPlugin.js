let Log = require('../Log');
let collect = require('collect.js');

class CustomTasksPlugin {
    /**
     * Apply the plugin.
     *
     * @param {import("webpack").Compiler} compiler
     */
    apply(compiler) {
        compiler.hooks.done.tapAsync(this.constructor.name, (stats, callback) => {
            this.runTasks(stats).then(async () => {
                if (Mix.components.get('version') && !Mix.isUsing('hmr')) {
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
        });
    }

    /**
     * Execute the task.
     *
     * @param {Task} task
     * @param {import("webpack").Stats} stats
     */
    async runTask(task, stats) {
        await Promise.resolve(task.run());

        await Promise.allSettled(task.assets.map(asset => this.addAsset(asset, stats)));
    }

    /**
     * Add asset to the webpack statss
     *
     * @param {import("../File")} asset
     * @param {import("webpack").Stats} stats
     */
    async addAsset(asset, stats) {
        // Skip adding directories to the manifest
        // TODO: We should probably add the directory but skip hashing
        if (asset.isDirectory()) {
            return;
        }

        const path = asset.pathFromPublic();

        // Add the asset to the manifest
        Mix.manifest.add(path);

        // Update the Webpack assets list for better terminal output.
        stats.compilation.assets[path] = {
            size: () => asset.size(),
            emitted: true
        };
    }

    /**
     * Execute potentially asynchronous tasks sequentially.
     *
     * @param stats
     * @param index
     */
    runTasks(stats, index = 0) {
        if (index === Mix.tasks.length) return Promise.resolve();

        const task = Mix.tasks[index];

        return this.runTask(task, stats).then(() => this.runTasks(stats, index + 1));
    }

    /**
     * Minify the given asset file.
     */
    async minifyAssets() {
        const assets = collect(Mix.tasks)
            .where('constructor.name', '!==', 'VersionFilesTask')
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
        collect(Mix.manifest.get()).each((value, key) => Mix.manifest.hash(key));
    }
}

module.exports = CustomTasksPlugin;
