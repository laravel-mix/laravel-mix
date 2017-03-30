let objectValues = require('lodash').values;

class Versioning {
    /**
     * Create a new Versioning instance.
     *
     * @param {Array}  manualFiles
     * @param {object} manifest
     * @param {string} publicPath
     */
    constructor(manualFiles = [], manifest) {
        this.manualFiles = manualFiles.map(file => new File(file));
        this.manifest = manifest;

        this.registerEvents();
    }


    /**
     * Register all relevant event listeners.
     */
    registerEvents() {
        global.events.listen('standalone-sass-compiled', compiledFile => {
            compiledFile.rename(compiledFile.versionedPath());

            this.prune();
        });

        global.events.listen(
            ['build', 'combined'], () => this.prune()
        );
    }


    /**
     * Register a watcher for any files that aren't
     * included in Webpack's core bundle process.
     */
    watch() {
        if (! process.argv.includes('--watch')) return this;

        this.manualFiles.forEach(file => {
            file.watch(file => {
                // Delete the old versioned file.
                File.find(
                    path.join(global.options.publicPath, this.manifest.get(file))
                ).delete();

                // And then whip up a new one.
                file.version();

                this.prune();
            });
        });

        return this;
    }


    /**
     * Create all hashed files requested by the user,
     * when they called mix.version(['file']);
     */
    writeHashedFiles() {
        this.manualFiles.forEach(file => file.version());

        return this;
    }


    /**
     * The user may optionally add extra files to be
     * versioned. Here, we'll manually add those to
     * Mix's manifest file.
     */
    addManualFilesToManifest() {
        this.manualFiles.forEach(file => this.manifest.add(file));
    }


    /**
     * Replace all old hashed files with the new versions.
     */
    prune() {
        this.writeHashedFiles().addManualFilesToManifest();

        let cachedFiles = objectValues(this.manifest.cache);
        let currentFiles = objectValues(this.manifest.get());

        cachedFiles
            .filter(file => ! currentFiles.includes(file))
            .map(file => {
                return file.startsWith(global.options.publicPath)
                    ? file
                    : path.join(global.options.publicPath, file);
            })
            .forEach(file => {
                this.manifest.remove(file)
            });

        this.manifest.refresh();
        this.manifest.cache = currentFiles;

        return currentFiles;
    }
}

module.exports = Versioning;
