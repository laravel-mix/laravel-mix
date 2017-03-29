let argv = require('yargs').argv;

class Paths {
    /**
     * Create a new Paths instance.
     */
    constructor() {
        this.rootPath = path.resolve(__dirname, '../../../');
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
        return argv.env && argv.env.mixfile !== undefined ? this.root(argv.env.mixfile) : this.root('webpack.mix');
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
