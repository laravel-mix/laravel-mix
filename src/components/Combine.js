const File = require('../File');
const Assert = require('../Assert');
const ConcatFilesTask = require('../tasks/ConcatenateFilesTask');
const { Component } = require('./Component');

module.exports = class Combine extends Component {
    /**
     * The API name for the component.
     */
    name() {
        return ['combine', 'scripts', 'babel', 'styles', 'minify'];
    }

    /**
     * Register the component.
     *
     * @param {string|string[]} src
     * @param {string} output
     * @param {boolean} babel
     */
    register(src, output = '', babel = false) {
        this.src = src;
        this.output = output;
        this.babel = babel || this.caller === 'babel';

        if (this.caller === 'minify') {
            this.registerMinify();
        }

        this.addTask();
    }

    /**
     * Register the minify task.
     */
    registerMinify() {
        if (Array.isArray(this.src)) {
            this.src.forEach(file => this.register(file));
        }

        this.output = this.src.replace(/\.([a-z]{2,})$/i, '.min.$1');
    }

    /**
     * Add a new ConcatFiles task.
     */
    addTask() {
        this.output = new File(this.output);

        Assert.combine(this.src, this.output);

        this.context.addTask(
            new ConcatFilesTask({
                src: this.src,
                output: this.output,
                babel: this.babel,
                ignore: [this.output.relativePath()]
            })
        );
    }

    /**
     * Find all relevant files matching the given source path.
     *
     * @param   {string|string[]} src
     * @returns {string[]}
     */
    glob(src) {
        const paths = Array.isArray(src) ? src : [src];

        return paths.flatMap(srcPath =>
            glob.sync(
                File.find(srcPath).isDirectory() ? path.join(srcPath, '**/*') : srcPath,
                { nodir: true }
            )
        );
    }
};
