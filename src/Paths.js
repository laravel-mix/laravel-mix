let argv = require('yargs').argv;
let path = require('path');

class Paths {
    /**
     * Create a new Paths instance.
     */
    constructor() {
        // TODO: Refactor setup to allow removing this check
        if (process.env.NODE_ENV === 'test') {
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
        const path = this.root(
            process.env && process.env.MIX_FILE ? process.env.MIX_FILE : 'webpack.mix'
        );

        try {
            require.resolve(`${path}.cjs`);

            return `${path}.cjs`;
        } catch (err) {
            //
        }

        return path;
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
