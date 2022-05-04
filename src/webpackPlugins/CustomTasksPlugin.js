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
     * Add asset to the webpack stats.
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
     */
    async runTasks(stats) {
        let assets = []

        for (const task of this.mix.tasks) {
            await Promise.resolve(task.run());

            assets.push(...task.assets)
        }

        await Promise.allSettled(assets.map(asset => this.addAsset(asset, stats)));
    }

    /**
     * Minify the given asset file.
     */
    async minifyAssets() {
        const assets = collect(this.mix.tasks)
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
        for (const [key, value] of Object.entries(this.mix.manifest.get())) {
            this.mix.manifest.hash(key)
        }
    }
}

module.exports = CustomTasksPlugin;
