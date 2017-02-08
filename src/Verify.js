let assert = require('assert');
let File = require('./File');

class Verify {
    /**
     * Verify that the call the mix.js() is valid.
     *
     * @param {*} entry
     * @param {*} output
     */
    static js(entry, output) {
        assert(
            typeof entry === 'string' || Array.isArray(entry),
            'mix.js() is missing required parameter 1: entry'
        );

        assert(
            typeof output === 'string',
            'mix.js() is missing required parameter 2: output'
        );
    }


    /**
     * Verify that the calls the mix.sass() and mix.less() are valid.
     *
     * @param {string} type
     * @param {string} src
     * @param {string} output
     */
    static preprocessor(type, src, output) {
        assert(
            typeof src === 'string',
            `mix.${type}() is missing required parameter 1: src`
        );

        assert(
            typeof output === 'string',
            `mix.${type}() is missing required parameter 2: output`
        );
    }


    /**
     * Verify that the call the mix.extract() is valid.
     *
     * @param {Array} libs
     */
    static extract(libs) {
        assert(
            libs && Array.isArray(libs),
            'mix.extract() requires an array as its first parameter.'
        );
    }


    /**
     * Verify that the call the mix.combine() is valid.
     *
     * @param {Array} src
     */
    static combine(src) {
        assert(
            Array.isArray(src),
            'mix.combine() requires an array as its first parameter.'
        );
    }
}

module.exports = Verify;