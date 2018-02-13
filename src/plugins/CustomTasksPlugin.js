class CustomTasksPlugin {
    /**
     * Apply the plugin.
     *
     * @param {Object} compiler
     */
    apply(compiler) {
        compiler.plugin('after-emit', (compiler, next) => {
            Mix.tasks.forEach(task => this.runTask(task, compiler));

            if (Mix.isUsing('versioning')) {
                this.applyVersioning(compiler);
            }

            if (Mix.inProduction()) {
                this.minifyAssets();
            }

            if (Mix.isWatching()) {
                Mix.tasks.forEach(task => task.watch(Mix.isPolling()));
            }

            Mix.manifest.refresh();

            return next();
        });
    }

    /**
     * Execute the task.
     *
     * @param {Task} task
     */
    runTask(task, compiler) {
        task.run();

        task.assets.forEach(asset => {
            Mix.manifest.add(asset.pathFromPublic());

            // Update the Webpack assets list for better terminal output.
            compiler.assets[asset.pathFromPublic()] = asset;
            compiler.assets[asset.pathFromPublic()].emitted = true;
        });
    }

    /**
     * Minify the given asset file.
     */
    minifyAssets() {
        let tasks = Mix.tasks.filter(
            task => task.constructor.name !== 'VersionFilesTask'
        );

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
    applyVersioning(compiler) {
        let manifest = Object.keys(Mix.manifest.get());

        manifest.forEach(file => {
            Mix.manifest.hash(file);
            if (file != Mix.manifest.manifest[file]) {
                compiler.assets[file].existsAt = Mix.manifest.manifest[file];
                if (compiler.assets[file].hasOwnProperty('absolutePath')) {
                    compiler.assets[file].absolutePath = compiler.assets[file].absolutePath.replace(
                        new RegExp(file + '$'),
                        Mix.manifest.manifest[file]
                    );
                }
            }
        });
    }
}

module.exports = CustomTasksPlugin;
