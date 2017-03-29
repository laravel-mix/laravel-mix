let fs = require('fs');
let md5 = require('md5');
let chokidar = require('chokidar');
let mkdirp = require('mkdirp');
let options = require('./Options');
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
        this.fileType = path.extname(file);
    }


    /**
     * Static constructor.
     *
     * @param {string} file
     */
    static find(file) {
        return new File(file);
    }


    /**
     * Make all nested directories in the current file path.
     */
    makeDirectories() {
        mkdirp.sync(this.parsePath().base);

        return this;
    }


    /**
     * Minify the file, if it is CSS or JS.
     */
    minify() {
        if (this.fileType === '.js') {
            this.write(uglify.minify(this.file, options.uglify).code);
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
        if (typeof body === 'object') {
            body = JSON.stringify(body, null, 2);
        }

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
     * Watch the current file for changes.
     *
     * @param {Function} callback
     */
    watch(callback) {
        return chokidar.watch(
            this.path(), { persistent: true }
        ).on('change', () => callback(this));
    }


    /**
     * Fetch the full path to the file.
     *
     * @return {string}
     */
    path() {
        return path.resolve(this.file);
    }


    /**
     * Version the current file.
     */
    version() {
        let contents = this.read();

        let versionedPath = this.versionedPath(md5(contents));

        return new File(versionedPath).write(contents);
    }


    /**
     * Fetch a full, versioned path to the file.
     *
     * @param {string} hash
     */
    versionedPath(hash) {
        if (! hash) hash = md5(this.read());

        return this.parsePath().hashedPath.replace('[hash]', hash);
    }


    /**
     * Parse the file path into segments.
     */
    parsePath() {
        let outputSegments = path.parse(this.file);

        return {
            path: this.file,
            pathWithoutExt: path.join(outputSegments.dir, `${outputSegments.name}`),
            hashedPath: path.join(outputSegments.dir, `${outputSegments.name}.[hash]${outputSegments.ext}`),
            base: outputSegments.dir,
            file: outputSegments.base,
            hashedFile: `${outputSegments.name}.[hash]${outputSegments.ext}`,
            name: outputSegments.name,
            isDir: ! outputSegments.ext,
            ext: outputSegments.ext
        };
    }


    /**
     * Rename the file.
     *
     * @param {string} to
     */
    rename(to) {
        fs.renameSync(this.file, to);

        this.file = to;

        return this;
    }
}

module.exports = File;
