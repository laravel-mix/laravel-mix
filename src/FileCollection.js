let fs = require('fs-extra');
let chokidar = require('chokidar');
let glob = require('glob');

class FileCollection {
    /**
     * Create a new FileCollection instance.
     *
     * @param {string|array} files
     */
    constructor(files) {
        this.files = files;
    }


    /**
     * Copy the src files to the given destination.
     *
     * @param  {string} destination
     * @param  {string|array|null} src
     * @return {this}
     */
    copyTo(destination, src) {
        src = src || this.files;
        this.destination = destination;

        if (Array.isArray(src)) {
            src.forEach(file => this.copyTo(this.destination, file));

            return this;
        }

        if (src.includes('*')) {
            return this.copyTo(this.destination, glob.sync(src));
        }

        src = new File(src).parsePath();
        let output = this.outputPath(src);

        console.log('Copying ' + src.path + ' to ' + output);
        fs.copySync(src.path, output);

        return this;
    }


    /**
     * Construct the appropriate output path for the copy.
     *
     * @param  {Object} src
     * @return {string}
     */
    outputPath(src) {
        let output = new File(this.destination).parsePath();

        // If the src path is a file, but the output is a directory,
        // we have to append the src filename to the output path.
        if (src.isFile && output.isDir) {
            output = path.join(output.path, src.path.replace(this.files, ''));

            if (new File(output).parsePath().isDir) {
                output = path.join(output, src.file);
            }
        } else {
            output = output.path;
        }

        return output;
    }


    /**
     * Watch all files in the collection for changes.
     */
    watch() {
        chokidar.watch(this.files, { persistent: true })
            .on('change', updatedFile => this.copyTo(this.destination, updatedFile));
    }
}

module.exports = FileCollection;
