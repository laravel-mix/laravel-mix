let ConcatFilesTask = require('../tasks/ConcatenateFilesTask');
let Assert = require('../Assert');
let _ = require('lodash');
let collect = require('collect.js');
let glob = require('glob');

class Combine {
    /**
     * The API name for the component.
     */
    name() {
        return ['combine', 'scripts', 'babel', 'styles', 'minify'];
    }

    /**
     *
     * Register the component.
     *
     * @param {*} src
     * @param {string} output
     * @param {Boolean} babel
     */
    register(src, output = '', babel = false) {
        if (this.caller === 'babel') {
            babel = true;
        }

        if (this.caller === 'minify') {
            if (Array.isArray(src)) {
                src.forEach(file => this.register(file));

                return this;
            }

            output = src.replace(/\.([a-z]{2,})$/i, '.min.$1');
        }

        output = new File(output);

        Assert.combine(src, output);

        if (typeof src === 'string' && File.find(src).isDirectory()) {
            src = collect(glob.sync(path.join(src, '**/*'), { nodir: true }))
                .except(output.relativePath())
                .all();
        }

        let task = new ConcatFilesTask({ src, output, babel });

        Mix.addTask(task);
    }
}

module.exports = Combine;
