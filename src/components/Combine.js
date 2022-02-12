const File = require('../File');
const Assert = require('../Assert');
const ConcatFilesTask = require('../tasks/ConcatenateFilesTask');
const { Component } = require('./Component');
const { concat } = require('lodash');

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
     * @param {string} [output]
     * @param {boolean} babel
     */
    register(src, output = '', babel = false) {
        // Do we need to perform compilation?
        babel = babel || this.caller === 'babel';

        const sources = concat([], src);
        const hasOutputPath = output !== undefined && output !== '';

        if (hasOutputPath) {
            this.context.addTask(
                this.createTask({
                    src: sources,
                    dst: output,
                    babel
                })
            );

            return;
        }

        if (this.caller !== 'minify') {
            throw new Error(
                `An output file path is required when using mix.${this.caller}()`
            );
        }

        // We've we're minifying an array of files then the output is the same as the input with a .min extension added
        for (const source of sources) {
            this.context.addTask(
                this.createTask({
                    src: source,
                    dst: source.replace(/\.([a-z]{2,})$/i, '.min.$1'),
                    babel
                })
            );
        }
    }

    /**
     * @param {object} param0
     * @param {string|string[]} param0.src
     * @param {string} param0.dst
     * @param {boolean} param0.babel
     */
    createTask({ src, dst, babel }) {
        const output = new File(dst);

        Assert.combine(src, output);

        return new ConcatFilesTask({
            src,
            output,
            babel,
            ignore: [output.relativePath()]
        });
    }
};
