let File = require('../File');
let Assert = require('../Assert');
let ConcatFilesTask = require('../tasks/ConcatenateFilesTask');

class Combine {
    /**
     * The API name for the component.
     */
    name() {
        return ['combine', 'scripts', 'babel', 'styles', 'minify'];
    }

    /**
     * Register the component.
     *
     * @param {String|Array} src
     * @param {String} output
     * @param {Boolean} babel
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

        Mix.addTask(
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
}

module.exports = Combine;
