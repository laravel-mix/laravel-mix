let argv = require('yargs').argv;
let path = require('path');

class Paths {
    /**
     * Create a new Paths instance.
     */
    constructor() {
        if (argv['$0'].includes('ava')) {
            this.rootPath = path.resolve(__dirname, '../');
        } else {
            this.rootPath = process.cwd();
        }
    }

    /**
     * Set the root path to resolve webpack.mix.js.
     *
     * @param {string} path
     */
    setRootPath(path) {
        this.rootPath = path;

        return this;
    }

    /**
     * Determine the path to the user's webpack.mix.js file.
     */
    mix() {
        return this.root(
            process.env && process.env.MIX_FILE
                ? process.env.MIX_FILE
                : 'webpack.mix'
        );
    }

    /**
     * Determine the project root.
     *
     * @param {string|null} append
     */
    root(append = '') {
        return path.resolve(this.rootPath, append);
    }
}

module.exports = Paths;
