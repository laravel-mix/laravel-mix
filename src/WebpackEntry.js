let path = require('path');
let Collection = new require('./Collection');

class WebpackEntry {
    /**
     * Create a new WebpackEntry instance.
     *
     * @param {object} mix
     */
    constructor(mix) {
        this.mix = mix;
        this.entry = new Collection;
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
            let name = paths.output.pathWithoutExt
                .replace(this.mix.publicPath, '')
                .replace(/\\/g, '/');

            this.entry.add(
                name, paths.entry.map(src => src.path)
            );
        });

        return this;
    }


    /**
     * Add a temporary JS entrypoint, since the
     * user hasn't called mix.js().
     */
    addTemporaryScript() {
        let file = new this.mix.File('mix-entry.js').write('');

        this.entry.add('mix', file.path());

        this.mix.events.listen('build', stats => {
            file.delete();

            // If no mix.js() call was requested, we'll also need
            // to delete the output script for the user. Since we
            // won't know the exact name, we'll hunt it down.
            let temporaryOutputFile = stats.toJson()
                .assets
                .find(asset => asset.chunkNames.includes('mix'))
                .name;

            this.mix.File.find(
                path.join(this.mix.output().path, temporaryOutputFile)
            ).delete();
        });

        return this;
    }


    /**
     * Add any relevant stylesheets to the entry.
     */
    addCss() {
        let preprocessor = this.mix.cssPreprocessor;

        if (! preprocessor) return this;

        let name = Object.keys(this.entry.get())[0];
        let stylesheets = this.mix[preprocessor].map(css => css.src.path);

        this.entry.add(name, stylesheets);

        return this;
    }


    /**
     * Add any relevant vendor extractions to the entry.
     */
    addVendors() {
        if (! this.mix.js.length || ! this.mix.js.vendor) return this;

        let vendorPath = (this.mix.js.base + '/vendor')
            .replace(this.mix.publicPath, '');

        this.entry.add(vendorPath, this.mix.js.vendor);

        return this;
    }


    /**
     * Reset the entry structure.
     */
    reset() {
        this.entry = this.entry.empty();
    }
}

module.exports = WebpackEntry;
