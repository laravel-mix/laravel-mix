let path = require('path');
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
        let file = new this.mix.File(path.resolve(__dirname, 'mock-entry.js'));

        this.entry.add('mix', file.path());

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

        this.mix.extract.forEach(extract => {
            let vendorPath = extract.output();

            this.extractions.push(vendorPath);

            this.entry.add(vendorPath, extract.libs);
        });

        return this;
    }


    /**
     * Reset the entry structure.
     */
    reset() {
        this.entry = this.entry.empty();
    }
}

module.exports = EntryBuilder;
