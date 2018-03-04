let webpack = require('webpack');

class Extract {
    /**
     * Create a new component instance.
     */
    constructor() {
        this.extractions = [];
    }

    /**
     * Register the component.
     *
     * @param {*} libs
     * @param {string} output
     */
    register(libs, output) {
        this.extractions.push({ libs, output });
    }

    /**
     * Assets to append to the webpack entry.
     *
     * @param {Entry} entry
     */
    webpackEntry(entry) {
        this.extractions = this.extractions.map(
            entry.addExtraction.bind(entry)
        );

        // If we are extracting vendor libraries, then we also need
        // to extract Webpack's manifest file to assist with caching.
        if (this.extractions.length) {
            this.extractions.push(
                path.join(entry.base, 'manifest').replace(/\\/g, '/')
            );
        }
    }
}

module.exports = Extract;
