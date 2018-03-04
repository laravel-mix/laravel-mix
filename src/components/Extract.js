let webpack = require('webpack');

class Extract {
    /**
     * Create a new component instance.
     */
    constructor() {
        this.entry = null
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
        this.entry = entry
    }
}

module.exports = Extract;
