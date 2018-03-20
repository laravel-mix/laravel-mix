let assert = require('assert');
let exec = require('child_process').execSync;
let argv = require('yargs').argv;

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
     * Verify that the calls to mix.sass() and mix.less() are valid.
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
     * Verify that calls to mix.combine() are valid.
     *
     * @param {string} src
     * @param {File}   output
     */
    static combine(src, output) {
        assert(
            output.isFile(),
            'mix.combine() requires a full output file path as the second argument.'
        );
    }

    /**
     * Assert that the given file exists.
     *
     * @param {string} file
     */
    static exists(file) {
        assert(
            File.exists(file),
            `Whoops, you are trying to compile ${file}, but that file does not exist.`
        );
    }

    /**
     * Verify that the necessary dependencies are available.
     *
     * @param {Array}  list
     * @param {Boolean} abortOnComplete
     */
    static dependencies(list, abortOnComplete = false) {
        if (argv['$0'].includes('ava')) return;

        list
            .reject(dependency => {
                try {
                    return require.resolve(dependency.replace(/@.+$/, ''));
                } catch (e) {}
            })
            .tap(dependencies => {
                installDependencies(dependencies, abortOnComplete);
            });
    }

    /**
     * Verify that the necessary dependency is available.
     *
     * @param {string}  name
     * @param {array}   dependencies
     * @param {Boolean} abortOnComplete
     */
    static dependency(name, abortOnComplete = false) {
        if (argv['$0'].includes('ava')) return;

        try {
            require.resolve(name.replace(/@.+$/, ''));
        } catch (e) {
            installDependencies(name, abortOnComplete);
        }
    }
}

/**
 * Install the given dependencies using npm or yarn.
 *
 * @param {array} dependencies
 */
let installDependencies = (dependencies, abortOnComplete = false) => {
    console.log(
        'Additional dependencies must be installed. ' +
            'This will only take a moment.'
    );

    if (Array.isArray(dependencies)) {
        dependencies = dependencies.join(' ');
    }

    let command = `npm install ${dependencies} --save-dev`;

    if (File.exists('yarn.lock')) {
        command = `yarn add ${dependencies} --dev`;
    }

    exec(command);

    if (abortOnComplete) abort(abortOnComplete);
};

let abort = message => {
    console.log(
        typeof message === 'string'
            ? message
            : 'Finished. Please run Mix again.'
    );

    process.exit();
};

module.exports = Verify;
