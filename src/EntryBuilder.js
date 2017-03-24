let Collection = new require('./Collection');

class EntryBuilder {
    /**
     * Create a new EntryBuilder instance.
     *
     * @param {object} mix
     */
    constructor(mix) {
        this.mix = mix;
        this.entry = new Collection;
        this.extractions = [];
    }


    /**
     * Build up the entry point for Webpack.
     */
    build()
    {
        this.addScripts()
            .addCss()
            .addVendors();

        return this.entry.get();
    }


    /**
     * Add any relevant scripts to the entry.
     */
    addScripts() {
        if (! this.mix.js.length) {
            return this.addTemporaryScript();
        }

        this.mix.js.forEach(paths => {
            this.entry.add(
                this.entryName(paths.output),
                paths.entry.map(src => src.path)
            );
        });

        return this;
    }


    /**
     * Calculate the entry named from the output path.
     *
     * @param {object} output
     */
    entryName(output) {
        return output.pathWithoutExt
            .replace(/\\/g, '/')
            .replace(global.options.publicPath + '/', '/');
    }


    /**
     * Add a temporary JS entrypoint, since the
     * user hasn't called mix.js().
     */
    addTemporaryScript() {
        let file = new File(path.resolve(__dirname, 'mock-entry.js'));

        this.entry.add('mix', file.path());

        global.events.listen('build', stats => {
            // If no mix.js() call was requested, we'll also need
            // to delete the output script for the user. Since we
            // won't know the exact name, we'll hunt it down.
            let temporaryOutputFile = stats.toJson()
                .assets
                .find(asset => asset.chunkNames.includes('mix'))
                .name;

            File.find(
                path.resolve(this.mix.output().path, temporaryOutputFile)
            ).delete();
        });

        return this;
    }


    /**
     * Add any relevant stylesheets to the entry.
     */
    addCss() {
        let preprocessors = this.mix.preprocessors;

        if (! preprocessors) return this;

        let name = Object.keys(this.entry.get())[0];
        let stylesheets = preprocessors.map(css => css.src.path);

        this.entry.add(name, stylesheets);

        return this;
    }


    /**
     * Add any relevant vendor extractions to the entry.
     */
    addVendors() {
        if (! this.mix.js.length || ! this.mix.extract) return this;

        this.mix.extract.forEach(extract => this.addVendor(extract));

        // We also need to extract webpack's manifest file,
        // so that it doesn't bust the cache.
        this.extractions.push(
            path.join(this.extractionBase, 'manifest').replace(/\\/g, '/')
        );

        return this;
    }


    /**
     * Add a single vendor extraction to the entry object.
     *
     * @param {object} extract
     */
    addVendor(extract) {
        let vendorPath = extract.output();

        this.extractions.push(vendorPath);

        this.extractionBase = new File(vendorPath).parsePath().base;

        this.entry.add(vendorPath, extract.libs);
    }


    /**
     * Reset the entry structure.
     */
    reset() {
        this.entry = this.entry.empty();
    }
}

module.exports = EntryBuilder;
