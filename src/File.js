let fs = require('fs');
let path = require('path');
let uglify = require('uglify-js');
let UglifyCss = require('clean-css');

class File {
    /**
     * Create a new File instance.
     *
     * @param {string} file
     */
    constructor(file) {
        this.file = file;
        this.fileType = path.parse(file).ext;
    }


    /**
     * Minify the file, if it is CSS or JS.
     */
    minify() {
        if (this.fileType === '.js') {
            this.write(uglify.minify(this.file).code);
        }

        if (this.fileType === '.css') {
            this.write(
                new UglifyCss().minify(this.read()).styles
            );
        }
    }


    /**
     * Determine if the given file exists.
     *
     * @param {string} file
     */
    static exists(file) {
        return fs.existsSync(file);
    }


    /**
     * Read the file.
     */
    read() {
        return fs.readFileSync(this.file, {
            encoding: 'utf-8'
        });
    }


    /**
     * Write the given contents to the file.
     *
     * @param {string} body
     */
    write(body) {
        fs.writeFileSync(this.file, body);

        return this;
    }


    /**
     * Delete/Unlink the current file.
     */
    delete() {
        if (fs.existsSync(this.file)) {
            fs.unlinkSync(this.file);
        }
    }


    /**
     * Parse the file path into segments.
     */
    parsePath() {
        let outputSegments = path.parse(this.file);

        return {
            path: this.file,
            hashedPath: `${outputSegments.dir}/${outputSegments.name}.[hash]${outputSegments.ext}`,
            base: outputSegments.dir,
            file: outputSegments.base,
            hashedFile: `${outputSegments.name}.[hash]${outputSegments.ext}`,
            name: outputSegments.name,
            isDir: ! outputSegments.ext,
            ext: outputSegments.ext
        };
    }
}

module.exports = File;
