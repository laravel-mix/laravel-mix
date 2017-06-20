class CustomTasksPlugin {
    /**
     * Apply the plugin.
     *
     * @param {Object} compiler
     */
    apply(compiler) {
        compiler.plugin('done', stats => {
            Mix.tasks.forEach(task => this.runTask(task, stats));

            if (Mix.isUsing('versioning')) {
                this.applyVersioning();
            }

            if (Mix.inProduction()) {
                this.minifyAssets();
            }

            if (Mix.isWatching()) {
                Mix.tasks.forEach(task => task.watch());
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
     *
     * @param {File} asset
     */
    minifyAssets(asset) {
        let tasks = Mix.tasks.filter(task => task.constructor.name !== 'VersionFilesTask');

        tasks.forEach(task => {
            task.assets.forEach(asset => {
                try {
                    asset.minify();
                } catch (e) {
                    console.log(
                        `Whoops! We had trouble minifying "${asset.relativePath()}". ` +
                        `Perhaps you need to use mix.babel() instead?`
                    );

                    throw e;
                }
            });
        });
    }


    /**
     * Version all files that are present in the manifest.
     */
    applyVersioning() {
        let manifest = Object.keys(Mix.manifest.get());

        manifest.forEach(file => Mix.manifest.hash(file));
    }
}

module.exports = CustomTasksPlugin;
