let assert = require('assert');
let File = require('./File');

class Verify {
    /**
     * Verify that the call the mix.js() is valid.
     *
     * @param {mixed} entry
     * @param {mixed} output
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
     * @param {string} entry
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
     * @param {array} entry
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
     * @param {array} src
     */
    static combine(src) {
        assert(
            Array.isArray(src),
            'mix.combine() requires an array as its first parameter.'
        );

        src.forEach(file => {
            assert(
                File.exists(file),
                `Mix.combine() error: "${file} does not exist.`
            );
        });
    }
}

module.exports = Verify;