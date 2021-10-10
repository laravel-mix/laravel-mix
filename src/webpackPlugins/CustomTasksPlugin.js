let Log = require('../Log');
let collect = require('collect.js');

class CustomTasksPlugin {
    /**
     *
     * @param {import('../Mix')} mix
     */
    constructor(mix) {
        this.mix = mix || global.Mix;
    }

    /**
     * Apply the plugin.
     *
     * @param {import("webpack").Compiler} compiler
     */
    apply(compiler) {
        compiler.hooks.done.tapPromise(this.constructor.name, async stats => {
            await this.runTasks(stats);

            if (this.mix.components.get('version') && !this.mix.isUsing('hmr')) {
                this.applyVersioning();
            }

            if (this.mix.inProduction()) {
                await this.minifyAssets();
            }

            if (this.mix.isWatching()) {
                this.mix.tasks.forEach(task => task.watch(this.mix.isPolling()));
            }

            this.mix.manifest.refresh();
        });
    }

    /**
     * Execute the task.
     *
     * @param {import("../tasks/Task")} task
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
        this.mix.manifest.add(path);

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
        if (index === this.mix.tasks.length) return Promise.resolve();

        const task = this.mix.tasks[index];

        return this.runTask(task, stats).then(() => this.runTasks(stats, index + 1));
    }

    /**
     * Minify the given asset file.
     */
    async minifyAssets() {
        const assets = collect(this.mix.tasks)
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
        collect(this.mix.manifest.get()).each((value, key) =>
            this.mix.manifest.hash(key)
        );
    }
}

module.exports = CustomTasksPlugin;
