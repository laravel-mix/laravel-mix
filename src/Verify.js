let assert = require('assert');
let exec = require('child_process').execSync;

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
     * Verify that the necessary dependency is available.
     *
     * @param {string}  dependency
     * @param {string}  installCommand
     * @param {Boolean} abortOnComplete
     */
    static dependency(dependency, installCommand, abortOnComplete = false) {
        try {
            require.resolve(dependency);
        } catch (e) {
            console.log(
                'Additional dependencies must be installed. ' +
                'This will only take a moment.'
            );

            exec(installCommand);

            if (abortOnComplete) {
                console.log('Finished. Please run Mix again.');

               process.exit();
            }
        }
    }
}

module.exports = Verify;
