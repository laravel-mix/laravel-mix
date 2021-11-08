let Log = require('../Log');
const VersionFilesTask = require('../tasks/VersionFilesTask');
const { debounce } = require('lodash');
const webpack = require('webpack');
const Task = require('../tasks/Task');

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
        let ranOnce = false;
        compiler.hooks.done.tapPromise(this.constructor.name, async stats => {
            // Only run all tasks once
            if (ranOnce) return;
            ranOnce = true;

            await this.runTasks(stats);

            await this.afterChange();

            if (this.mix.isWatching()) {
                this.mix.tasks.forEach(task =>
                    task.watch(
                        this.mix.isPolling(),
                        debounce(this.afterChange.bind(this), 100)
                    )
                );
            }

            this.mix.manifest.refresh();
        });
    }

    /**
     * Execute the task.
     *
     * @param {import("../tasks/Task")<any>} task
     * @param {import("webpack").Stats} stats
     */
    async runTask(task, stats) {
        await Promise.resolve(task.run());
        await Promise.allSettled(task.assets.map(asset => this.addAsset(asset, stats)));
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
        stats.compilation.assets[path] = new webpack.sources.SizeOnlySource(asset.size());
    }

    /**
     * Execute potentially asynchronous tasks sequentially.
     *
     * @param {import("webpack").Stats} stats
     */
    async runTasks(stats) {
        for (const task of this.mix.tasks) {
            await this.runTask(task, stats);
        }
    }

    /**
     * Minify the given asset file.
     * @param {Task<any> | null} task If specified, only assets of this task will be minified
     */
    async minifyAssets(task = null) {
        const assets = (task ? [task] : this.mix.tasks)
            .filter(task => !(task instanceof VersionFilesTask))
            .flatMap(task => task.assets);

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
        Object.keys(this.mix.manifest.get()).forEach(path => {
            this.mix.manifest.hash(path);
        });
    }

    /**
     * Performs manifest and minification updates on files after running tasks
     * @param {Task<any>|null} task If specified, only files for this task will be minified
     * @return {Promise<void>}
     */
    async afterChange(task = null) {
        if (this.mix.components.get('version') && !this.mix.isUsing('hmr')) {
            this.applyVersioning();
        }

        if (this.mix.inProduction()) {
            // Minify task assets
            await this.minifyAssets(task);
        }

        // Rewrite manifest file
        this.mix.manifest.refresh();
    }
}

module.exports = CustomTasksPlugin;
