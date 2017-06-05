/**
 * Create a new plugin instance.
 */
function CustomTasksPlugin() {
    this.needsVersioning = [];
}


/**
 * Apply the plugin.
 *
 * @param {Object} compiler
 */
CustomTasksPlugin.prototype.apply = function (compiler) {
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
CustomTasksPlugin.prototype.runTask = function (task, stats) {
    task.run();

    task.assets.forEach(asset => {
        Mix.manifest.add(asset.pathFromPublic());

        // Update the Webpack assets list for better terminal output.
        stats.compilation.assets[asset.pathFromPublic()] = {
            size: () => asset.size(),
            emitted: true
        };
    });
};


/**
 * Minify the given asset file.
 *
 * @param {File} asset
 */
CustomTasksPlugin.prototype.minifyAssets = function (asset) {
    let manifest = Object.keys(Mix.manifest.get());

    manifest.forEach(asset => {
        asset = new File(path.join(Config.publicPath, asset));

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
}


/**
 * Version all files that are present in the manifest.
 */
CustomTasksPlugin.prototype.applyVersioning = function () {
    let manifest = Object.keys(Mix.manifest.get());

    manifest.forEach(file => Mix.manifest.hash(file));
}


module.exports = CustomTasksPlugin;
